import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  CirclePlay,
  Flame,
  Gauge,
  Grid3X3,
  Menu,
  Move3d,
  Play,
  Search,
  Sparkles,
  TimerReset,
  Trophy,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { exerciseLibrary as exercises, heroCategories, workoutFilters as filters, workouts as circuits } from "@/lib/fitnessData";

// Native 100% Reliable Components (Zero Missing Library Errors)
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
      {circuit.posterUrl ? (
        <img src={circuit.posterUrl} alt={`${circuit.name} workout poster`} data-testid={`${testId}-image`} className="w-full h-full object-cover" />
      ) : (
        <>
          <div className="poster-topline"><span>NX / {circuit.id}</span><b>NO EQUIPMENT</b></div>
          <div className="poster-mark" aria-hidden="true"><span>{circuit.id}</span><i /><i /><i /></div>
          <div className="poster-copy"><strong>{circuit.name}</strong><span>{circuit.target} / {circuit.time}</span></div>
          <div className="poster-footer"><span>LEVEL {circuit.level}</span><span>{circuit.moves}</span></div>
        </>
      )}
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

  const toggle = () => (isPlaying ? pause() : play());

  return (
    <div
      className={`exercise-card-video-wrap ${isPlaying ? "playing" : ""}`}
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle();
        }
      }}
      aria-label={`${isPlaying ? "Pause" : "Play"} ${name} inline preview`}
      data-testid={`${testId}-inline-toggle`}
    >
      <video ref={videoRef} className="exercise-card-video" muted loop playsInline preload="metadata" src={`${url}#t=0.1`} aria-label={`${name} video thumbnail`} data-testid={testId} />
      <span className="inline-preview-state" data-testid={`${testId}-state`}>{isPlaying ? "TAP TO PAUSE" : "TAP TO PREVIEW"}</span>
    </div>
  );
}

