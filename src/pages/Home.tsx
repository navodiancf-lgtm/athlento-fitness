import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Flame,
  Gauge,
  Grid3X3,
  Menu,
  Move3d,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  TimerReset,
  Trophy,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
function Button({ className = "", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

function Badge({ className = "", children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={className} {...props} />;
}
import { Link } from "react-router-dom";
import { exerciseLibrary as exercises, heroCategories, workoutFilters as filters, workouts as circuits, exerciseVideoMap } from "@/lib/fitnessData";

const heroImage = "/images/hero-workout.jpg";
const heroVideoUrl = "/videos/EX-001_Bodyweight_Squat.mp4";

const muscles = ["FULL BODY", "UPPER PUSH", "UPPER PULL", "LOWER POWER", "CORE MATRIX"];

const muscleImageMap: Record<string, string> = {
  "FULL BODY": "/images/focus/full-body.png",
  "UPPER PUSH": "/images/focus/upper-push.png",
  "UPPER PULL": "/images/focus/upper-pull.png",
  "LOWER POWER": "/images/focus/lower-power.png",
  "CORE MATRIX": "/images/focus/core-matrix.png",
};

const videoStats = {
  attached: exercises.filter((exercise) => Boolean(exercise.videoUrl)).length,
  alternates: exercises.reduce((total, exercise) => total + (exercise.alternateVideoUrls?.length ?? 0), 0),
  pending: exercises.filter((exercise) => !exercise.videoUrl).length,
};

function SectionEyebrow({ children, testId }: { children: string; testId: string }) {
  return <p className="section-eyebrow" data-testid={testId}><span />{children}</p>;
}

function WorkoutPoster({ circuit, testId }: { circuit: (typeof circuits)[number]; testId: string }) {
  return (
    <div className="print-poster" data-testid={testId}>
      {circuit.posterUrl ? <img src={circuit.posterUrl} alt={`${circuit.name} workout poster`} data-testid={`${testId}-image`} className="w-full h-full object-cover" /> : <>
        <div className="poster-topline"><span>NX / {circuit.id}</span><b>NO EQUIPMENT</b></div>
        <div className="poster-mark" aria-hidden="true"><span>{circuit.id}</span><i /><i /><i /></div>
        <div className="poster-copy"><strong>{circuit.name}</strong><span>{circuit.target} / {circuit.time}</span></div>
        <div className="poster-footer"><span>LEVEL {circuit.level}</span><span>{circuit.moves}</span></div>
      </>}
    </div>
  );
}

function VideoThumbnail({ name, url, testId }: { name: string; url: string; testId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    if (!videoRef.current) return;
    setIsPlaying(true);
    videoRef.current.muted = true;
    void videoRef.current.play().catch(() => undefined);
  };

  const pause = () => {
    videoRef.current?.pause();
    setIsPlaying(false);
  };

  const toggle = () => isPlaying ? pause() : play();

  return (
    <div className={`exercise-card-video-wrap ${isPlaying ? "playing" : ""}`} role="button" tabIndex={0} onClick={toggle} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } }} aria-label={`${isPlaying ? "Pause" : "Play"} ${name} inline preview`} data-testid={`${testId}-inline-toggle`}>
      <video ref={videoRef} className="exercise-card-video" muted loop playsInline preload="metadata" src={`${url}#t=0.1`} aria-label={`${name} video thumbnail`} data-testid={testId} />
      <span className="inline-preview-state" data-testid={`${testId}-state`}>{isPlaying ? "TAP TO PAUSE" : "TAP TO PREVIEW"}</span>
    </div>
  );
}


function playCountdownTone(freq = 800, duration = 0.12) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // audio context blocked or muted
  }
}

