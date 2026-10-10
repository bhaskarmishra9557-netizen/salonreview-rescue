import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  HeartHandshake,
  Mail,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Star,
  WandSparkles,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
}

type ExampleKey = 'negative' | 'neutral' | 'positive';

const examples: Record<
  ExampleKey,
  {
    rating: number;
    customer: string;
    review: string;
    publicReply: string;
    privateFollowup: string;
    ownerAction: string;
  }
> = {
  negative: {
    rating: 2,
    customer: 'Elena R.',
    review:
      'I booked a full balayage and the color came out much warmer than I expected. I was also rushed out when I asked about the result. I left feeling disappointed.',
    publicReply:
      'Hi Elena, thank you for taking the time to share this. We’re sorry your appointment did not leave you feeling confident and cared for. We take both the consultation and the guest experience seriously, and we’d appreciate the opportunity to understand what happened and speak with you directly.',
    privateFollowup:
      'Hi Elena, this is the salon team. I read your review and wanted to reach out personally. I’m sorry the appointment left you disappointed. We’d really value a chance to hear more about your experience and understand where we missed the mark.',
    ownerAction:
      'Review the consultation notes and appointment timeline with the stylist. Identify where expectations and the final result became misaligned.',
  },
  neutral: {
    rating: 3,
    customer: 'David K.',
    review:
      'The haircut itself was great, but my 11:00 appointment started more than 30 minutes late and nobody updated me. I’d appreciate better communication next time.',
    publicReply:
      'Hi David, thank you for the honest feedback. We’re glad you were happy with the haircut, but we’re sorry about the delay and the lack of communication while you were waiting. Your time matters to us, and we’re reviewing how we communicate delays with guests.',
    privateFollowup:
      'Hi David, thank you for flagging the wait and communication issue. We understand how frustrating that can be when you’ve planned your day around an appointment. We’re taking a closer look at our process so we can do better.',
    ownerAction:
      'Set a clear front-desk rule for delayed appointments: communicate early, give a realistic updated time, and document recurring scheduling bottlenecks.',
  },
  positive: {
    rating: 5,
    customer: 'Samantha M.',
    review:
      'Jordan gave me an amazing haircut and showed me exactly how to style my curtain bangs at home. The whole visit felt thoughtful and personal. I’ll definitely be back.',
    publicReply:
      'Thank you, Samantha. We’re so glad you loved your cut and that Jordan could give you a few styling tips to take home. Creating a thoughtful experience from the chair to the mirror is exactly what we aim for. We can’t wait to welcome you back.',
    privateFollowup:
      'Hi Samantha — thank you again for such a lovely review. Jordan and the team were so happy to hear your styling tips were useful. We’re looking forward to seeing you again.',
    ownerAction:
      'Share the feedback with the team and capture the styling preference in the client’s notes for the next visit.',
  },
};

const outputMeta = [
  {
    number: '01',
    title: 'Public reply',
    icon: MessageSquare,
    body:
      'A polished response designed for the review page your next customer will see.',
  },
  {
    number: '02',
    title: 'Private follow-up',
    icon: Mail,
    body:
      'A thoughtful message that moves the conversation into a more personal channel.',
  },
  {
    number: '03',
    title: 'Owner action',
    icon: HeartHandshake,
    body:
      'A practical next step for you or your team — not another generic AI paragraph.',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Set your voice',
    body: 'Add your salon name, location, services and preferred tone once.',
  },
  {
    number: '02',
    title: 'Paste the review',
    body: 'Add the review and its star rating. That’s all the context you need.',
  },
  {
    number: '03',
    title: 'Get three outputs',
    body: 'Receive the public reply, private follow-up and owner action.',
  },
  {
    number: '04',
    title: 'Copy and move on',
    body: 'Respond, save the history and get back to your day.',
  },
];

const safetyPoints = [
  'No invented promises, refunds or compensation.',
  'No defensive language or counter-accusations.',
  'No made-up facts that were not present in the review.',
  'Sensitive complaints can be flagged for human review.',
];