export default function Home() {
  const [activeMuscle, setActiveMuscle] = useState("FULL BODY");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeSet, setActiveSet] = useState(0);
  const [selectedCircuit, setSelectedCircuit] = useState(circuits[0]);
  const [selectedDay, setSelectedDay] = useState(4);
  const [selectedVideo, setSelectedVideo] = useState<{ name: string; urls: string[]; index: number } | null>(null);

  const [completedDays, setCompletedDays] = useState<number[]>(Array.of(1, 2, 3));

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("athlento-completed-days");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompletedDays(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (completedDays) {
      window.localStorage.setItem("athlento-completed-days", JSON.stringify(completedDays));
    }
  }, [completedDays]);

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const matchesFilter = activeFilter === "ALL" || exercise.group === activeFilter;
      const matchesQuery = !normalizedQuery || `${exercise.name} ${exercise.group}`.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const openSession = (circuit = circuits[0]) => {
    setSelectedCircuit(circuit);
    setActiveSet(0);
    setSessionStarted(false);
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

  const openVideo = (name: string, url: string, alternates: string[] = []) =>
    setSelectedVideo({ name, urls: [url, ...alternates], index: 0 });

  return (
    <main className="min-h-svh overflow-x-hidden bg-background text-foreground" data-testid="athlento-fitness-page">
      <header className="site-header" data-testid="site-header">
        {/* Only Logo, No extra text */}
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
          <Button className="header-cta" onClick={() => openSession()} data-testid="header-start-workout-button">
            DAILY WORKOUT <ArrowRight size={15} />
          </Button>
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
          {heroCategories.map((category, index) => (
            <Link className="hero-category-link" key={category.label} to={category.path} data-testid={`hero-category-${index + 1}-link`}>
              {category.label}<ChevronRight size={13} />
            </Link>
          ))}
        </nav>
        <div className="hero-copy">
          <SectionEyebrow testId="hero-eyebrow">FREE WORKOUTS / FOR EVERY BODY</SectionEyebrow>
          <h1 data-testid="hero-heading">GET FIT.<br /><span>FEEL GREAT.</span></h1>
          <p className="hero-description" data-testid="hero-description">
            Simple, effective workouts, programs and challenges you can do anywhere. No gym required. No subscription required.
          </p>
          <div className="hero-actions">
            <Button className="primary-cta" onClick={() => openSession()} data-testid="hero-launch-workout-button">
              <CirclePlay size={18} fill="currentColor" /> WORKOUT OF THE DAY
            </Button>
            <button className="text-cta" onClick={() => scrollTo("circuits")} data-testid="hero-explore-circuits-button">
              BROWSE WORKOUTS <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-proof" data-testid="hero-proof-stats">
            <div><strong data-testid="hero-stat-exercises">50<span>+</span></strong><small data-testid="hero-stat-exercises-label">FREE WORKOUTS</small></div>
            <div><strong data-testid="hero-stat-circuits">05</strong><small data-testid="hero-stat-circuits-label">PROGRAMS</small></div>
            <div><strong data-testid="hero-stat-days">30</strong><small data-testid="hero-stat-days-label">DAY CHALLENGE</small></div>
          </div>
        </div>

        {/* Hero Workout Box */}
        <div className="hero-stage-wrap" data-testid="hero-stage-wrap">
          <div className="hero-stage-label label-top" data-testid="hero-stage-mode-label"><Move3d size={14} /> WORKOUT OF THE DAY</div>
          <div className="hero-stage" data-testid="hero-stage">
            <img 
              src={heroImage} 
              alt="Workout of the day" 
              className="w-full h-full object-cover" 
              onError={(e) => { 
                e.currentTarget.style.opacity = "0.3"; 
              }} 
            />
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
          <div>
            <SectionEyebrow testId="studio-eyebrow">01 / FIND YOUR FOCUS</SectionEyebrow>
            <h2 data-testid="studio-heading">WORKOUTS<br /><span>FOR YOU.</span></h2>
          </div>
          <p className="section-side-copy" data-testid="studio-description">
            Choose a body focus, pick a workout and start moving. Every routine is clear, printable and easy to follow.
          </p>
        </div>
        <div className="studio-layout">
          {/* Dynamic 5 Focus Areas Anatomy Panel */}
          <div className="anatomy-panel panel-surface relative overflow-hidden flex flex-col justify-between" data-testid="anatomy-panel">
            <div className="panel-topline">
              <span data-testid="anatomy-panel-title">CHOOSE YOUR FOCUS</span>
              <span data-testid="anatomy-panel-status">5 AREAS</span>
            </div>
            <img
              src={muscleImageMap[activeMuscle] || "/images/anatomy-focus.png"}
              alt={activeMuscle}
              className="w-full h-[370px] object-contain my-auto py-2 transition-all duration-300"
              onError={(e) => {
                e.currentTarget.src = "/images/anatomy-focus.png";
              }}
            />
          </div>
          <div className="target-panel" data-testid="target-panel">
            <div className="target-panel-copy">
              <span className="target-index" data-testid="target-index">FOCUS / 0{muscles.indexOf(activeMuscle) + 1}</span>
              <h3 data-testid="active-target-heading">{activeMuscle}</h3>
              <p data-testid="active-target-description">Find a routine for this focus and make it part of your everyday movement.</p>
            </div>
            <div className="muscle-list" data-testid="muscle-selector">
              {muscles.map((muscle, index) => (
                <button
                  className={activeMuscle === muscle ? "muscle-button active" : "muscle-button"}
                  key={muscle}
                  onClick={() => setActiveMuscle(muscle)}
                  data-testid={`muscle-target-${index + 1}-button`}
                >
                  <span>0{index + 1}</span>{muscle}<ChevronRight size={15} />
                </button>
              ))}
            </div>
            <Button className="outline-cta" onClick={() => scrollTo("library")} data-testid="studio-open-library-button">
              BROWSE EXERCISES <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </section>

      <section id="circuits" className="page-section circuits-section" data-testid="circuits-section">
        <div className="section-heading-row circuits-heading-row">
          <div><SectionEyebrow testId="circuits-eyebrow">02 / POPULAR WORKOUTS</SectionEyebrow><h2 data-testid="circuits-heading">PICK A<br /><span>WORKOUT.</span></h2></div>
          <button className="section-link" onClick={() => scrollTo("library")} data-testid="circuits-library-link">VIEW EXERCISES <ArrowRight size={15} /></button>
        </div>
        <div className="circuit-scroller" data-testid="circuit-card-list">
          {circuits.map((circuit) => (
            <article className={`circuit-card circuit-${circuit.accent}`} key={circuit.id} data-testid={`circuit-card-${circuit.id}`}>
              <div className="circuit-card-top"><Badge data-testid={`circuit-${circuit.id}-level-badge`}>LEVEL {circuit.level}</Badge><span data-testid={`circuit-${circuit.id}-id`}>NX / {circuit.id}</span></div>
              <div className="circuit-card-art"><WorkoutPoster circuit={circuit} testId={`circuit-${circuit.id}-poster`} /></div>
              <div className="circuit-card-content">
                <h3 data-testid={`circuit-${circuit.id}-name`}>{circuit.name}</h3>
                <p data-testid={`circuit-${circuit.id}-description`}>{circuit.description}</p>
                <div className="circuit-meta" data-testid={`circuit-${circuit.id}-metadata`}>
                  <span><TimerReset size={13} /> {circuit.time}</span>
                  <span><Grid3X3 size={13} /> {circuit.moves}</span>
                </div>
                <div className="circuit-card-footer">
                  <span data-testid={`circuit-${circuit.id}-target`}>{circuit.target}</span>
                  <button onClick={() => openSession(circuit)} data-testid={`circuit-${circuit.id}-start-button`} aria-label={`Start ${circuit.name}`}>
                    <Play size={15} fill="currentColor" />
                  </button>
                </div>
              </div>
              <Link className="circuit-detail-link" to={`/workouts/${circuit.slug}`} data-testid={`circuit-${circuit.id}-detail-link`}>VIEW WORKOUT <ArrowRight size={14} /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="quest" className="page-section quest-section" data-testid="quest-section">
        <div className="quest-copy">
          <SectionEyebrow testId="quest-eyebrow">03 / FREE PROGRAMS</SectionEyebrow>
          <h2 data-testid="quest-heading">START<br /><span>SMALL.</span></h2>
          <p data-testid="quest-description">Build a habit with a simple 30-day plan. Take it one day at a time, repeat what feels good and keep going.</p>
          <div className="quest-progress" data-testid="quest-progress">
            <div className="progress-ring"><strong data-testid="quest-progress-number">{String((completedDays || []).length).padStart(2, "0")}</strong><small data-testid="quest-progress-label">/ 30 DAYS</small></div>
            <div><b data-testid="quest-progress-title">{(completedDays || []).length} DAYS COMPLETE</b><span data-testid="quest-progress-copy">Your progress is saved on this device.</span></div>
          </div>
        </div>
        <div className="quest-board panel-surface" data-testid="quest-board">
          <div className="panel-topline"><span data-testid="quest-board-title">30-DAY PROGRAM / BEGINNER</span><Trophy size={15} /></div>
          <div className="quest-grid" data-testid="quest-day-grid">
            {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => {
              const rest = day % 7 === 0;
              const complete = (completedDays || []).includes(day);
              return (
                <button
                  className={`day-cell ${complete ? "complete" : ""} ${rest ? "rest" : ""} ${selectedDay === day ? "selected" : ""}`}
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    toggleDay(day);
                  }}
                  data-testid={`quest-day-${day}-button`}
                >
                  <span>{String(day).padStart(2, "0")}</span>
                  {complete && <Check size={12} />}
                </button>
              );
            })}
          </div>
          <div className="quest-board-detail" data-testid="quest-selected-day-detail">
            <div>
              <span data-testid="selected-day-label">
                DAY {String(selectedDay).padStart(2, "0")} / {(completedDays || []).includes(selectedDay) ? "COMPLETED" : selectedDay % 7 === 0 ? "REST DAY" : "WORKOUT"}
              </span>
              <b data-testid="selected-day-title">{selectedDay % 7 === 0 ? "Stretch & Recover" : "Full Body Basics"}</b>
            </div>
            <span className="xp-pill" data-testid="selected-day-xp">
              {(completedDays || []).includes(selectedDay) ? "DONE" : selectedDay % 7 === 0 ? "REST" : "START"}
            </span>
          </div>
        </div>
      </section>

      <section id="library" className="page-section library-section" data-testid="library-section">
        <div className="section-heading-row">
          <div><SectionEyebrow testId="library-eyebrow">04 / EXERCISE LIBRARY</SectionEyebrow><h2 data-testid="library-heading">MOVE<br /><span>BETTER.</span></h2></div>
          <div className="library-count" data-testid="library-count"><b>50+</b><span>EXERCISES<br />TO EXPLORE</span></div>
        </div>
        <div className="video-counter-bar" data-testid="video-counter-bar">
          <div className="video-counter-summary"><Play size={15} fill="currentColor" /><span data-testid="video-counter-total-label">{videoStats.attached + videoStats.alternates} VIDEO FILES</span></div>
          <div><strong data-testid="video-counter-attached">{videoStats.attached}</strong><span data-testid="video-counter-attached-label">ATTACHED</span></div>
          <div><strong data-testid="video-counter-alternates">{videoStats.alternates}</strong><span data-testid="video-counter-alternates-label">ALTERNATE</span></div>
          <div><strong data-testid="video-counter-pending">{videoStats.pending}</strong><span data-testid="video-counter-pending-label">PENDING</span></div>
        </div>
        <div className="library-toolbar">
          <div className="search-wrap">
            <Search size={16} />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movement, muscle, code..." data-testid="exercise-search-input" />
          </div>
          <div className="filter-row" data-testid="exercise-filter-row">
            {filters.map((filter) => (
              <button
                className={activeFilter === filter ? "filter-button active" : "filter-button"}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                data-testid={`exercise-filter-${filter.toLowerCase().replace(" ", "-")}-button`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <div className="exercise-grid" data-testid="exercise-grid">
          {filteredExercises.map((exercise) => (
            <article className="exercise-card" key={exercise.id} data-testid={`exercise-card-${exercise.id.toLowerCase()}`}>
              <div className="exercise-preview">
                <span className="asset-code" data-testid={`${exercise.id.toLowerCase()}-asset-code`}>
                  {exercise.id}_<br />{exercise.name.toUpperCase().replaceAll(" ", "_")}.MP4
                </span>
                {exercise.videoUrl ? (
                  <VideoThumbnail name={exercise.name} url={exercise.videoUrl} testId={`${exercise.id.toLowerCase()}-video-thumbnail`} />
                ) : (
                  <WorkoutPoster circuit={circuits[Number(exercise.id.slice(-2)) % circuits.length]} testId={`${exercise.id.toLowerCase()}-poster`} />
                )}
                {exercise.videoUrl && (
                  <span className="exercise-video-tag" data-testid={`${exercise.id.toLowerCase()}-video-attached-label`}>
                    {exercise.alternateVideoUrls?.length ? `${1 + exercise.alternateVideoUrls.length} DEMOS` : "VIDEO ATTACHED"}
                  </span>
                )}
                <button
                  onClick={() => (exercise.videoUrl ? openVideo(exercise.name, exercise.videoUrl, exercise.alternateVideoUrls) : openSession())}
                  data-testid={`${exercise.id.toLowerCase()}-preview-button`}
                  aria-label={`Preview ${exercise.name}`}
                >
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
              <div className="exercise-info">
                <div>
                  <h3 data-testid={`${exercise.id.toLowerCase()}-name`}>{exercise.name}</h3>
                  <span data-testid={`${exercise.id.toLowerCase()}-group`}>{exercise.group}</span>
                </div>
                <div className="exercise-specs" data-testid={`${exercise.id.toLowerCase()}-specs`}>
                  <span>{exercise.reps}</span>
                  <span>TEMPO {exercise.tempo}</span>
                </div>
              </div>
            </article>
          ))}
          {filteredExercises.length === 0 && <div className="empty-library" data-testid="exercise-empty-state">No movements found. Try another signal.</div>}
        </div>
      </section>

      <footer className="site-footer" data-testid="site-footer">
        {/* Only Logo, No extra text */}
        <div className="footer-brand flex items-center">
          <img src="/logo.png" alt="ATHLENTO" className="h-9 w-auto object-contain" />
        </div>
        <p data-testid="footer-copy">Free workouts. Clear plans. A stronger everyday.</p>
        <span className="footer-note" data-testid="footer-asset-note">EXERCISE LIBRARY / WORKOUTS / PROGRAMS / CHALLENGES</span>
      </footer>

      <div className="mobile-bottom-nav" data-testid="mobile-bottom-navigation">
        <button onClick={() => scrollTo("studio")} data-testid="bottom-nav-studio-button"><Move3d size={17} /><span>STUDIO</span></button>
        <button onClick={() => scrollTo("circuits")} data-testid="bottom-nav-circuits-button"><Flame size={17} /><span>CIRCUITS</span></button>
        <button className="bottom-nav-main" onClick={() => openSession()} data-testid="bottom-nav-start-button"><Play size={17} fill="currentColor" /><span>START</span></button>
        <button onClick={() => scrollTo("quest")} data-testid="bottom-nav-quest-button"><Trophy size={17} /><span>QUEST</span></button>
        <button onClick={() => scrollTo("library")} data-testid="bottom-nav-library-button"><Search size={17} /><span>VAULT</span></button>
      </div>

      {sessionOpen && (
        <div className="session-backdrop" role="dialog" aria-modal="true" aria-label="Workout runner" data-testid="workout-runner-modal">
          <div className="session-modal">
            <button className="modal-close" onClick={() => setSessionOpen(false)} data-testid="workout-runner-close-button" aria-label="Close workout runner">
              <X size={19} />
            </button>
            <div className="session-visual">
              <img src="/images/anatomy-focus.png" alt="Workout Runner" className="w-full h-full object-contain p-6" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <span className="session-asset" data-testid="session-asset-label">EX-{selectedCircuit.id}_{selectedCircuit.name.replaceAll(" ", "_")}.MP4</span>
            </div>
            <div className="session-copy">
              <SectionEyebrow testId="session-eyebrow">LIVE WORKOUT RUNNER</SectionEyebrow>
              <h2 data-testid="session-heading">{selectedCircuit.name}</h2>
              <p data-testid="session-description">{selectedCircuit.description}</p>
              <div className="session-stats">
                <span><b data-testid="session-time">{selectedCircuit.time}</b><small>SESSION</small></span>
                <span><b data-testid="session-set-count">0{activeSet + 1} / 03</b><small>SETS</small></span>
                <span><b data-testid="session-target">{selectedCircuit.target}</b><small>TARGET</small></span>
              </div>
              <Button className="primary-cta session-cta" onClick={() => { if (sessionStarted) { setActiveSet((value) => Math.min(value + 1, 2)); } else { setSessionStarted(true); } }} data-testid="workout-runner-action-button">
                {sessionStarted ? (activeSet >= 2 ? "SESSION COMPLETE" : "COMPLETE SET") : "START SESSION"} <ArrowRight size={15} />
              </Button>
              {sessionStarted && (
                <div className="session-live-status" data-testid="session-live-status">
                  <span className="live-dot" /> LIVE / SET {activeSet + 1} OF 03 / KEEP MOVING
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedVideo && (
        <div className="video-backdrop" role="dialog" aria-modal="true" aria-label={`${selectedVideo.name} video`} data-testid="exercise-video-modal">
          <div className="video-modal">
            <button className="modal-close" onClick={() => setSelectedVideo(null)} data-testid="exercise-video-close-button" aria-label="Close exercise video">
              <X size={19} />
            </button>
            <SectionEyebrow testId="exercise-video-eyebrow">EXERCISE DEMO / PUBLIC ASSET</SectionEyebrow>
            <h2 data-testid="exercise-video-heading">{selectedVideo.name}</h2>
            {selectedVideo.urls.length > 1 && (
              <div className="video-source-tabs" data-testid="exercise-video-source-tabs">
                {selectedVideo.urls.map((url, index) => (
                  <button className={selectedVideo.index === index ? "active" : ""} key={url} onClick={() => setSelectedVideo((video) => (video ? { ...video, index } : null))} data-testid={`exercise-video-source-${index + 1}-button`}>
                    DEMO {index + 1}
                  </button>
                ))}
              </div>
            )}
            <video className="exercise-video-player" controls autoPlay playsInline key={selectedVideo.urls[selectedVideo.index]} src={selectedVideo.urls[selectedVideo.index]} data-testid="exercise-video-player" />
            <a className="video-open-link" href={selectedVideo.urls[selectedVideo.index]} target="_blank" rel="noreferrer" data-testid="exercise-video-open-link">
              OPEN VIDEO IN NEW TAB <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
