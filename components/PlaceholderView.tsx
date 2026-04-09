"use client";

import { useEffect, useRef, useState } from "react";
import { MenuId } from "./Sidebar";
import {
  createChatSession,
  getChatMessages,
  sendChatMessage,
  getWebSocketURL,
  uploadDocument,
  UploadResult,
} from "@/services/api";
import { ChatMessage } from "@/types/chat";

interface PlaceholderViewProps {
  menuId: MenuId;
}

export default function PlaceholderView({ menuId }: PlaceholderViewProps) {
  switch (menuId) {
    case "chatbot":       return <ChatbotView />;
    case "search":        return <SearchView />;
    case "summary":       return <SummaryView />;
    case "explanation":   return <ExplanationView />;
    case "draft":         return <DraftView />;
    case "contract":      return <ContractView />;
    case "case-mapping":  return <CaseMappingView />;
    case "notifications": return <NotificationsView />;
    case "statistics":    return <StatisticsView />;
    default:              return null;
  }
}

// ── Shared UI Primitives ─────────────────────────────────────────────────────

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function PlaceholderLine({ width = "full" }: { width?: string }) {
  const w = width === "full" ? "w-full" : width === "3/4" ? "w-3/4" : width === "1/2" ? "w-1/2" : "w-2/3";
  return <div className={`h-3 bg-gray-200 rounded-full ${w}`} />;
}

function PlaceholderBlock({ height = "h-24" }: { height?: string }) {
  return (
    <div className={`w-full ${height} bg-gray-50 rounded-lg border-2 border-dashed border-gray-200`} />
  );
}

function PrimaryButton({ label }: { label: string }) {
  return (
    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
      {label}
    </button>
  );
}

function SecondaryButton({ label }: { label: string }) {
  return (
    <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors">
      {label}
    </button>
  );
}

// ── Chatbot View ─────────────────────────────────────────────────────────────