export default function Home() {
  const [activeMuscle, setActiveMuscle] = useState("FULL BODY");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(40);
  const [timerPhase, setTimerPhase] = useState<"work" | "rest">("work");
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSet, setActiveSet] = useState(0);
  const [selectedCircuit, setSelectedCircuit] = useState(circuits[0]);
  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedVideo, setSelectedVideo] = useState<{ name: string; urls: string[]; index: number } | null>(null);
  const [completedDays, setCompletedDays] = useState<number[]>(Array.of(1, 2, 3));
  const [userStreak, setUserStreak] = useState(1);

  // Load streak from localStorage
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("athlento-daily-streak");
      if (saved) {
        setUserStreak(parseInt(saved, 10) || 1);
      }
    } catch {
      // ignore
    }
  }, []);

  // Automated workout timer interval with audio cues
  useEffect(() => {
    if (!sessionOpen || !sessionStarted || sessionCompleted || isTimerPaused) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerPhase === "work") {
            // Work interval finished -> go to Rest (20s) or Finish if last exercise
            if (!isMuted) playCountdownTone(1050, 0.25);
            const totalSteps = selectedCircuit.steps?.length || 1;
            if (activeStep >= totalSteps - 1) {
              setSessionCompleted(true);
              const nextStreak = userStreak + 1;
              setUserStreak(nextStreak);
              try {
                window.localStorage.setItem("athlento-daily-streak", String(nextStreak));
              } catch {}
              return 0;
            } else {
              setTimerPhase("rest");
              return 20; // 20s rest interval
            }
          } else {
            // Rest interval finished -> go to Next Work step (40s)
            if (!isMuted) playCountdownTone(1200, 0.25);
            setActiveStep((s) => s + 1);
            setActiveSet((st) => (st + 1) % 3);
            setTimerPhase("work");
            return 40; // 40s work interval
          }
        }

        // 3-2-1 Audio beeps during last 3 seconds
        if (prev <= 4 && prev > 1 && !isMuted) {
          playCountdownTone(750, 0.08);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionOpen, sessionStarted, sessionCompleted, isTimerPaused, timerPhase, activeStep, selectedCircuit, isMuted, userStreak]);

  // Deterministic daily workout based on day of the week
  const getTodaysCircuit = () => {
    const day = new Date().getDay();
    const schedule = [
      "foundation",       // Sun
      "cyber-ignition",   // Mon
      "titan-core-300",   // Tue
      "metabolic-reaper", // Wed
      "slowburn",         // Thu
      "blacksmith",       // Fri
      "inferno-hiit",     // Sat
    ];
    const targetSlug = schedule[day] || "cyber-ignition";
    return circuits.find((c) => c.slug === targetSlug) || circuits[0];
  };

  const openSession = (circuit = getTodaysCircuit()) => {
    const chosen = circuit || getTodaysCircuit();
    setSelectedCircuit(chosen);
    setActiveStep(0);
    setActiveSet(0);
    setTimerSeconds(40);
    setTimerPhase("work");
    setIsTimerPaused(false);
    setSessionStarted(false);
    setSessionCompleted(false);
    setSessionOpen(true);
  };


  const toggleDay = (day: number) => {
    setCompletedDays((days: number[] = Array.of(1, 2, 3)) => {
      const list = days || Array.of(1, 2, 3);
      if (list.includes(day)) {
        return list.filter((item) => item !== day);
      } else {
        return list.concat(day).sort((a, b) => a - b);
      }
    });
  };

  const openVideo = (name: string, url: string, alternates: string[] = []) => setSelectedVideo({ name, urls: [url, ...alternates], index: 0 });

  return (
    <main className="min-h-svh overflow-x-hidden bg-background text-foreground" data-testid="athlento-fitness-page">
      <header className="site-header" data-testid="site-header">
        <button className="brand-lockup flex items-center" onClick={() => scrollTo("top")} data-testid="brand-home-button" aria-label="ATHLENTO">
          <img src="/logo.png" alt="ATHLENTO" className="h-10 w-auto object-contain" />
        </button>
        <nav className="desktop-nav" data-testid="desktop-navigation" aria-label="Main navigation">
          <button onClick={() => scrollTo("circuits")} data-testid="nav-studio-button">WORKOUTS</button>
          <button onClick={() => scrollTo("quest")} data-testid="nav-circuits-button">PROGRAMS</button>
          <button onClick={() => scrollTo("quest")} data-testid="nav-quest-button">CHALLENGES</button>
          <button onClick={() => scrollTo("library")} data-testid="nav-library-button">EXERCISES</button>
        </nav>
        <div className="header-actions">
          <Button className="header-cta inline-flex items-center justify-center gap-2 whitespace-nowrap" onClick={() => openSession()} data-testid="header-start-workout-button"><span>DAILY WORKOUT</span><ArrowRight size={15} className="shrink-0" /></Button>
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((value) => !value)} data-testid="mobile-menu-toggle-button" aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu" data-testid="mobile-navigation-menu">
            <button onClick={() => scrollTo("circuits")} data-testid="mobile-nav-studio-button">01 / WORKOUTS <ChevronRight size={15} /></button>
            <button onClick={() => scrollTo("quest")} data-testid="mobile-nav-circuits-button">02 / PROGRAMS <ChevronRight size={15} /></button>
            <button onClick={() => scrollTo("quest")} data-testid="mobile-nav-quest-button">03 / CHALLENGES <ChevronRight size={15} /></button>
            <button onClick={() => scrollTo("library")} data-testid="mobile-nav-library-button">04 / EXERCISES <ChevronRight size={15} /></button>
          </div>
        )}
      </header>

      <section id="top" className="hero-section page-section" data-testid="hero-section">
        <nav className="hero-category-nav" data-testid="hero-category-navigation" aria-label="Fitness categories">
          {heroCategories.map((category, index) => <Link className="hero-category-link" key={category.label} to={category.path} data-testid={`hero-category-${index + 1}-link`}>{category.label}<ChevronRight size={13} /></Link>)}
        </nav>
        <div className="hero-copy">
          <SectionEyebrow testId="hero-eyebrow">FREE WORKOUTS / FOR EVERY BODY</SectionEyebrow>
          <h1 data-testid="hero-heading">GET FIT.<br /><span>FEEL GREAT.</span></h1>
          <p className="hero-description" data-testid="hero-description">Simple, effective workouts, programs and challenges you can do anywhere. No gym required. No subscription required.</p>
          <div className="hero-actions">
            <Button className="primary-cta inline-flex items-center justify-center gap-2 whitespace-nowrap" onClick={() => openSession()} data-testid="hero-launch-workout-button"><CirclePlay size={17} className="shrink-0" fill="currentColor" /><span>WORKOUT OF THE DAY</span></Button>
            <button className="text-cta" onClick={() => scrollTo("circuits")} data-testid="hero-explore-circuits-button">BROWSE WORKOUTS <ArrowRight size={16} /></button>
          </div>
          <div className="hero-proof" data-testid="hero-proof-stats">
            <div><strong data-testid="hero-stat-exercises">50<span>+</span></strong><small data-testid="hero-stat-exercises-label">FREE WORKOUTS</small></div>
            <div><strong data-testid="hero-stat-circuits">05</strong><small data-testid="hero-stat-circuits-label">PROGRAMS</small></div>
            <div><strong data-testid="hero-stat-days">30</strong><small data-testid="hero-stat-days-label">DAY CHALLENGE</small></div>
          </div>
        </div>

        <div className="hero-stage-wrap" data-testid="hero-stage-wrap">
          <div className="hero-stage-label label-top" data-testid="hero-stage-mode-label"><Move3d size={14} /> WORKOUT OF THE DAY</div>
          <div className="hero-stage" data-testid="hero-stage">
            <video
              className="hero-stage-video w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              src={heroVideoUrl}
              poster={heroImage}
              data-testid="hero-stage-video"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
              }}
            />
            <img src={heroImage} alt="Workout of the day" className="hero-stage-fallback w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <div className="stage-vignette" />
            <div className="stage-data stage-data-top" data-testid="stage-fps-data"><span>FPS</span><b>60</b></div>
            <div className="stage-data stage-data-mid" data-testid="stage-angle-data"><span>ANGLE</span><b>93.4°</b></div>
            <div className="stage-data stage-data-bottom" data-testid="stage-calorie-data"><span>CAL / MIN</span><b>08.6</b></div>
            <div className="stage-corner stage-corner-one" /><div className="stage-corner stage-corner-two" />
            <div className="stage-crosshair" />
          </div>
          <div className="hero-stage-label label-bottom" data-testid="hero-stage-asset-label"><span className="live-dot" /> FULL BODY / 20 MIN / BEGINNER</div>
        </div>
      </section>

      <section className="ticker" data-testid="ticker-strip">
        <div><Activity size={16} /> <span data-testid="ticker-one">MOTION IS MEDICINE</span></div>
        <div><Sparkles size={16} /> <span data-testid="ticker-two">ZERO EQUIPMENT / MAXIMUM OUTPUT</span></div>
        <div><Gauge size={16} /> <span data-testid="ticker-three">PRECISION OVER EGO</span></div>
        <div><Flame size={16} /> <span data-testid="ticker-four">BUILD YOUR SIGNAL</span></div>
      </section>

      <section id="studio" className="page-section studio-section" data-testid="studio-section">
        <div className="section-heading-row">
          <div><SectionEyebrow testId="studio-eyebrow">01 / FIND YOUR FOCUS</SectionEyebrow><h2 data-testid="studio-heading">WORKOUTS<br /><span>FOR YOU.</span></h2></div>
          <p className="section-side-copy" data-testid="studio-description">Choose a body focus, pick a workout and start moving. Every routine is clear, printable and easy to follow.</p>
        </div>
        <div className="studio-layout">
          <div className="anatomy-panel panel-surface relative overflow-hidden flex flex-col justify-between" data-testid="anatomy-panel">
            <div className="panel-topline"><span data-testid="anatomy-panel-title">CHOOSE YOUR FOCUS</span><span data-testid="anatomy-panel-status">5 AREAS</span></div>
            <img src={muscleImageMap[activeMuscle] || "/images/anatomy-focus.png"} alt={activeMuscle} className="w-full h-[370px] object-contain my-auto py-2 transition-all duration-300" onError={(e) => { e.currentTarget.src = "/images/anatomy-focus.png"; }} />
          </div>
          <div className="target-panel" data-testid="target-panel">
            <div className="target-panel-copy"><span className="target-index" data-testid="target-index">FOCUS / 0{muscles.indexOf(activeMuscle) + 1}</span><h3 data-testid="active-target-heading">{activeMuscle}</h3><p data-testid="active-target-description">Find a routine for this focus and make it part of your everyday movement.</p></div>
            <div className="muscle-list" data-testid="muscle-selector">
              {muscles.map((muscle, index) => (
                <button className={activeMuscle === muscle ? "muscle-button active" : "muscle-button"} key={muscle} onClick={() => setActiveMuscle(muscle)} data-testid={`muscle-target-${index + 1}-button`}><span>0{index + 1}</span>{muscle}<ChevronRight size={15} /></button>
              ))}
            </div>
            <Button className="outline-cta" onClick={() => scrollTo("library")} data-testid="studio-open-library-button">BROWSE EXERCISES <ArrowRight size={15} /></Button>
          </div>
        </div>
      </section>

      <section id="circuits" className="page-section circuits-section" data-testid="circuits-section">
        <div className="section-heading-row circuits-heading-row"><div><SectionEyebrow testId="circuits-eyebrow">02 / POPULAR WORKOUTS</SectionEyebrow><h2 data-testid="circuits-heading">PICK A<br /><span>WORKOUT.</span></h2></div><button className="section-link" onClick={() => scrollTo("library")} data-testid="circuits-library-link">VIEW EXERCISES <ArrowRight size={15} /></button></div>
        <div className="circuit-scroller" data-testid="circuit-card-list">
          {circuits.map((circuit) => (
            <article className={`circuit-card circuit-${circuit.accent}`} key={circuit.id} data-testid={`circuit-card-${circuit.id}`}>
              <div className="circuit-card-top"><Badge data-testid={`circuit-${circuit.id}-level-badge`}>LEVEL {circuit.level}</Badge><span data-testid={`circuit-${circuit.id}-id`}>NX / {circuit.id}</span></div>
              <div className="circuit-card-art"><WorkoutPoster circuit={circuit} testId={`circuit-${circuit.id}-poster`} /></div>
              <div className="circuit-card-content"><h3 data-testid={`circuit-${circuit.id}-name`}>{circuit.name}</h3><p data-testid={`circuit-${circuit.id}-description`}>{circuit.description}</p><div className="circuit-meta" data-testid={`circuit-${circuit.id}-metadata`}><span><TimerReset size={13} /> {circuit.time}</span><span><Grid3X3 size={13} /> {circuit.moves}</span></div><div className="circuit-card-footer"><span data-testid={`circuit-${circuit.id}-target`}>{circuit.target}</span><button onClick={() => openSession(circuit)} data-testid={`circuit-${circuit.id}-start-button`} aria-label={`Start ${circuit.name}`}><Play size={15} fill="currentColor" /></button></div></div>
              <Link className="circuit-detail-link" to={`/workouts/${circuit.slug}`} data-testid={`circuit-${circuit.id}-detail-link`}>VIEW WORKOUT <ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="quest" className="page-section quest-section" data-testid="quest-section">
        <div className="quest-copy"><SectionEyebrow testId="quest-eyebrow">03 / FREE PROGRAMS</SectionEyebrow><h2 data-testid="quest-heading">START<br /><span>SMALL.</span></h2><p data-testid="quest-description">Build a habit with a simple 30-day plan. Take it one day at a time, repeat what feels good and keep going.</p><div className="quest-progress" data-testid="quest-progress"><div className="progress-ring"><strong data-testid="quest-progress-number">{String((completedDays || []).length).padStart(2, "0")}</strong><small data-testid="quest-progress-label">/ 30 DAYS</small></div><div><b data-testid="quest-progress-title">{(completedDays || []).length} DAYS COMPLETE</b><span data-testid="quest-progress-copy">Your progress is saved on this device.</span></div></div></div>
        <div className="quest-board panel-surface" data-testid="quest-board"><div className="panel-topline"><span data-testid="quest-board-title">30-DAY PROGRAM / BEGINNER</span><Trophy size={15} /></div><div className="quest-grid" data-testid="quest-day-grid">{Array.from({ length: 30 }, (_, index) => index + 1).map((day) => { const rest = day % 7 === 0; const complete = (completedDays || []).includes(day); return <button className={`day-cell ${complete ? "complete" : ""} ${rest ? "rest" : ""} ${selectedDay === day ? "selected" : ""}`} key={day} onClick={() => { setSelectedDay(day); toggleDay(day); }} data-testid={`quest-day-${day}-button`}><span>{String(day).padStart(2, "0")}</span>{complete && <Check size={12} />}</button>; })}</div><div className="quest-board-detail" data-testid="quest-selected-day-detail"><div><span data-testid="selected-day-label">DAY {String(selectedDay).padStart(2, "0")} / {(completedDays || []).includes(selectedDay) ? "COMPLETED" : selectedDay % 7 === 0 ? "REST DAY" : "WORKOUT"}</span><b data-testid="selected-day-title">{selectedDay % 7 === 0 ? "Stretch & Recover" : "Full Body Basics"}</b></div><span className="xp-pill" data-testid="selected-day-xp">{(completedDays || []).includes(selectedDay) ? "DONE" : selectedDay % 7 === 0 ? "REST" : "START"}</span></div></div>
      </section>

      <section id="library" className="page-section library-section" data-testid="library-section">
        <div className="section-heading-row"><div><SectionEyebrow testId="library-eyebrow">04 / EXERCISE LIBRARY</SectionEyebrow><h2 data-testid="library-heading">MOVE<br /><span>BETTER.</span></h2></div><div className="library-count" data-testid="library-count"><b>50+</b><span>EXERCISES<br />TO EXPLORE</span></div></div>
        <div className="video-counter-bar" data-testid="video-counter-bar"><div className="video-counter-summary"><Play size={15} fill="currentColor" /><span data-testid="video-counter-total-label">{videoStats.attached + videoStats.alternates} VIDEO FILES</span></div><div><strong data-testid="video-counter-attached">{videoStats.attached}</strong><span data-testid="video-counter-attached-label">ATTACHED</span></div><div><strong data-testid="video-counter-alternates">{videoStats.alternates}</strong><span data-testid="video-counter-alternates-label">ALTERNATE</span></div><div><strong data-testid="video-counter-pending">{videoStats.pending}</strong><span data-testid="video-counter-pending-label">PENDING</span></div></div>
        <div className="library-toolbar"><div className="search-wrap"><Search size={16} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movement, muscle, code..." data-testid="exercise-search-input" /></div><div className="filter-row" data-testid="exercise-filter-row">{filters.map((filter) => <button className={activeFilter === filter ? "filter-button active" : "filter-button"} key={filter} onClick={() => setActiveFilter(filter)} data-testid={`exercise-filter-${filter.toLowerCase().replace(" ", "-")}-button`}>{filter}</button>)}</div></div>
        <div className="exercise-grid" data-testid="exercise-grid">{filteredExercises.map((exercise) => <article className="exercise-card" key={exercise.id} data-testid={`exercise-card-${exercise.id.toLowerCase()}`}><div className="exercise-preview"><span className="asset-code" data-testid={`${exercise.id.toLowerCase()}-asset-code`}>{exercise.id}_<br />{exercise.name.toUpperCase().replaceAll(" ", "_")}.MP4</span>{exercise.videoUrl ? <VideoThumbnail name={exercise.name} url={exercise.videoUrl} testId={`${exercise.id.toLowerCase()}-video-thumbnail`} /> : <WorkoutPoster circuit={circuits[Number(exercise.id.slice(-2)) % circuits.length]} testId={`${exercise.id.toLowerCase()}-poster`} />}{exercise.videoUrl && <span className="exercise-video-tag" data-testid={`${exercise.id.toLowerCase()}-video-attached-label`}>{exercise.alternateVideoUrls?.length ? `${1 + exercise.alternateVideoUrls.length} DEMOS` : "VIDEO ATTACHED"}</span>}<button onClick={() => exercise.videoUrl ? openVideo(exercise.name, exercise.videoUrl, exercise.alternateVideoUrls) : openSession()} data-testid={`${exercise.id.toLowerCase()}-preview-button`} aria-label={`Preview ${exercise.name}`}><Play size={14} fill="currentColor" /></button></div><div className="exercise-info"><div><h3 data-testid={`${exercise.id.toLowerCase()}-name`}>{exercise.name}</h3><span data-testid={`${exercise.id.toLowerCase()}-group`}>{exercise.group}</span></div><div className="exercise-specs" data-testid={`${exercise.id.toLowerCase()}-specs`}><span>{exercise.reps}</span><span>TEMPO {exercise.tempo}</span></div></div></article>)}{filteredExercises.length === 0 && <div className="empty-library" data-testid="exercise-empty-state">No movements found. Try another signal.</div>}</div>
      </section>

      <footer className="site-footer" data-testid="site-footer">
        <div className="footer-brand flex items-center">
          <img src="/logo.png" alt="ATHLENTO" className="h-9 w-auto object-contain" />
        </div>
        <p data-testid="footer-copy">Free workouts. Clear plans. A stronger everyday.</p>
        <span className="footer-note" data-testid="footer-asset-note">EXERCISE LIBRARY / WORKOUTS / PROGRAMS / CHALLENGES</span>
      </footer>

      <div className="mobile-bottom-nav" data-testid="mobile-bottom-navigation"><button onClick={() => scrollTo("studio")} data-testid="bottom-nav-studio-button"><Move3d size={17} /><span>STUDIO</span></button><button onClick={() => scrollTo("circuits")} data-testid="bottom-nav-circuits-button"><Flame size={17} /><span>CIRCUITS</span></button><button className="bottom-nav-main" onClick={() => openSession()} data-testid="bottom-nav-start-button"><Play size={17} fill="currentColor" /><span>START</span></button><button onClick={() => scrollTo("quest")} data-testid="bottom-nav-quest-button"><Trophy size={17} /><span>QUEST</span></button><button onClick={() => scrollTo("library")} data-testid="bottom-nav-library-button"><Search size={17} /><span>VAULT</span></button></div>

            {sessionOpen && (
        <div className="session-backdrop" role="dialog" aria-modal="true" aria-label="Workout runner" data-testid="workout-runner-modal">
          <div className="session-modal max-w-2xl w-full p-6 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Top Close & Audio Bar */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
                  {sessionCompleted ? "PROTOCOL FINISHED" : sessionStarted ? `MOVE ${String(activeStep + 1).padStart(2, "0")} / ${String(selectedCircuit.steps?.length || 1).padStart(2, "0")}` : "DAILY PROTOCOL BRIEFING"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {sessionStarted && !sessionCompleted && (
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                    title={isMuted ? "Unmute sound" : "Mute sound"}
                  >
                    {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>
                )}
                <button
                  type="button"
                  className="modal-close p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  onClick={() => setSessionOpen(false)}
                  data-testid="workout-runner-close-button"
                  aria-label="Close workout runner"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* STAGE 1: BRIEFING (PRE-WORKOUT) */}
            {!sessionStarted && !sessionCompleted && (
              <div className="flex flex-col gap-5">
                <div className="session-copy">
                  <SectionEyebrow testId="session-eyebrow">LIVE WORKOUT RUNNER</SectionEyebrow>
                  <h2 className="text-2xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white" data-testid="session-heading">
                    {selectedCircuit.name}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1" data-testid="session-description">
                    {selectedCircuit.description}
                  </p>
                  <div className="session-stats flex items-center gap-6 my-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <b className="block text-base text-zinc-900 dark:text-white" data-testid="session-time">{selectedCircuit.time}</b>
                      <small className="text-[10px] uppercase tracking-wider text-zinc-500">SESSION</small>
                    </div>
                    <div>
                      <b className="block text-base text-zinc-900 dark:text-white" data-testid="session-set-count">0{activeSet + 1} / 03</b>
                      <small className="text-[10px] uppercase tracking-wider text-zinc-500">SETS</small>
                    </div>
                    <div>
                      <b className="block text-base text-zinc-900 dark:text-white" data-testid="session-target">{selectedCircuit.target}</b>
                      <small className="text-[10px] uppercase tracking-wider text-zinc-500">TARGET</small>
                    </div>
                  </div>
                </div>

                {/* Steps preview list */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded p-3 bg-zinc-50/50 dark:bg-zinc-900/50 max-h-48 overflow-y-auto flex flex-col gap-2">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-500 uppercase">Movement Sequence:</span>
                  {selectedCircuit.steps?.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {String(idx + 1).padStart(2, "0")}. {step.exercise}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {step.sets} SETS • {step.reps}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className="primary-cta session-cta w-full py-3.5 bg-black text-white hover:bg-zinc-800 font-bold rounded flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all"
                  onClick={() => setSessionStarted(true)}
                  data-testid="workout-runner-action-button"
                >
                  START SESSION <ArrowRight size={16} />
                </Button>
              </div>
            )}

            {/* STAGE 2: ACTIVE LIVE WORKOUT RUNNER */}
            {sessionStarted && !sessionCompleted && (
              <div className="flex flex-col gap-4">
                {/* Visual Video Demonstration */}
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
                  {selectedCircuit.steps?.[activeStep]?.videoKey && exerciseVideoMap[selectedCircuit.steps[activeStep].videoKey] ? (
                    <video
                      key={selectedCircuit.steps[activeStep].videoKey}
                      className="w-full h-full object-contain"
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={exerciseVideoMap[selectedCircuit.steps[activeStep].videoKey]}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
                      <Play size={36} className="mb-2 opacity-60 text-white" />
                      <span className="font-mono text-xs uppercase tracking-wider text-white">DEMO PLAYBACK READY</span>
                    </div>
                  )}

                  {/* High-Tech Timer Overlay */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur border border-white/20 rounded px-3 py-1.5 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${timerPhase === "work" ? "bg-red-500 animate-ping" : "bg-cyan-400"}`} />
                    <span className="font-mono font-bold text-white text-base">
                      00:{String(timerSeconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-300 uppercase">
                      {timerPhase === "work" ? "WORK" : "REST"}
                    </span>
                  </div>

                  {/* Phase Banner */}
                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur border border-white/10 px-2.5 py-1 rounded">
                    <span className="text-[11px] font-mono font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                      {timerPhase === "work" ? <Flame size={13} className="text-amber-400" /> : <TimerReset size={13} className="text-cyan-400" />}
                      {timerPhase === "work" ? "ACTIVE WORKOUT" : "REST & HYDRATE"}
                    </span>
                  </div>
                </div>

                {/* Exercise Info & Form Tips */}
                <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                      {selectedCircuit.steps?.[activeStep]?.exercise || selectedCircuit.name}
                    </h3>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {selectedCircuit.steps?.[activeStep]?.reps || "40 SEC"}
                    </span>
                  </div>
                  {selectedCircuit.steps?.[activeStep]?.modification && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5">
                      <strong className="text-zinc-900 dark:text-zinc-200 font-semibold">MODIFY:</strong> {selectedCircuit.steps[activeStep].modification}
                    </p>
                  )}
                  {timerPhase === "rest" && activeStep < (selectedCircuit.steps?.length || 1) - 1 && (
                    <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                      👉 <b>UP NEXT:</b> {selectedCircuit.steps[activeStep + 1].exercise}
                    </div>
                  )}
                </div>

                {/* Interactive Player Controls */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    disabled={activeStep === 0}
                    onClick={() => {
                      setActiveStep((s) => Math.max(0, s - 1));
                      setTimerSeconds(40);
                      setTimerPhase("work");
                    }}
                    className="p-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-700 dark:text-zinc-300 flex items-center gap-1 text-xs font-bold"
                  >
                    <ChevronLeft size={16} /> PREV
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTimerPaused(!isTimerPaused)}
                    className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    {isTimerPaused ? <Play size={15} fill="currentColor" /> : <Pause size={15} />}
                    {isTimerPaused ? "RESUME" : "PAUSE"}
                  </button>

                  <Button
                    className="primary-cta session-cta px-4 py-2 bg-black text-white hover:bg-zinc-800 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    onClick={() => {
                      const totalSteps = selectedCircuit.steps?.length || 1;
                      if (activeStep >= totalSteps - 1) {
                        setSessionCompleted(true);
                      } else {
                        setActiveStep((s) => s + 1);
                        setTimerSeconds(40);
                        setTimerPhase("work");
                      }
                    }}
                    data-testid="workout-runner-action-button"
                  >
                    {activeStep >= (selectedCircuit.steps?.length || 1) - 1 ? "FINISH" : "NEXT MOVE"} <ChevronRight size={16} />
                  </Button>
                </div>

                <div className="session-live-status text-center text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold" data-testid="session-live-status">
                  <span className="live-dot inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  LIVE / MOVE {activeStep + 1} OF {selectedCircuit.steps?.length || 1} / STAY CONSISTENT
                </div>
              </div>
            )}

            {/* STAGE 3: VICTORY SCREEN */}
            {sessionCompleted && (
              <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Trophy size={28} />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                    MISSION ACCOMPLISHED
                  </span>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white mt-1">
                    {selectedCircuit.name} CLEARED!
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm">
                    Great work! You finished today's protocol with zero excuses. Consistency builds legends.
                  </p>
                </div>

                {/* Victory Stats Grid */}
                <div className="grid grid-cols-3 gap-3 w-full my-2">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                    <span className="block text-lg font-black text-zinc-900 dark:text-white">{selectedCircuit.time}</span>
                    <small className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">DURATION</small>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                    <span className="block text-lg font-black text-zinc-900 dark:text-white">{selectedCircuit.steps?.length || 10}</span>
                    <small className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">MOVES DONE</small>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
                    <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">🔥 {userStreak} DAYS</span>
                    <small className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">STREAK</small>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSessionOpen(false)}
                  className="w-full py-3 bg-black text-white hover:bg-zinc-800 font-bold rounded text-xs uppercase tracking-wider transition-colors mt-2"
                >
                  COMPLETE & RETURN TO HOME
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {selectedVideo && <div className="video-backdrop" role="dialog" aria-modal="true" aria-label={`${selectedVideo.name} video`} data-testid="exercise-video-modal"><div className="video-modal"><button className="modal-close" onClick={() => setSelectedVideo(null)} data-testid="exercise-video-close-button" aria-label="Close exercise video"><X size={19} /></button><SectionEyebrow testId="exercise-video-eyebrow">EXERCISE DEMO / PUBLIC ASSET</SectionEyebrow><h2 data-testid="exercise-video-heading">{selectedVideo.name}</h2>{selectedVideo.urls.length > 1 && <div className="video-source-tabs" data-testid="exercise-video-source-tabs">{selectedVideo.urls.map((url, index) => <button className={selectedVideo.index === index ? "active" : ""} key={url} onClick={() => setSelectedVideo((video) => video ? { ...video, index } : null)} data-testid={`exercise-video-source-${index + 1}-button`}>DEMO {index + 1}</button>)}</div>}<video className="exercise-video-player" controls autoPlay playsInline key={selectedVideo.urls[selectedVideo.index]} src={selectedVideo.urls[selectedVideo.index]} data-testid="exercise-video-player" /><a className="video-open-link" href={selectedVideo.urls[selectedVideo.index]} target="_blank" rel="noreferrer" data-testid="exercise-video-open-link">OPEN VIDEO IN NEW TAB <ArrowRight size={14} /></a></div></div>}
    </main>
  );
}

