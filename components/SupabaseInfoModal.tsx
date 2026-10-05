import React, { useState } from 'react';
import { X, Database, Check, Copy, Shield, Key, Server, ExternalLink } from 'lucide-react';
import { isRealSupabaseConfigured } from '../lib/supabase';

interface SupabaseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseInfoModal: React.FC<SupabaseInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const schemaSql = `-- SalonReview Rescue: Exact Supabase Database Schema

-- 1. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Salon Profiles
create table if not exists public.salon_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  salon_name text not null,
  location text not null default '',
  services text not null default '',
  tone text not null default 'Warm',
  reply_length text not null default 'Medium',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  salon_profile_id uuid references public.salon_profiles(id) on delete cascade not null,
  customer_name text,
  review_text text not null,
  star_rating int not null check (star_rating between 1 and 5),
  created_at timestamptz default now() not null
);

-- 4. Generated Responses
create table if not exists public.generated_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.reviews(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  public_reply text not null,
  private_followup text not null,
  owner_action text not null,
  human_review_required boolean default false not null,
  created_at timestamptz default now() not null
);

-- 5. Usage Events
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null,
  created_at timestamptz default now() not null
);

-- Row Level Security (RLS) policies for user data isolation
alter table public.profiles enable row level security;
alter table public.salon_profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.generated_responses enable row level security;
alter table public.usage_events enable row level security;

create policy "Users manage own profiles" on public.profiles
  for all using (auth.uid() = id);

create policy "Users manage own salon profiles" on public.salon_profiles
  for all using (auth.uid() = user_id);

create policy "Users manage own reviews" on public.reviews
  for all using (auth.uid() = user_id);

create policy "Users manage own generated responses" on public.generated_responses
  for all using (auth.uid() = user_id);

create policy "Users manage own usage events" on public.usage_events
  for all using (auth.uid() = user_id);`;

  const envSample = `GEMINI_API_KEY="your-gemini-api-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"`;

  const copySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#ded8cc] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#ece7de] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2c2724] text-[#3ecf8e] flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#1c1a18]">
                Supabase Database & Auth Configuration
              </h3>
              <p className="text-xs text-[#736a60]">
                Status: {isRealSupabaseConfigured ? '🟢 Connected to Live Supabase' : '🟡 Running in Compliant Sandbox Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#827465] hover:text-[#1c1a18] hover:bg-[#ede8df] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-[#423b36]">
          {/* Status summary */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            isRealSupabaseConfigured
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#faf7f0] border-[#e2dcd2] text-[#52493f]'
          }`}>
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[#3ecf8e]" />
            <div className="space-y-1">
              <div className="font-semibold text-sm">
                {isRealSupabaseConfigured ? 'Connected to Live Supabase Cloud' : 'Local Compliant Supabase Sandbox Active'}
              </div>
              <p className="leading-relaxed">
                {isRealSupabaseConfigured
                  ? 'Application queries are actively synced with your Supabase database tables with authenticated user ID isolation.'
                  : 'SalonReview Rescue is running with an in-memory/localStorage Supabase client that mimics the exact profiles, salon_profiles, reviews, generated_responses, and usage_events schema. When you provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment, it will automatically connect to your cloud project.'}
              </p>
            </div>
          </div>

          {/* Required Secrets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#5c544c] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Required Secrets & Environment Variables:
              </span>
              <button
                onClick={copyEnv}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-[#ded8cc] hover:bg-[#f5f1ea]"
              >
                {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? 'Copied' : 'Copy .env snippet'}</span>
              </button>
            </div>
            <div className="p-3 bg-[#1e1c1b] text-[#e8e2d8] rounded-md font-mono text-[11px] space-y-1">
              <div><span className="text-[#d9caa9]">GEMINI_API_KEY</span>="MY_GEMINI_API_KEY" (Required for AI generation)</div>
              <div><span className="text-[#3ecf8e]">VITE_SUPABASE_URL</span>="https://your-project.supabase.co"</div>
              <div><span className="text-[#3ecf8e]">VITE_SUPABASE_ANON_KEY</span>="your-anon-key"</div>
              <div><span className="text-[#8c8275]">SUPABASE_SERVICE_ROLE_KEY</span>="your-service-role-key" (Optional, server-only)</div>
            </div>
          </div>

          {/* Schema SQL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#5c544c] flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Existing Database Schema (5 Tables & RLS):
              </span>
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-[#ded8cc] hover:bg-[#f5f1ea]"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL Schema'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#f5f2eb] rounded-md border border-[#e0dad0] text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed text-[#2c2724]">
              {schemaSql}
            </pre>
            <p className="mt-1.5 text-[11px] text-[#736a60]">
              Tables: <strong>profiles</strong>, <strong>salon_profiles</strong>, <strong>reviews</strong>, <strong>generated_responses</strong>, <strong>usage_events</strong>.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-[#ece7de] bg-[#faf8f4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2c2724] text-white text-xs font-semibold rounded-md hover:bg-[#1a1715]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
