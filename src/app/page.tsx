"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

import { VideoRecorder } from "./components/video-recorder";

type CandidateProfile = {
  phone: string;
  role: string;
  experience: "none" | "0-1" | "1-3" | "3+" | "";
  availability: {
    weekdays: boolean;
    weekends: boolean;
    nights: boolean;
  };
  startDate: string;
  shortTermOnly: boolean;
};

type StepProps = {
  data: CandidateProfile;
  update: (changes: Partial<CandidateProfile>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<CandidateProfile>({
    phone: "",
    role: "",
    experience: "",
    availability: {
      weekdays: true,
      weekends: false,
      nights: false,
    },
    startDate: "",
    shortTermOnly: false,
  });

  const steps = useMemo(
    () => [
      (props: StepProps) => (
        <WelcomeStep {...props} />
      ),
      (props: StepProps) => (
        <PhoneStep {...props} />
      ),
      (props: StepProps) => (
        <ProfileStep {...props} />
      ),
      (props: StepProps) => (
        <VideoPrepStep {...props} />
      ),
      (props: StepProps) => (
        <RecordingStep {...props} />
      ),
    ],
    []
  );

  const StepComponent = steps[currentStep];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const updateProfile = (changes: Partial<CandidateProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <header className="space-y-4 text-slate-600">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide">
            <span>ReelWork MVP</span>
            <span>
              Step {currentStep + 1} / {steps.length}
            </span>
          </div>
          <div className="h-1 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <main className="rounded-3xl bg-white p-6 shadow-lg shadow-slate-200">
          <StepComponent
            data={profile}
            update={updateProfile}
            onNext={handleNext}
            onBack={handleBack}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </main>
      </div>
    </div>
  );
}

function WelcomeStep({ onNext }: StepProps) {
  return (
    <div className="flex h-full flex-col items-center justify-between gap-10 text-center">
      <div className="flex flex-col items-center gap-4 pt-6">
        <LogoMark />
        <div>
          <p className="text-sm uppercase tracking-[0.4rem] text-sky-400">
            ReelWork
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Reel people. Reel fast. Reel work.
          </h1>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-500">
        Welcome to your hospitality hiring home. Create a short video profile,
        share your availability, and match with venues that vibe with your
        energy.
      </p>

      <button
        onClick={onNext}
        className="mt-auto w-full rounded-full bg-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
      >
        Get Started
      </button>
    </div>
  );
}

function PhoneStep({
  data,
  update,
  onNext,
  onBack,
  isFirst,
}: StepProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-slate-700"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <LogoMark size="sm" />
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">ReelWork</h2>
          <p className="text-sm text-slate-500">
            Reel people. Reel fast. Reel work.
          </p>
        </div>
      </div>

      <div className="space-y-2 text-left">
        <label className="text-sm font-medium text-slate-700">
          Phone number
        </label>
        <input
          type="tel"
          inputMode="tel"
          required
          placeholder="Enter your phone number"
          value={data.phone}
          onChange={(event) =>
            update({
              phone: event.target.value,
            })
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
        />
        <p className="text-xs text-slate-500">
          We use this to send you secure login codes. Your phone number stays
          private.
        </p>
      </div>

      <div className="mt-2 flex gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

function ProfileStep({ data, update, onNext, onBack }: StepProps) {
  const handleAvailabilityChange = (key: keyof CandidateProfile["availability"]) => {
    update({
      availability: {
        ...data.availability,
        [key]: !data.availability[key],
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 text-slate-700">
      <header className="text-center">
        <LogoMark size="sm" />
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Profile Details
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Tell us what you&apos;re looking for so we can surface the right gigs.
        </p>
      </header>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            What kind of work are you looking for?
          </label>
          <select
            value={data.role}
            onChange={(event) =>
              update({
                role: event.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
          >
            <option value="">Choose job title</option>
            <option value="bartender">Bartender</option>
            <option value="barista">Barista</option>
            <option value="server">Front of House</option>
            <option value="host">Host</option>
            <option value="kitchen">Kitchen Hand</option>
          </select>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            How much experience do you have?
          </legend>

          <div className="flex flex-col gap-3">
            {[
              { label: "None", value: "none" },
              { label: "0–1 years", value: "0-1" },
              { label: "1–3 years", value: "1-3" },
              { label: "3+ years", value: "3+" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm transition hover:border-slate-300"
              >
                <span>{option.label}</span>
                <span
                  className={`h-5 w-5 rounded-full border ${
                    data.experience === option.value
                      ? "border-sky-500 bg-sky-500"
                      : "border-slate-300"
                  }`}
                />
                <input
                  type="radio"
                  name="experience"
                  className="sr-only"
                  checked={data.experience === option.value}
                  onChange={() =>
                    update({
                      experience: option.value as CandidateProfile["experience"],
                    })
                  }
                />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">
            Availability
          </legend>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "weekdays", label: "Weekdays" },
              { key: "weekends", label: "Weekends" },
              { key: "nights", label: "Nights" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() =>
                  handleAvailabilityChange(
                    option.key as keyof CandidateProfile["availability"]
                  )
                }
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  data.availability[option.key as keyof CandidateProfile["availability"]]
                    ? "border-sky-500 bg-sky-50 text-sky-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            When can you start?
          </label>
          <input
            type="date"
            value={data.startDate}
            onChange={(event) =>
              update({
                startDate: event.target.value,
              })
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm transition hover:border-slate-300">
          <input
            type="checkbox"
            checked={data.shortTermOnly}
            onChange={(event) =>
              update({
                shortTermOnly: event.target.checked,
              })
            }
            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
          />
          <span>I&apos;m open to short-term only</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function VideoPrepStep({ onNext, onBack }: StepProps) {
  return (
    <div className="flex flex-col gap-6 text-slate-700">
      <header className="text-center">
        <LogoMark size="sm" />
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Now, let&apos;s make your video!
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Keep it natural and upbeat. Introduce yourself and share the kind of
          work you love.
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl border border-slate-200">
        <Image
          src="/reelwork.png"
          alt="Candidate video example"
          width={400}
          height={520}
          className="h-72 w-full object-cover"
          priority
        />
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 text-sm">
        <p className="font-medium text-slate-800">
          Pro tips before you hit record:
        </p>
        <ul className="mt-3 space-y-2 text-slate-600">
          <li>• Portrait mode is best. Aim for 30–45 seconds.</li>
          <li>• Good light and a steady hand go a long way.</li>
          <li>• Smile, be yourself, and talk like you would with a guest.</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-full bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Record
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-full border border-sky-500 bg-white py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

function RecordingStep({ onBack, onNext, isLast }: StepProps) {
  const [hasUploaded, setHasUploaded] = useState(false);

  return (
    <div className="flex flex-col gap-6 text-slate-700">
      <header className="space-y-2 text-center">
        <LogoMark size="sm" />
        <p className="text-xs font-semibold uppercase tracking-[0.3rem] text-sky-400">
          Recording
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Tell us your story
        </h2>
        <p className="text-sm text-slate-500">
          “Tell us your name and what kind of work you&apos;re after.”
        </p>
      </header>

      <VideoRecorder
        onUploaded={() => {
          setHasUploaded(true);
        }}
        onReset={() => {
          setHasUploaded(false);
        }}
      />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (hasUploaded) {
              onNext();
            }
          }}
          disabled={!hasUploaded}
          className="flex-1 rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {hasUploaded ? (isLast ? "Save & Continue" : "Next") : "Upload video to continue"}
        </button>
      </div>
    </div>
  );
}

function LogoMark({ size = "lg" }: { size?: "lg" | "sm" }) {
  const className =
    size === "lg"
      ? "h-16 w-16 text-2xl"
      : "h-12 w-12 text-lg";

  return (
    <div
      className={`${className} flex items-center justify-center rounded-3xl bg-sky-400 font-semibold text-white`}
    >
      R
    </div>
  );
}
