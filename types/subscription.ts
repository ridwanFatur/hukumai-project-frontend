export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface Subscription {
  plan_slug: string;
  plan_name: string;
  plan_price: number;
  features: string[];
  status: string;
  id?: number;
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
}