function ChatbotView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isWaitingReply, setIsWaitingReply] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialise session + WebSocket on mount
  useEffect(() => {
    let ws: WebSocket | null = null;
    let cancelled = false;

    async function init() {
      try {
        const session = await createChatSession();
        if (cancelled) return;
        setSessionId(session.id);

        const existing = await getChatMessages(session.id);
        if (cancelled) return;
        setMessages(existing);

        const wsUrl = getWebSocketURL();
        ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => { if (!cancelled) setWsConnected(true); };
        ws.onclose = () => { if (!cancelled) setWsConnected(false); };
        ws.onerror = () => { if (!cancelled) setWsConnected(false); };

        ws.onmessage = (event: MessageEvent) => {
          if (cancelled) return;
          try {
            const payload = JSON.parse(event.data as string);
            if (payload.type === "chat_message") {
              setMessages((prev) => [...prev, payload.data as ChatMessage]);
              setIsWaitingReply(false);
            }
          } catch {
            // ignore malformed frames
          }
        };
      } catch {
        if (!cancelled) setInitError("Gagal menginisialisasi chat. Silakan muat ulang halaman.");
      }
    }

    init();

    return () => {
      cancelled = true;
      ws?.close();
    };
  }, []);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isWaitingReply]);

  const handleSend = async () => {
    if (!input.trim() || sessionId === null || isSending) return;

    const content = input.trim();
    setInput("");
    setIsSending(true);

    try {
      const userMsg = await sendChatMessage(sessionId, content);
      setMessages((prev) => [...prev, userMsg]);
      setIsWaitingReply(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          chat_session_id: sessionId,
          role: "assistant",
          content: "Gagal mengirim pesan. Silakan coba lagi.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (initError) {
    return (
      <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
        <PageHeader
          title="Chatbot Q&A Hukum"
          subtitle="Tanyakan pertanyaan hukum Anda secara natural dan dapatkan jawaban yang akurat."
        />
        <Card className="flex items-center justify-center flex-1">
          <p className="text-sm text-red-500">{initError}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
      <PageHeader
        title="Chatbot Q&A Hukum"
        subtitle="Tanyakan pertanyaan hukum Anda secara natural dan dapatkan jawaban yang akurat."
      />

      <Card className="flex flex-col flex-1 min-h-0">
        {/* Connection status badge */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              wsConnected
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                wsConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            {wsConnected ? "Terhubung" : "Menghubungkan..."}
          </span>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0 pr-1">
          {/* Greeting bubble */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
              AI
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
              <p className="text-sm text-gray-700">
                Halo! Saya adalah asisten hukum AI. Silakan ajukan pertanyaan hukum Anda.
              </p>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Mulai percakapan baru di bawah...</p>
            </div>
          )}

          {messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex gap-3 justify-end">
                <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                  <p className="text-sm text-white">{msg.content}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-600 text-xs font-bold">
                  U
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
                  AI
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                  <p className="text-sm text-gray-700">{msg.content}</p>
                </div>
              </div>
            )
          )}

          {/* Typing indicator while waiting for AI reply */}
          {isWaitingReply && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm">
                AI
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="flex gap-2 border-t border-gray-100 pt-4 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pertanyaan hukum Anda di sini..."
            disabled={isSending || !wsConnected}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim() || !wsConnected}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            {isSending ? "..." : "Kirim"}
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── Search View ──────────────────────────────────────────────────────────────

function SearchView() {
  return (
    <div>
      <PageHeader
        title="Pencarian Regulasi & Putusan yang Cerdas"
        subtitle="Temukan regulasi dan putusan pengadilan yang relevan dengan cepat dan akurat."
      />
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari regulasi, undang-undang, atau putusan..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          readOnly
        />
        <PrimaryButton label="Cari" />
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {["Semua", "Undang-Undang", "Peraturan Pemerintah", "Putusan MA", "Putusan MK"].map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Undang-Undang</span>
                <span className="text-xs text-gray-400">2024</span>
              </div>
              <PlaceholderLine width="3/4" />
              <PlaceholderLine width="full" />
              <PlaceholderLine width="1/2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Summary View ─────────────────────────────────────────────────────────────

type UploadState =
  | { status: "idle" }
  | { status: "selected"; file: File }
  | { status: "uploading"; file: File }
  | { status: "success"; file: File; result: UploadResult }
  | { status: "error"; message: string };

const ACCEPTED_TYPES = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_SIZE_BYTES = 50 * 1024 * 1024;

function SummaryView() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Tipe file tidak didukung. Gunakan PDF atau DOCX.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return "Ukuran file melebihi batas maksimum 50MB.";
    }
    return null;
  }

  function selectFile(file: File) {
    const err = validateFile(file);
    if (err) {
      setState({ status: "error", message: err });
      return;
    }
    setState({ status: "selected", file });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) selectFile(file);
  }

  async function handleUpload() {
    if (state.status !== "selected") return;
    const { file } = state;
    setState({ status: "uploading", file });
    try {
      const result = await uploadDocument(file);
      setState({ status: "success", file, result });
    } catch (err: unknown) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Gagal mengunggah dokumen",
      });
    }
  }

  function handleReset() {
    setState({ status: "idle" });
  }

  const isUploading = state.status === "uploading";
  const selectedFile = state.status === "selected" || state.status === "uploading"
    ? state.file : state.status === "success" ? state.file : null;

  return (
    <div>
      <PageHeader
        title="Ringkasan Dokumen Hukum Otomatis"
        subtitle="Unggah dokumen hukum Anda dan dapatkan ringkasan yang komprehensif."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upload card */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Unggah Dokumen</h3>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={[
              "border-2 border-dashed rounded-xl p-8 text-center space-y-3 transition-colors",
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 cursor-pointer",
              isUploading ? "pointer-events-none opacity-60" : "",
            ].join(" ")}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            {selectedFile ? (
              <div>
                <p className="text-sm font-medium text-blue-700 truncate max-w-xs mx-auto">{selectedFile.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700">Seret &amp; lepas dokumen di sini</p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX hingga 50MB</p>
              </div>
            )}
            <p className="text-xs text-blue-500 font-medium">Klik untuk memilih file</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleInputChange}
          />

          {/* Error message */}
          {state.status === "error" && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {state.message}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            {(state.status === "selected") && (
              <>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                  Unggah Dokumen
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
                >
                  Batal
                </button>
              </>
            )}
            {state.status === "uploading" && (
              <button disabled className="px-4 py-2 bg-blue-400 text-white text-sm font-semibold rounded-lg cursor-not-allowed flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Mengunggah...
              </button>
            )}
            {(state.status === "success" || state.status === "error") && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
              >
                Unggah File Lain
              </button>
            )}
          </div>
        </Card>

        {/* Result card */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Hasil Ringkasan</h3>
          {state.status === "success" ? (
            <div className="space-y-4">
              {/* Upload success banner */}
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <svg className="w-5 h-5 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-green-800">Dokumen berhasil diunggah</p>
                  <p className="text-xs text-green-700 truncate mt-0.5">{state.result.filename}</p>
                </div>
              </div>

              {/* File details */}
              <div className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded-lg p-3">
                <p><span className="font-medium text-gray-700">Kunci:</span> {state.result.file_key}</p>
                <p><span className="font-medium text-gray-700">Ukuran:</span> {(state.result.size / 1024).toFixed(1)} KB</p>
                <p>
                  <span className="font-medium text-gray-700">URL Publik:</span>{" "}
                  <a
                    href={state.result.public_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {state.result.public_url}
                  </a>
                </p>
              </div>

              {/* Summary placeholder — wire to AI when ready */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Ringkasan Dokumen</p>
                <PlaceholderBlock height="h-32" />
                <p className="text-xs text-gray-400 text-center mt-2">
                  Ringkasan otomatis akan tersedia setelah integrasi AI selesai
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <PlaceholderBlock height="h-48" />
              <p className="text-xs text-gray-400 text-center">
                Ringkasan akan muncul di sini setelah dokumen diproses
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ── Explanation View ─────────────────────────────────────────────────────────

function ExplanationView() {
  return (
    <div>
      <PageHeader
        title="Penjelasan Pasal untuk Orang Awam"
        subtitle="Pahami pasal-pasal hukum yang rumit dengan penjelasan sederhana dan mudah dimengerti."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Masukkan Pasal</h3>
          <textarea
            placeholder="Tempel teks pasal hukum di sini, atau masukkan nomor pasal (contoh: Pasal 1338 KUHPerdata)..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
          <div className="mt-3">
            <PrimaryButton label="Jelaskan Pasal Ini" />
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Penjelasan Sederhana</h3>
          <div className="space-y-3">
            <PlaceholderBlock height="h-52" />
            <p className="text-xs text-gray-400 text-center">Penjelasan akan tampil di sini</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Draft View ───────────────────────────────────────────────────────────────

function DraftView() {
  return (
    <div>
      <PageHeader
        title="Draft Dokumen Hukum Otomatis"
        subtitle="Buat draft dokumen hukum secara otomatis berdasarkan kebutuhan Anda."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {["Surat Perjanjian", "Kontrak Kerja", "Surat Kuasa", "Akta Jual Beli", "Surat Somasi", "MOU", "NDA", "Perjanjian Sewa"].map(
          (template, i) => (
            <button
              key={template}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${
                i === 0
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
              }`}
            >
              <span className="text-sm font-medium text-gray-800">{template}</span>
            </button>
          )
        )}
      </div>
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Editor Dokumen</h3>
          <div className="flex gap-2">
            <SecondaryButton label="Pratinjau" />
            <PrimaryButton label="Buat Draft" />
          </div>
        </div>
        <PlaceholderBlock height="h-72" />
      </Card>
    </div>
  );
}

// ── Contract Analysis View ───────────────────────────────────────────────────

function ContractView() {
  return (
    <div>
      <PageHeader
        title="Analisis Risiko Hukum Kontrak"
        subtitle="Unggah kontrak Anda dan temukan potensi risiko hukum secara otomatis."
      />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <h3 className="font-semibold text-gray-800 mb-4">Unggah Kontrak</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 font-medium">Unggah dokumen kontrak</p>
              <p className="text-xs text-gray-400">PDF, DOCX</p>
              <SecondaryButton label="Pilih File" />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="h-full">
            <h3 className="font-semibold text-gray-800 mb-4">Hasil Analisis Risiko</h3>
            <div className="space-y-3">
              {[
                { level: "Tinggi", cls: "text-red-700 bg-red-50 border-red-200" },
                { level: "Sedang", cls: "text-yellow-700 bg-yellow-50 border-yellow-200" },
                { level: "Rendah", cls: "text-green-700 bg-green-50 border-green-200" },
              ].map(({ level, cls }) => (
                <div key={level} className={`p-3 rounded-lg border ${cls}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Risiko {level}</span>
                    <span className="text-xs opacity-60">0 item</span>
                  </div>
                  <PlaceholderLine />
                </div>
              ))}
              <p className="text-xs text-gray-400 text-center pt-2">Unggah kontrak untuk melihat analisis risiko</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Case Mapping View ────────────────────────────────────────────────────────

function CaseMappingView() {
  return (
    <div>
      <PageHeader
        title="Pemetaan Risiko Kasus dari Input User"
        subtitle="Deskripsikan kasus Anda dan lihat pemetaan risiko hukum secara komprehensif."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Deskripsi Kasus</h3>
          <textarea
            placeholder="Ceritakan kasus hukum Anda secara lengkap. Sertakan pihak yang terlibat, kronologi kejadian, dan pertanyaan hukum yang ingin dijawab..."
            rows={8}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            readOnly
          />
          <div className="mt-3">
            <PrimaryButton label="Analisis Kasus" />
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-800 mb-3">Peta Risiko</h3>
          <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Peta risiko akan tampil di sini</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Notifications View ───────────────────────────────────────────────────────

function NotificationsView() {
  return (
    <div>
      <PageHeader
        title="Notifikasi Perubahan Regulasi & Putusan"
        subtitle="Pantau perubahan regulasi dan putusan terbaru yang relevan dengan kebutuhan Anda."
      />
      <div className="flex gap-2 mb-5 flex-wrap">
        {["Semua", "Regulasi Baru", "Putusan MA", "Putusan MK", "Belum Dibaca"].map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <Card>
        <div className="py-16 text-center space-y-3">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <p className="text-gray-700 font-medium">Belum ada notifikasi</p>
          <p className="text-sm text-gray-400">Atur preferensi notifikasi untuk memantau regulasi dan putusan yang relevan.</p>
          <PrimaryButton label="Atur Preferensi" />
        </div>
      </Card>
    </div>
  );
}

// ── Statistics View ──────────────────────────────────────────────────────────

function StatisticsView() {
  return (
    <div>
      <PageHeader
        title="Statistik Tren Yuridis & Insight"
        subtitle="Analisis tren hukum dan insight berdasarkan data regulasi dan putusan terkini."
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Regulasi Baru (Bulan Ini)", value: "—" },
          { label: "Putusan MA Terbaru", value: "—" },
          { label: "Kasus Dianalisis", value: "—" },
          { label: "Rata-rata Waktu Proses", value: "—" },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Tren Regulasi per Bulan</h3>
          <PlaceholderBlock height="h-52" />
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Distribusi Jenis Putusan</h3>
          <PlaceholderBlock height="h-52" />
        </Card>
      </div>
    </div>
  );
}
