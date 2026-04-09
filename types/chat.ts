export interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  chat_session_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WSChatEvent {
  type: "chat_message";
  data: ChatMessage;
}
