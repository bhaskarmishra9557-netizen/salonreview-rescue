/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase,  } from './lib/supabase';
import type { 
  Profile, 
  SalonProfile, 
  Review, 
  GeneratedResponse, 
  ReviewWithResponse, 
  GenerationResult 
} from './types/database';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { SalonSetup } from './components/SalonSetup';
import { Dashboard } from './components/Dashboard';
import { NewReviewModal } from './components/NewReviewModal';
import { ReviewHistory } from './components/ReviewHistory';
import { UpgradeModal } from './components/UpgradeModal';
import { SupabaseInfoModal } from './components/SupabaseInfoModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // App Navigation
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'new-review' | 'history' | 'setup'>('landing');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  

  // Salon State
  const [salonProfile, setSalonProfile] = useState<SalonProfile | null>(null);
  const [reviewsWithResponses, setReviewsWithResponses] = useState<ReviewWithResponse[]>([]);
  const [generationsThisMonth, setGenerationsThisMonth] = useState<number>(0);
  const MAX_FREE_GENERATIONS = 10;

  // Initialize Auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setCurrentUser(data.user);
          await loadUserData(data.user.id);
        } else {
          setCurrentUser(null);
          setActiveTab('landing');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoadingAuth(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      setCurrentUser(user);
      if (user) {
        await loadUserData(user.id);
      } else {
        setSalonProfile(null);
        setReviewsWithResponses([]);
        setGenerationsThisMonth(0);
        setActiveTab('landing');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Load User Salon Data & Review History
  const loadUserData = async (userId: string) => {
    try {
      // 1. Fetch Salon Profile
      const { data: salonData } = await supabase
        .from('salon_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const salon = salonData && salonData.length > 0 ? salonData[0] : null;
      setSalonProfile(salon);

      if (!salon) {
        setActiveTab('setup');
        return;
      }

      // 2. Fetch Reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // 3. Fetch Generated Responses
      const { data: responsesData } = await supabase
        .from('generated_responses')
        .select('*')
        .eq('user_id', userId);

      // Calculate current calendar month usage
      const now = new Date();
      const startOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

      // 4. Fetch Usage Events for current calendar month
      const { data: usageData } = await supabase
        .from('usage_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startOfCurrentMonth);

      const currentMonthCount = (usageData || []).filter(
        u => u.event_type === 'review_generation' || u.event_type === 'generate_response'
      ).length;

      // Combine Reviews with Responses
      const combined: ReviewWithResponse[] = [];
      const responsesMap = new Map<string, GeneratedResponse>();
      (responsesData || []).forEach((resp: GeneratedResponse) => {
        responsesMap.set(resp.review_id, resp);
      });

      (reviewsData || []).forEach((rev: Review) => {
        const resp = responsesMap.get(rev.id);
        if (resp) {
          combined.push({
            review: rev,
            response: resp,
            salon: salon,
          });
        }
      });

      setReviewsWithResponses(combined);
      setGenerationsThisMonth(currentMonthCount);
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Error loading salon data from Supabase:', err);
    }
  };

  // Complete AI Review Generation Flow
  // 1. Verifies authenticated user & checks calendar month usage (< 10)
  // 2. Generates 3 outputs via Gemini (Public Reply, Private Follow-up, Owner Action)
  // 3. Inserts into reviews & generated_responses
  // 4. Inserts usage event with event_type = "review_generation"
  // 5. Refreshes dashboard statistics immediately
  const handleProcessNewReview = async (data: {
    review_text: string;
    star_rating: number;
    customer_name?: string;
  }): Promise<{ result: GenerationResult; review: Review; response: GeneratedResponse }> => {
    if (!currentUser || !salonProfile) {
      throw new Error('Please log in and configure your salon profile first.');
    }

    // Check calendar month usage
    const now = new Date();
    const startOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

    const { data: currentMonthEvents, error: usageCheckErr } = await supabase
      .from('usage_events')
      .select('id, event_type')
      .eq('user_id', currentUser.id)
      .gte('created_at', startOfCurrentMonth);

    if (usageCheckErr) {
      console.warn('Usage check warning:', usageCheckErr);
    }

    const currentUsageCount = (currentMonthEvents || []).filter(
      e => e.event_type === 'review_generation' || e.event_type === 'generate_response'
    ).length;

    if (currentUsageCount >= MAX_FREE_GENERATIONS) {
      setIsUpgradeModalOpen(true);
      throw new Error("You've used all 10 free reviews this month.");
    }

    // Get current session token to authenticate server request securely
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token || '';

    // Call Gemini API via server route
    const payload = {
      review_text: data.review_text,
      star_rating: data.star_rating,
      customer_name: data.customer_name,
      salon_name: salonProfile.salon_name,
      location: salonProfile.location,
      services: salonProfile.services,
      tone: salonProfile.tone,
      reply_length: salonProfile.reply_length,
    };

    const res = await fetch('/api/generate-response', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      if (res.status === 403 || errJson.limitReached) {
        setIsUpgradeModalOpen(true);
        throw new Error("You've used all 10 free reviews this month.");
      }
      throw new Error(errJson.error || 'Failed to generate review response with Gemini.');
    }

    const result: GenerationResult = await res.json();

    // 1. Insert review into real Supabase reviews table
    const { data: insertedReview, error: revErr } = await supabase
      .from('reviews')
      .insert({
        user_id: currentUser.id,
        salon_profile_id: salonProfile.id,
        customer_name: data.customer_name?.trim() || null,
        review_text: data.review_text.trim(),
        star_rating: data.star_rating,
      })
      .select()
      .single();

    if (revErr) {
      console.error('Failed to insert review into Supabase:', revErr);
      throw new Error('Database error saving review: ' + revErr.message);
    }

    // 2. Insert generated response into real Supabase generated_responses table
    const { data: insertedResponse, error: respErr } = await supabase
      .from('generated_responses')
      .insert({
        review_id: insertedReview.id,
        user_id: currentUser.id,
        public_reply: result.public_reply,
        private_followup: result.private_followup,
        owner_action: result.owner_action,
        human_review_required: Boolean(result.human_review_required),
      })
      .select()
      .single();

    if (respErr) {
      console.error('Failed to insert generated response into Supabase:', respErr);
      throw new Error('Database error saving response: ' + respErr.message);
    }

    // 3. Insert usage event into real Supabase usage_events table (ONLY after successful generation & successful save)
    const { error: usageInsertErr } = await supabase
      .from('usage_events')
      .insert({
        user_id: currentUser.id,
        event_type: 'review_generation',
      });

    if (usageInsertErr) {
      console.warn('Warning inserting usage event:', usageInsertErr);
    }

    // 4. Refresh the usage count immediately from database after successful generation & save
    const { data: freshUsage } = await supabase
      .from('usage_events')
      .select('id, event_type')
      .eq('user_id', currentUser.id)
      .gte('created_at', startOfCurrentMonth);

    const updatedUsageCount = (freshUsage || []).filter(
      e => e.event_type === 'review_generation' || e.event_type === 'generate_response'
    ).length;

    // Refresh dashboard statistics immediately
    setReviewsWithResponses(prev => [
      { review: insertedReview, response: insertedResponse, salon: salonProfile },
      ...prev,
    ]);
    setGenerationsThisMonth(updatedUsageCount);

    return { result, review: insertedReview, response: insertedResponse };
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setSalonProfile(null);
    setActiveTab('landing');
  };

  const openAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2c2724] text-white flex items-center justify-center font-display font-bold text-xl animate-pulse">
            S
          </div>
          <span className="text-xs font-medium text-[#736a60]">Initializing SalonReview Rescue...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans text-[#1a1918]">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        salonProfile={salonProfile}
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (!currentUser && tab !== 'landing') {
            openAuth('signin');
            return;
          }
          if (currentUser && !salonProfile && tab !== 'setup') {
            setActiveTab('setup');
            return;
          }
          setActiveTab(tab);
        }}
        onOpenAuth={openAuth}
        onSignOut={handleSignOut}
        onOpenSupabaseInfo={() => setIsSupabaseModalOpen(true)}
        isLiveSupabase={isRealSupabaseConfigured}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && !currentUser && (
          <LandingPage
            onGetStarted={() => openAuth('signup')}
            onOpenAuth={openAuth}
          />
        )}

        {activeTab === 'setup' && currentUser && (
          <SalonSetup
            userId={currentUser.id}
            initialProfile={salonProfile}
            onSave={(profile) => {
              setSalonProfile(profile);
              setActiveTab('dashboard');
            }}
            onCancel={salonProfile ? () => setActiveTab('dashboard') : undefined}
          />
        )}

        {activeTab === 'dashboard' && currentUser && salonProfile && (
          <Dashboard
            salonProfile={salonProfile}
            reviewsWithResponses={reviewsWithResponses}
            generationsThisMonth={generationsThisMonth}
            maxFreeGenerations={MAX_FREE_GENERATIONS}
            onNavigateToNewReview={() => setActiveTab('new-review')}
            onNavigateToHistory={() => setActiveTab('history')}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            onEditSalonProfile={() => setActiveTab('setup')}
          />
        )}

        {activeTab === 'new-review' && currentUser && salonProfile && (
          <NewReviewModal
            salonProfile={salonProfile}
            remainingGenerations={Math.max(0, MAX_FREE_GENERATIONS - generationsThisMonth)}
            onProcessReview={handleProcessNewReview}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          />
        )}

        {activeTab === 'history' && currentUser && salonProfile && (
          <ReviewHistory
            reviewsWithResponses={reviewsWithResponses}
            onNavigateToNewReview={() => setActiveTab('new-review')}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          // Once signed in, loadUserData will route to setup or dashboard
        }}
      />

      {/* Pro Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        generationsCount={generationsThisMonth}
      />

     
      />
    </div>
  );
}
