export type ToneType = 'Friendly' | 'Professional' | 'Warm' | 'Luxury';
export type ReplyLengthType = 'Short' | 'Medium' | 'Detailed';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface SalonProfile {
  id: string;
  user_id: string;
  salon_name: string;
  location: string;
  services: string;
  tone: ToneType;
  reply_length: ReplyLengthType;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  salon_profile_id: string;
  customer_name: string | null;
  review_text: string;
  star_rating: number; // 1 to 5
  created_at: string;
}

export interface GeneratedResponse {
  id: string;
  review_id: string;
  user_id: string;
  public_reply: string;
  private_followup: string;
  owner_action: string;
  human_review_required: boolean;
  created_at: string;
}

export interface UsageEvent {
  id: string;
  user_id: string;
  event_type: 'generate_response' | string;
  created_at: string;
}

export interface ReviewWithResponse {
  review: Review;
  response: GeneratedResponse;
  salon?: SalonProfile;
}

export interface GenerationResult {
  public_reply: string;
  private_followup: string;
  owner_action: string;
  human_review_required: boolean;
  human_review_reason?: string | null;
}