const plans = [
  {
    name: 'Starter',
    eyebrow: 'For trying the workflow',
    price: '$0',
    suffix: '/ month',
    description:
      'A simple starting point for independent salon owners who want a faster review routine.',
    items: [
      '10 review generations',
      'Public reply',
      'Private follow-up',
      'Owner action',
      'Review history',
    ],
    dark: false,
    button: 'Start free',
  },
  {
    name: 'Pro',
    eyebrow: 'For active salons',
    price: '$9',
    suffix: '/ month',
    description:
      'Unlimited review assistance for owners who want reputation management built into the weekly workflow.',
    items: [
      'Unlimited review generations',
      'All three outputs',
      'Custom salon tone',
      'Adjustable reply length',
      'Full review history',
    ],
    dark: true,
    button: 'Try Pro',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenAuth,
}) => {
  const [selectedExample, setSelectedExample] =
    useState<ExampleKey>('negative');
  const [copied, setCopied] = useState<string | null>(null);

  const example = examples[selectedExample];

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);

      window.setTimeout(() => {
        setCopied(null);
      }, 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#171613]">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden border-b border-[#D9D1C6]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#DCE5DC] opacity-60 blur-3xl" />
          <div className="absolute -bottom-20 -left-24 h-80 w-80 rounded-full bg-[#ebe2d7] opacity-80 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between border-b border-[#D9D1C6] py-5">
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171613] text-sm font-semibold text-[#F4EFE6] transition-transform group-hover:scale-105">
                S
              </span>

              <span className="font-display text-xl tracking-[-0.02em]">
                SalonReview Rescue
              </span>
            </button>

            <div className="hidden items-center gap-8 text-sm text-[#6F6A62] md:flex">
              <a
                href="#why"
                className="transition-colors hover:text-[#171613]"
              >
                Why it matters
              </a>
              <a
                href="#demo"
                className="transition-colors hover:text-[#171613]"
              >
                See it in action
              </a>
              <a
                href="#pricing"
                className="transition-colors hover:text-[#171613]"
              >
                Pricing
              </a>
              <button
                onClick={() => onOpenAuth('signin')}
                className="font-medium text-[#171613] transition-opacity hover:opacity-60"
              >
                Sign in
              </button>
            </div>
          </div>

          <div className="grid items-center gap-14 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20 lg:py-28">
            <div className="max-w-3xl">
              <div className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3F5A4A] sm:text-[11px]">
                <span>Reputation management for independent salons</span>
                <span className="h-px w-9 bg-[#3F5A4A]" />
              </div>

              <h1 className="font-display text-[3.45rem] leading-[0.94] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[7rem]">
                Every review
                <br />
                deserves a
                <br />
                <span className="text-[#3F5A4A]">better response.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-[#625c55] sm:text-lg">
                Turn customer feedback into a polished public reply, a
                thoughtful private follow-up, and a clear next step for your
                team — in seconds.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onGetStarted}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#171613] px-7 py-4 text-sm font-semibold text-[#F4EFE6] transition-all hover:-translate-y-0.5 hover:bg-[#3F5A4A]"
                >
                  Try it free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-full border border-[#C9C0B5] px-7 py-4 text-sm font-medium text-[#171613] transition-colors hover:bg-[#FCFAF6]"
                >
                  See how it works
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#6F6A62]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3F5A4A]" />
                  10 reviews free every month
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3F5A4A]" />
                  No credit card required
                </span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] border border-[#DDD5CB]" />

              <div className="relative overflow-hidden rounded-[1.7rem] border border-[#D8D0C6] bg-[#FCFAF6] shadow-[0_30px_90px_rgba(32,29,25,0.11)]">
                <div className="flex items-center justify-between border-b border-[#E1DAD1] px-5 py-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B837A]">
                      Live example
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      A 2-star color review
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= 2
                            ? 'fill-[#3F5A4A] text-[#3F5A4A]'
                            : 'text-[#D5CEC5]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-7 p-6 sm:p-7">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#8B837A]">
                      Customer says
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#47423D]">
                      “The color came out much warmer than I expected. I left
                      feeling disappointed.”
                    </p>
                  </div>

                  <div className="h-px bg-[#E5DED6]" />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3F5A4A]">
                        <Sparkles className="h-3.5 w-3.5" />
                        SalonReview Rescue
                      </div>

                      <span className="text-[10px] text-[#8B837A]">
                        3 outputs
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-[#EFEAE2] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7B746C]">
                          Public reply
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#47423D]">
                          Thank you for sharing your experience. We’re sorry
                          your appointment did not leave you feeling confident
                          and cared for...
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#E7EEE8] p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#3F5A4A]">
                          Private follow-up
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#47423D]">
                          We’d really value a chance to hear more about your
                          experience and understand where we missed the mark.
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#171613] p-4 text-[#F4EFE6]">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#B8C8BB]">
                          Owner action
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#E4DED6]">
                          Review consultation notes and appointment timing with
                          the stylist.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#D9D1C6] py-6 text-xs text-[#6F6A62] sm:flex-row sm:items-center sm:justify-between">
            <span>Built for the ten minutes between appointments.</span>
            <span className="font-medium text-[#3F5A4A]">
              One review → three useful actions.
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────── WHY ───────────────── */}
      <section
        id="why"
        className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="grid gap-16 lg:grid-cols-[0.76fr_1.24fr]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3F5A4A]">
              Why it matters
            </div>

            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              A bad review is public.
              <br />
              Your response should be{' '}
              <span className="italic text-[#3F5A4A]">thoughtful.</span>
            </h2>
          </div>

          <div className="grid gap-12 sm:grid-cols-3">
            {[
              {
                number: '01',
                title: 'The delay',
                body:
                  'You know you need to respond, but the day gets busy and the review sits there longer than it should.',
              },
              {
                number: '02',
                title: 'The wording',
                body:
                  'You want to sound human, accountable and professional — not defensive or like a copy-paste bot.',
              },
              {
                number: '03',
                title: 'The aftermath',
                body:
                  'A review can point to a real operational issue. Your team needs to know what to do next.',
              },
            ].map((item) => (
              <div key={item.number} className="border-t border-[#D9D1C6] pt-5">
                <div className="text-xs font-semibold text-[#3F5A4A]">
                  {item.number}
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#6F6A62]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── THREE OUTPUTS ───────────────── */}
      <section className="border-y border-[#D9D1C6] bg-[#FCFAF6]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3F5A4A]">
              The core experience
            </div>

            <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              One review.
              <br />
              Three useful outcomes.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#6F6A62]">
              Not another generic AI paragraph. A complete response workflow
              built around what actually happens after a customer speaks up.
            </p>
          </div>

          <div className="mt-16 divide-y divide-[#E2DBD2] border-y border-[#E2DBD2]">
            {outputMeta.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="grid gap-5 py-9 sm:grid-cols-[80px_240px_1fr] sm:items-center"
                >
                  <div className="text-xs font-semibold tracking-[0.12em] text-[#3F5A4A]">
                    {item.number}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7EEE8] text-[#3F5A4A]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-[#6F6A62]">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── DEMO ───────────────── */}
      <section
        id="demo"
        className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28"
      >
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3F5A4A]">
              See it in action
            </div>

            <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              From messy feedback
              <br />
              to a clear next move.
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ['negative', '2-star review'],
                ['neutral', '3-star review'],
                ['positive', '5-star review'],
              ] as [ExampleKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedExample(key)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedExample === key
                    ? 'bg-[#3F5A4A] text-white'
                    : 'border border-[#D5CEC4] text-[#6F6A62] hover:border-[#AFA69B] hover:text-[#171613]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.8rem] border border-[#D7D0C6] bg-[#FCFAF6] shadow-[0_24px_80px_rgba(24,20,17,0.08)]">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
            <div className="border-b border-[#DED7CE] p-7 lg:border-b-0 lg:border-r lg:p-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B837A]">
                  Customer review
                </span>

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= example.rating
                          ? 'fill-[#3F5A4A] text-[#3F5A4A]'
                          : 'text-[#D6CEC5]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <div className="text-sm font-semibold">
                  {example.customer}
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4C4742]">
                  “{example.review}”
                </p>
              </div>

              <div className="mt-10 border-t border-[#E4DDD5] pt-6">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3F5A4A]">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Rescue in seconds
                </div>

                <button
                  onClick={onGetStarted}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#171613] px-5 py-3.5 text-sm font-semibold text-[#F4EFE6] transition-all hover:bg-[#3F5A4A]"
                >
                  Handle a review for your salon
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-7 lg:p-8">
              <OutputCard
                title="Public reply"
                icon={<MessageSquare className="h-4 w-4" />}
                text={example.publicReply}
                copied={copied === 'public'}
                onCopy={() =>
                  handleCopy(example.publicReply, 'public')
                }
              />

              <OutputCard
                title="Private follow-up"
                icon={<Mail className="h-4 w-4" />}
                text={example.privateFollowup}
                copied={copied === 'private'}
                onCopy={() =>
                  handleCopy(example.privateFollowup, 'private')
                }
              />

              <OutputCard
                title="Owner action"
                icon={<HeartHandshake className="h-4 w-4" />}
                text={example.ownerAction}
                copied={copied === 'action'}
                dark
                onCopy={() =>
                  handleCopy(example.ownerAction, 'action')
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── WORKFLOW ───────────────── */}
      <section
        id="how-it-works"
        className="border-y border-[#27251F] bg-[#171613] text-[#F4EFE6]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#B8C8BB]">
              How it works
            </div>

            <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Built for the ten minutes
              <br />
              between appointments.
            </h2>
          </div>

          <div className="mt-16 grid gap-9 md:grid-cols-4">
            {workflow.map((item) => (
              <div
                key={item.number}
                className="border-t border-white/15 pt-5"
              >
                <div className="text-xs font-semibold tracking-[0.12em] text-[#B8C8BB]">
                  {item.number}
                </div>

                <h3 className="mt-5 text-base font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#AAA39A]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── SAFETY ───────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#3F5A4A]">
              <ShieldAlert className="h-4 w-4" />
              Built with restraint
            </div>

            <h2 className="mt-5 max-w-lg font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              AI that knows
              <br />
              when to <span className="italic text-[#3F5A4A]">step back.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#6F6A62]">
              The goal is not to automate every sensitive conversation. The
              goal is to help you respond quickly while keeping important
              judgment with the owner or team.
            </p>
          </div>

          <div className="divide-y divide-[#E1DAD2] border-y border-[#E1DAD2]">
            {safetyPoints.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 py-6 text-sm text-[#4D4842]"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3F5A4A]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── PRICING ───────────────── */}
      <section
        id="pricing"
        className="border-y border-[#D9D1C6] bg-[#FCFAF6]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3F5A4A]">
              Pricing
            </div>

            <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Start free.
              <br />
              Keep your reputation moving.
            </h2>

            <p className="mt-5 text-sm leading-6 text-[#6F6A62]">
              No sales call. No complicated setup. Just a better workflow for
              the reviews that matter.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={
                  plan.dark
                    ? 'relative overflow-hidden rounded-[1.5rem] bg-[#171613] p-8 text-[#F4EFE6] shadow-[0_25px_80px_rgba(23,22,19,0.14)]'
                    : 'rounded-[1.5rem] border border-[#D8D0C6] bg-[#F4EFE6] p-8'
                }
              >
                {plan.dark && (
                  <div className="absolute right-7 top-7 rounded-full bg-[#3F5A4A] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                    Pro
                  </div>
                )}

                <div
                  className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    plan.dark ? 'text-[#B8C8BB]' : 'text-[#77716A]'
                  }`}
                >
                  {plan.eyebrow}
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <span className="font-display text-5xl tracking-[-0.04em]">
                    {plan.price}
                  </span>

                  <span
                    className={`pb-2 text-sm ${
                      plan.dark ? 'text-[#AAA39A]' : 'text-[#6F6A62]'
                    }`}
                  >
                    {plan.suffix}
                  </span>
                </div>

                <p
                  className={`mt-4 max-w-sm text-sm leading-6 ${
                    plan.dark ? 'text-[#AAA39A]' : 'text-[#6F6A62]'
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-7 space-y-3">
                  {plan.items.map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2.5 text-sm ${
                        plan.dark ? 'text-[#E4DED6]' : 'text-[#403B36]'
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 ${
                          plan.dark ? 'text-[#B8C8BB]' : 'text-[#3F5A4A]'
                        }`}
                      />
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={onGetStarted}
                  className={
                    plan.dark
                      ? 'mt-9 w-full rounded-full bg-[#F4EFE6] px-5 py-3.5 text-sm font-semibold text-[#171613] transition-colors hover:bg-white'
                      : 'mt-9 w-full rounded-full bg-[#171613] px-5 py-3.5 text-sm font-semibold text-[#F4EFE6] transition-colors hover:bg-[#3F5A4A]'
                  }
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── FINAL CTA ───────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:px-8 lg:py-32">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3F5A4A]">
          One last thing
        </div>

        <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
          Your next review is already coming.
          <br />
          <span className="italic text-[#3F5A4A]">Be ready for it.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#6F6A62] sm:text-base">
          Turn a difficult customer moment into a calm response, a better
          follow-up and a clear next step.
        </p>

        <button
          onClick={onGetStarted}
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#171613] px-7 py-4 text-sm font-semibold text-[#F4EFE6] transition-all hover:-translate-y-0.5 hover:bg-[#3F5A4A]"
        >
          Try SalonReview Rescue free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}
      <footer className="border-t border-[#D9D1C6] bg-[#EEE8DF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-xs text-[#6F6A62] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-2">
            <span className="font-display text-base text-[#171613]">
              SalonReview Rescue
            </span>
            <span>· Reputation workflow for independent salons</span>
          </div>

          <div className="flex items-center gap-5">
            <span>Simple. Private. Practical.</span>

            <button
              onClick={() => onOpenAuth('signin')}
              className="font-medium text-[#171613] hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface OutputCardProps {
  title: string;
  icon: React.ReactNode;
  text: string;
  copied: boolean;
  onCopy: () => void;
  dark?: boolean;
}

const OutputCard: React.FC<OutputCardProps> = ({
  title,
  icon,
  text,
  copied,
  onCopy,
  dark = false,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        dark
          ? 'border-[#27251F] bg-[#171613] text-[#F4EFE6]'
          : 'border-[#DDD6CD] bg-[#F5F1EA]'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] ${
            dark ? 'text-[#B8C8BB]' : 'text-[#3F5A4A]'
          }`}
        >
          {icon}
          {title}
        </div>

        <button
          onClick={onCopy}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-colors ${
            dark
              ? 'border-white/15 text-[#E4DED6] hover:bg-white/5'
              : 'border-[#D2CAC0] text-[#514B45] hover:bg-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      <p
        className={`mt-4 text-sm leading-6 ${
          dark ? 'text-[#DED8D0]' : 'text-[#4C4742]'
        }`}
      >
        {text}
      </p>
    </div>
  );
};
