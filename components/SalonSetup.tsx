import React, { useState, useEffect } from 'react';
import { Store, MapPin, Scissors, Volume2, AlignLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SalonProfile, ToneType, ReplyLengthType } from '../types/database';

interface SalonSetupProps {
  userId: string;
  initialProfile?: SalonProfile | null;
  onSave: (profile: SalonProfile) => void;
  onCancel?: () => void;
}

export const SalonSetup: React.FC<SalonSetupProps> = ({
  userId,
  initialProfile,
  onSave,
  onCancel,
}) => {
  const [salonName, setSalonName] = useState(initialProfile?.salon_name || '');
  const [location, setLocation] = useState(initialProfile?.location || '');
  const [services, setServices] = useState(
    initialProfile?.services || 'Balayage & Blonding, Precision Haircuts, Blowouts, Keratin Treatments'
  );
  const [tone, setTone] = useState<ToneType>(initialProfile?.tone || 'Warm');
  const [replyLength, setReplyLength] = useState<ReplyLengthType>(initialProfile?.reply_length || 'Medium');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setSalonName(initialProfile.salon_name);
      setLocation(initialProfile.location);
      setServices(initialProfile.services);
      setTone(initialProfile.tone);
      setReplyLength(initialProfile.reply_length);
    }
  }, [initialProfile]);

  const tones: { type: ToneType; label: string; desc: string }[] = [
    { type: 'Friendly', label: 'Friendly', desc: 'Approachable, warm, energetic, and neighborly.' },
    { type: 'Professional', label: 'Professional', desc: 'Polished, articulate, courteous, and standard business etiquette.' },
    { type: 'Warm', label: 'Warm', desc: 'Deeply empathetic, heartfelt, hospitable, and reassuring.' },
    { type: 'Luxury', label: 'Luxury', desc: 'Elevated, discreet, refined, and bespoke salon hospitality.' },
  ];

  const lengths: { type: ReplyLengthType; label: string; desc: string }[] = [
    { type: 'Short', label: 'Short', desc: '1–2 sentences. Fast, focused, to-the-point.' },
    { type: 'Medium', label: 'Medium', desc: '3–4 sentences. Balanced, thorough, and empathetic.' },
    { type: 'Detailed', label: 'Detailed', desc: '5–6 sentences. Comprehensive with step-by-step resolution.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salonName.trim()) {
      setErrorMsg('Please enter your salon name');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (initialProfile?.id) {
        // Update existing salon profile
        const { data, error } = await supabase
          .from('salon_profiles')
          .update({
            salon_name: salonName.trim(),
            location: location.trim(),
            services: services.trim(),
            tone,
            reply_length: replyLength,
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialProfile.id);

        if (error) throw error;
        
        onSave({
          ...initialProfile,
          salon_name: salonName.trim(),
          location: location.trim(),
          services: services.trim(),
          tone,
          reply_length: replyLength,
          updated_at: new Date().toISOString(),
        });
      } else {
        // Insert new salon profile
        const newRecord = {
          user_id: userId,
          salon_name: salonName.trim(),
          location: location.trim(),
          services: services.trim(),
          tone,
          reply_length: replyLength,
        };

        const { data, error } = await supabase
          .from('salon_profiles')
          .insert(newRecord)
          .select()
          .single();

        if (error) throw error;
        onSave(data || (newRecord as unknown as SalonProfile));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save salon profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white rounded-xl border border-[#ded8cc] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6 sm:px-8 border-b border-[#ece7de] bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2c2724] text-white flex items-center justify-center">
              <Store className="w-5 h-5 text-[#d9caa9]" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1c1a18]">
                {initialProfile ? 'Edit Salon Profile' : 'Step 1: Salon Setup & Preferences'}
              </h2>
              <p className="text-xs sm:text-sm text-[#736a60] mt-0.5">
                SalonReview Rescue personalizes every public response, DM, and owner action to your specific brand.
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="m-6 p-3.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Salon Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-1.5">
                Salon Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
                  <Store className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="e.g. Maison de Beauté or Strand Barbershop"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-1.5">
                Location / City & State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Austin, TX or Brooklyn, NY"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-1.5">
              Core Salon Services
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-[#8c8275]">
                <Scissors className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="e.g. Balayage, Lived-in Color, Precision Haircuts, Keratin Smoothing, Extensions, Bridal Styling"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
              />
            </div>
            <p className="text-[11px] text-[#827465] mt-1">
              Used by AI to ensure accurate terminology when referencing hair/beauty treatments.
            </p>
          </div>

          {/* Preferred Tone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-2.5">
              Preferred Voice & Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tones.map((t) => (
                <button
                  type="button"
                  key={t.type}
                  onClick={() => setTone(t.type)}
                  className={`p-3.5 rounded-lg border text-left transition-all flex items-start justify-between ${
                    tone === t.type
                      ? 'border-[#2c2724] bg-[#faf8f4] ring-1 ring-[#2c2724]'
                      : 'border-[#ded8cc] bg-white hover:border-[#b8b0a2]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-[#1c1a18]">{t.label}</div>
                    <div className="text-[11px] text-[#736a60] mt-0.5 leading-snug">{t.desc}</div>
                  </div>
                  {tone === t.type && <Check className="w-4 h-4 text-[#2c2724] shrink-0 mt-0.5 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* Reply Length */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c544c] mb-2.5">
              Public Reply Length
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {lengths.map((l) => (
                <button
                  type="button"
                  key={l.type}
                  onClick={() => setReplyLength(l.type)}
                  className={`p-3.5 rounded-lg border text-left transition-all flex items-start justify-between ${
                    replyLength === l.type
                      ? 'border-[#2c2724] bg-[#faf8f4] ring-1 ring-[#2c2724]'
                      : 'border-[#ded8cc] bg-white hover:border-[#b8b0a2]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-[#1c1a18]">{l.label}</div>
                    <div className="text-[11px] text-[#736a60] mt-0.5 leading-snug">{l.desc}</div>
                  </div>
                  {replyLength === l.type && <Check className="w-4 h-4 text-[#2c2724] shrink-0 mt-0.5 ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#ece7de] flex items-center justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-medium text-[#5c544c] hover:text-[#1c1a18] rounded-md transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#2c2724] hover:bg-[#1a1715] disabled:opacity-60 text-white text-xs font-semibold rounded-md transition-colors shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d9caa9]" />
              <span>{loading ? 'Saving Profile...' : 'Save & Proceed to Dashboard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
