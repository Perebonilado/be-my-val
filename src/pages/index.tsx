import { Geist } from "next/font/google";
import { useState, useCallback, useEffect } from "react";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const totalSlides = 2 + SLIDES.reasons.length; // intro + reasons + ask (finale is separate)

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    const maxSlide = SLIDES.reasons.length + 2; // intro(0) + 3 reasons(1,2,3) + ask(4) + finale(5)
    if (currentSlide >= maxSlide) return;

    setIsTransitioning(true);
    setShowContent(false);

    setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
      setShowContent(true);
      setIsTransitioning(false);
    }, 500);
  }, [currentSlide, isTransitioning]);

  const isIntro = currentSlide === 0;
  const isReason = currentSlide >= 1 && currentSlide <= SLIDES.reasons.length;
  const isAsk = currentSlide === SLIDES.reasons.length + 1;
  const isFinale = currentSlide === SLIDES.reasons.length + 2;

  const reasonIndex = currentSlide - 1;

  return (
    <>
      <Head>
        <title>For You</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`${geistSans.className} relative flex min-h-screen select-none items-center justify-center overflow-hidden`}
        style={{ background: isFinale ? "#fff5f7" : "#fffaf9" }}
      >
        {/* Progress dots - show on reason slides and ask */}
        {(isReason || isAsk) && !isFinale && (
          <ProgressDots
            current={currentSlide - 1}
            total={SLIDES.reasons.length + 1}
          />
        )}

        {/* INTRO SLIDE */}
        {isIntro && (
          <div
            className={`flex flex-col items-center px-8 text-center ${showContent ? "animate-fade-in" : "animate-fade-out"}`}
            onClick={goToNext}
            style={{ cursor: "pointer" }}
          >
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
        )}

        {/* REASON SLIDES */}
        {isReason && (
          <div
            className={`flex w-full max-w-lg flex-col items-center px-8 ${showContent ? "animate-fade-in" : "animate-fade-out"}`}
            onClick={goToNext}
            style={{ cursor: "pointer" }}
          >
            <span
              className="animate-slide-up mb-6 text-6xl font-extralight opacity-0"
              style={{ color: "#e8a0bf", animationDelay: "0.1s" }}
            >
              {SLIDES.reasons[reasonIndex].number}
            </span>

            <div
              className="animate-scale-in relative mb-8 aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl opacity-0 shadow-lg"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src={SLIDES.reasons[reasonIndex].photo}
                alt=""
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 px-4 py-3"
                style={{
                  background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
                }}
              >
                <p className="text-sm text-white/90">
                  {SLIDES.reasons[reasonIndex].caption}
                </p>
              </div>
            </div>

            <p
              className="animate-slide-up max-w-sm text-center text-xl font-light leading-relaxed opacity-0"
              style={{ color: "#2d2d2d", animationDelay: "0.6s" }}
            >
              {SLIDES.reasons[reasonIndex].reason}
            </p>

            <p
              className="animate-fade-in mt-8 text-xs tracking-widest uppercase opacity-0"
              style={{ color: "#e8a0bf", animationDelay: "1.2s" }}
            >
              tap to continue
            </p>
          </div>
        )}

        {/* ASK SLIDE */}
        {isAsk && (
          <div
            className={`flex flex-col items-center px-8 text-center ${showContent ? "animate-fade-in" : "animate-fade-out"}`}
          >
            <p
              className="animate-fade-in mb-4 text-lg tracking-wide opacity-0"
              style={{ color: "#e8a0bf", animationDelay: "0.3s" }}
            >
              {SLIDES.ask.title}
            </p>
            <h1
              className="animate-slide-up mb-16 text-4xl font-light leading-tight tracking-tight opacity-0 sm:text-5xl"
              style={{ color: "#2d2d2d", animationDelay: "0.7s" }}
            >
              {SLIDES.ask.question}
            </h1>
            <button
              className="animate-scale-in rounded-full px-12 py-4 text-lg font-medium tracking-wide text-white opacity-0 transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #e8a0bf, #d4526e)",
                animationDelay: "1.2s",
                boxShadow: "0 8px 32px rgba(212, 82, 110, 0.3)",
              }}
              onClick={goToNext}
            >
              Yes!
            </button>
          </div>
        )}

        {/* FINALE SLIDE - Photo Collage */}
        {isFinale && (
          <div
            className={`flex w-full flex-col items-center px-6 py-16 ${showContent ? "animate-fade-in" : ""}`}
          >
            <FloatingHearts />

            <h1
              className="animate-slide-up mb-2 text-3xl font-light tracking-tight opacity-0 sm:text-4xl"
              style={{ color: "#d4526e", animationDelay: "0.3s" }}
            >
              {SLIDES.finale.title}
            </h1>
            <p
              className="animate-fade-in mb-10 text-lg font-light opacity-0"
              style={{ color: "#e8a0bf", animationDelay: "0.6s" }}
            >
              {SLIDES.finale.message}
            </p>

            {/* Photo Collage */}
            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              {SLIDES.reasons.map((reason, i) => (
                <div
                  key={i}
                  className={`animate-scale-in overflow-hidden rounded-2xl opacity-0 shadow-md ${
                    i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                  }`}
                  style={{ animationDelay: `${0.8 + i * 0.2}s` }}
                >
                  <img
                    src={reason.photo}
                    alt=""
                    className="h-full w-full object-cover"
                    style={i === 0 ? { objectPosition: "center 20%" } : undefined}
                  />
                </div>
              ))}
            </div>

            <div
              className="animate-fade-in mt-10 text-center opacity-0"
              style={{ animationDelay: "1.6s" }}
            >
              <p
                className="text-4xl"
                style={{ color: "#d4526e" }}
              >
                &hearts;
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
