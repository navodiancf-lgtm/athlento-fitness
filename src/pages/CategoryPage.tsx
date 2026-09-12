import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Dumbbell, Flame, Heart, Layers3, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { categoryPages } from "@/lib/fitnessData";

const icons = [Dumbbell, CalendarDays, Flame, BookOpen, Layers3, Heart];

export default function CategoryPage() {
  const { category = "workouts" } = useParams();
  const page = categoryPages[category] ?? categoryPages.workouts;
  const Icon = icons[Object.keys(categoryPages).indexOf(category) % icons.length] ?? Sparkles;

  return (
    <main className="category-page" data-testid="category-page">
      <header className="category-header" data-testid="category-header">
        <Link to="/" className="category-back-link" data-testid="category-back-link">
          <ArrowLeft size={16} /> ATHLENTO
        </Link>
        <span data-testid="category-header-label">FREE FITNESS / FOR EVERY BODY</span>
      </header>

      <section className="category-hero" data-testid="category-hero">
        <p className="section-eyebrow" data-testid="category-eyebrow"><span /> {page.eyebrow}</p>
        <div className="category-hero-row">
          <div>
            <h1 data-testid="category-heading">{page.title}</h1>
            <p data-testid="category-description">{page.description}</p>
          </div>
          <div className="category-hero-icon" data-testid="category-hero-icon">
            <Icon size={35} />
          </div>
        </div>
      </section>

      <section className="category-content" data-testid="category-content">
        <div className="category-grid" data-testid="category-card-grid">
          {page.cards.map((card, index) => {
            const CardIcon = icons[index % icons.length];
            const content = (
              <>
                {/* Horizontal Banner Image for the Card */}
                <div className="w-full h-40 overflow-hidden bg-neutral-100 rounded-t-sm mb-3 -mx-4 -mt-4">
                  <img
                    src={`/images/workouts/${card.slug}.jpg`}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget.parentElement as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className={`category-card-icon category-icon-${card.accent}`} data-testid={`category-card-${index + 1}-icon`}>
                  <CardIcon size={20} />
                </div>
                <div className="category-card-copy">
                  <span data-testid={`category-card-${index + 1}-meta`}>{card.meta}</span>
                  <h2 data-testid={`category-card-${index + 1}-title`}>{card.title}</h2>
                  <p data-testid={`category-card-${index + 1}-description`}>{card.description}</p>
                </div>
                <ArrowRight className="category-card-arrow" size={18} />
              </>
            );
            return card.workoutSlug ? (
              <Link className="category-card" to={`/workouts/${card.workoutSlug}`} key={card.slug} data-testid={`category-card-${index + 1}`}>
                {content}
              </Link>
            ) : (
              <article className="category-card" key={card.slug} data-testid={`category-card-${index + 1}`}>
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <footer className="category-footer" data-testid="category-footer">
        <Link to="/" data-testid="category-footer-home">BACK TO HOME</Link>
        <span data-testid="category-footer-copy">ATHLENTO / FREE WORKOUTS</span>
      </footer>
    </main>
  );
}

