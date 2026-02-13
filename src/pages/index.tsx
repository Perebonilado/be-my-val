import { Geist } from "next/font/google";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/*
  ============================================
  CUSTOMIZE YOUR VALENTINE'S EXPERIENCE HERE
  ============================================

  1. Replace the "reason" text with your own reasons
  2. Replace the "photo" paths with your own photos
     - Drop your photos in the public/photos/ folder
     - Name them 1.jpg, 2.jpg, 3.jpg (or change paths below)
  3. Customize the intro, ask, and finale text
*/

const SLIDES = {
  intro: {
    preTitle: "Hey baby girl...",
    title: "I made something for you",
    subtitle: "Tap to start",
  },
  reasons: [
    {
      number: "01",
      reason: "Your presence illumates every room you walk into, Nengi",
      photo: "/photos/1.jpg",
      caption: "My dark skinned queen",
    },
    {
      number: "02",
      reason: "You make even the ordinary days feel magical",
      photo: "/photos/2.jpg",
      caption: "Effortless beauty",
    },
    {
      number: "03",
      reason: "You are my favorite person in the entire world",
      photo: "/photos/3.jpg",
      caption: "My favorite view",
    },
    {
      number: "04",
      reason: "And just like the song says, you are my only girl",
      photo: "/photos/4.jpg",
      caption: "My one and only",
    },
  ],
  ask: {
    title: "So I have a question...",
    question: "Will you be my Valentine?",
  },
  finale: {
    title: "I knew you'd say yes",
    message: "Happy Valentine's Day in advance, my love",
  },
};

// Slide indices: 0 = intro, 1..N = reasons, N+1 = ask, N+2 = finale
const TOTAL = SLIDES.reasons.length + 3;

function FloatingHearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: 16 + Math.random() * 24,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="animate-float-heart absolute bottom-0"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`,
          }}
        >
          &hearts;
        </div>
      ))}
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="fixed top-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-2 rounded-full transition-all duration-500"
          style={{
            width: i === current ? "24px" : "8px",
            backgroundColor: i === current ? "#d4526e" : "#e8a0bf",
            opacity: i <= current ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNoMessage, setShowNoMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transitioning = useRef(false);

  useEffect(() => {
    const audio = new Audio("/music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, []);

  const goToNext = useCallback(() => {
    if (transitioning.current) return;
    if (currentSlide >= TOTAL - 1) return;

    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }

    transitioning.current = true;
    setCurrentSlide((prev) => prev + 1);
    setTimeout(() => { transitioning.current = false; }, 600);
  }, [currentSlide]);

  const askIndex = SLIDES.reasons.length + 1;
  const finaleIndex = SLIDES.reasons.length + 2;
  const isReasonOrAsk = currentSlide >= 1 && currentSlide <= askIndex;

  return (
    <>
      <Head>
        <title>For You</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`${geistSans.className} relative h-screen w-screen select-none overflow-hidden`}
        style={{ background: currentSlide === finaleIndex ? "#fff5f7" : "#fffaf9" }}
      >
        {/* Progress dots */}
        {isReasonOrAsk && (
          <ProgressDots
            current={currentSlide - 1}
            total={SLIDES.reasons.length + 1}
          />
        )}

        {/* === INTRO SLIDE (index 0) === */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out"
          style={{
            opacity: currentSlide === 0 ? 1 : 0,
            pointerEvents: currentSlide === 0 ? "auto" : "none",
          }}
          onClick={currentSlide === 0 ? goToNext : undefined}
        >
          <div className="flex flex-col items-center px-8 text-center">
            <p
              className="animate-fade-in mb-4 text-lg tracking-wide opacity-0"
              style={{ color: "#e8a0bf", animationDelay: "0.2s" }}
            >
              {SLIDES.intro.preTitle}
            </p>
            <h1
              className="animate-fade-in mb-12 text-4xl font-light leading-tight tracking-tight opacity-0 sm:text-5xl"
              style={{ color: "#2d2d2d", animationDelay: "0.6s" }}
            >
              {SLIDES.intro.title}
            </h1>
            <div
              className="animate-fade-in opacity-0"
              style={{ animationDelay: "1.2s" }}
            >
              <div
                className="animate-pulse-slow rounded-full px-8 py-3 text-sm tracking-widest uppercase"
                style={{ color: "#d4526e", border: "1px solid #e8a0bf" }}
              >
                {SLIDES.intro.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* === REASON SLIDES (indices 1..N) - ALL always mounted === */}
        {SLIDES.reasons.map((reason, i) => {
          const slideIndex = i + 1;
          const isActive = currentSlide === slideIndex;
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out"
              style={{
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? "auto" : "none",
              }}
              onClick={isActive ? goToNext : undefined}
            >
              <div className="flex h-screen w-full max-w-lg flex-col items-center justify-center px-8 py-12">
                <span
                  className="mb-3 text-5xl font-extralight"
                  style={{ color: "#e8a0bf" }}
                >
                  {reason.number}
                </span>

                <div
                  className="relative mb-4 w-full max-w-[240px] shrink-0 overflow-hidden rounded-2xl shadow-lg"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={reason.photo}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 px-4 py-3"
                    style={{
                      background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
                    }}
                  >
                    <p className="text-sm text-white/90">
                      {reason.caption}
                    </p>
                  </div>
                </div>

                <p
                  className="max-w-sm text-center text-lg font-light leading-relaxed"
                  style={{ color: "#2d2d2d" }}
                >
                  {reason.reason}
                </p>

                <p
                  className="mt-4 text-xs tracking-widest uppercase"
                  style={{ color: "#e8a0bf" }}
                >
                  tap to continue
                </p>
              </div>
            </div>
          );
        })}

        {/* === ASK SLIDE === */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out"
          style={{
            opacity: currentSlide === askIndex ? 1 : 0,
            pointerEvents: currentSlide === askIndex ? "auto" : "none",
          }}
        >
          <div className="flex flex-col items-center px-8 text-center">
            <p
              className="mb-4 text-lg tracking-wide"
              style={{ color: "#e8a0bf" }}
            >
              {SLIDES.ask.title}
            </p>
            <h1
              className="mb-16 text-4xl font-light leading-tight tracking-tight sm:text-5xl"
              style={{ color: "#2d2d2d" }}
            >
              {SLIDES.ask.question}
            </h1>
            <div className="flex gap-4">
              <button
                className="rounded-full px-12 py-4 text-lg font-medium tracking-wide text-white transition-transform hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #e8a0bf, #d4526e)",
                  boxShadow: "0 8px 32px rgba(212, 82, 110, 0.3)",
                }}
                onClick={goToNext}
              >
                Yes!
              </button>
              <button
                className="rounded-full px-8 py-4 text-lg font-medium tracking-wide transition-transform hover:scale-105 active:scale-95"
                style={{
                  color: "#d4526e",
                  border: "1px solid #e8a0bf",
                }}
                onClick={() => setShowNoMessage(true)}
              >
                No
              </button>
            </div>
            {showNoMessage && (
              <p
                className="animate-fade-in mt-6 text-base font-light"
                style={{ color: "#d4526e" }}
              >
                I'm sorry but the only option is yes 😌
              </p>
            )}
          </div>
        </div>

        {/* === FINALE SLIDE - Photo Collage === */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-y-auto transition-opacity duration-700 ease-in-out"
          style={{
            opacity: currentSlide === finaleIndex ? 1 : 0,
            pointerEvents: currentSlide === finaleIndex ? "auto" : "none",
          }}
        >
          <div className="flex w-full flex-col items-center px-6 py-16">
            {currentSlide === finaleIndex && <FloatingHearts />}

            <h1
              className="mb-2 text-3xl font-light tracking-tight sm:text-4xl"
              style={{ color: "#d4526e" }}
            >
              {SLIDES.finale.title}
            </h1>
            <p
              className="mb-10 text-lg font-light"
              style={{ color: "#e8a0bf" }}
            >
              {SLIDES.finale.message}
            </p>

            {/* Photo Collage */}
            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              {SLIDES.reasons.map((reason, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl shadow-md"
                >
                  <Image
                    src={reason.photo}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 45vw, 200px"
                    className="object-cover"
                    style={{ objectPosition: "center 20%" }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p
                className="text-4xl"
                style={{ color: "#d4526e" }}
              >
                &hearts;
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
