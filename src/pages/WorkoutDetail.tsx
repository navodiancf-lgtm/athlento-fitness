import { ArrowLeft, Clock3, Download, Play, Printer, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { exerciseVideoMap, workouts } from "@/lib/fitnessData";

function PrintablePoster({ workout }: { workout: (typeof workouts)[number] }) {
  return (
    <div className="detail-poster" data-testid="workout-detail-poster">
      {workout.posterUrl ? <img src={workout.posterUrl} alt={`${workout.name} poster`} data-testid="workout-detail-poster-image" /> : <>
        <div className="detail-poster-top"><span>NEXUS FITNESS / {workout.id}</span><b>WORKOUT CARD</b></div>
        <div className="detail-poster-symbol" aria-hidden="true"><span>{workout.id}</span><i /><i /><i /></div>
        <h2 data-testid="workout-detail-poster-title">{workout.name}</h2>
        <p data-testid="workout-detail-poster-subtitle">{workout.target} / {workout.time} / LEVEL {workout.level}</p>
        <div className="detail-poster-bottom"><span>PRINTABLE</span><span>NO EQUIPMENT</span></div>
      </>}
    </div>
  );
}

export default function WorkoutDetail() {
  const { slug } = useParams();
  const workout = workouts.find((item) => item.slug === slug);

  if (!workout) {
    return <main className="detail-page" data-testid="workout-not-found"><div className="detail-not-found"><h1 data-testid="workout-not-found-heading">Workout not found</h1><Link to="/" data-testid="workout-not-found-home-link">Return home</Link></div></main>;
  }

  return (
    <main className="detail-page" data-testid="workout-detail-page">
      <header className="detail-header" data-testid="workout-detail-header"><Link className="detail-back-link" to="/" data-testid="workout-detail-back-link"><ArrowLeft size={16} /> ALL WORKOUTS</Link><span data-testid="workout-detail-brand">NEXUS FITNESS</span><span data-testid="workout-detail-id">NX / {workout.id}</span></header>
      <div className="detail-shell">
        <div className="detail-intro"><p className="section-eyebrow" data-testid="workout-detail-eyebrow"><span /> WORKOUT DETAILS</p><h1 data-testid="workout-detail-heading">{workout.name}</h1><p className="detail-description" data-testid="workout-detail-description">{workout.description} Follow the sequence at your own pace, take the suggested rest and choose a modification whenever you need it.</p><div className="detail-actions"><Button className="detail-print-button" onClick={() => window.print()} data-testid="workout-detail-print-button"><Printer size={16} /> PRINT WORKOUT</Button>{workout.posterUrl ? <a className="detail-download-link" href={workout.posterUrl} download={`${workout.slug}-poster`} target="_blank" rel="noreferrer" data-testid="workout-detail-download-link"><Download size={16} /> DOWNLOAD POSTER</a> : <span className="detail-download-link disabled" data-testid="workout-detail-download-pending"><Download size={16} /> POSTER URL PENDING</span>}</div></div>
        <PrintablePoster workout={workout} />
      </div>
      <section className="detail-meta-grid" data-testid="workout-detail-meta"><div><Clock3 size={18} /><span>TIME<b data-testid="workout-detail-time">{workout.time}</b></span></div><div><ShieldCheck size={18} /><span>LEVEL<b data-testid="workout-detail-level">{workout.level === "I" ? "BEGINNER" : workout.level === "II" ? "INTERMEDIATE" : "ADVANCED"}</b></span></div><div><span className="meta-number">{workout.steps.length}</span><span>MOVES<b data-testid="workout-detail-moves">{workout.moves}</b></span></div><div><span className="meta-number">0</span><span>EQUIPMENT<b data-testid="workout-detail-equipment">NONE</b></span></div></section>
      <section className="detail-workout-section" data-testid="workout-detail-sequence"><div className="detail-section-heading"><p className="section-eyebrow" data-testid="workout-sequence-eyebrow"><span /> THE ROUTINE</p><h2 data-testid="workout-sequence-heading">FOLLOW THE<br /><span>SEQUENCE.</span></h2><p data-testid="workout-sequence-copy">Complete each movement in order. Rest is part of the plan, not a failure.</p></div><div className="routine-table" data-testid="workout-routine-table">{workout.steps.map((step, index) => <article className="routine-row" key={step.exercise} data-testid={`routine-row-${index + 1}`}><span className="routine-number" data-testid={`routine-number-${index + 1}`}>{String(index + 1).padStart(2, "0")}</span><div className="routine-main"><h3 data-testid={`routine-exercise-${index + 1}`}>{step.exercise}</h3><span data-testid={`routine-modification-${index + 1}`}><b>MODIFY:</b> {step.modification}</span></div><div className="routine-stat"><b data-testid={`routine-sets-${index + 1}`}>{step.sets} SETS</b><span data-testid={`routine-reps-${index + 1}`}>{step.reps}</span></div><div className="routine-stat"><b>REST</b><span data-testid={`routine-rest-${index + 1}`}>{step.rest}</span></div>{step.videoKey && exerciseVideoMap[step.videoKey] ? <video className="routine-video" controls preload="metadata" src={exerciseVideoMap[step.videoKey]} data-testid={`routine-video-${index + 1}`} /> : <span className="routine-video-pending" data-testid={`routine-video-pending-${index + 1}`}><Play size={12} /> DEMO PENDING</span>}</article>)}</div></section>
      <footer className="detail-footer" data-testid="workout-detail-footer"><Link to="/" data-testid="workout-detail-footer-home">NEXUS FITNESS</Link><span data-testid="workout-detail-footer-note">PRINTABLE FITNESS / FREE FOR EVERY BODY</span></footer>
    </main>
  );
}