import "@fontsource-variable/outfit";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono";
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
import { Link, useNavigate } from "react-router-dom";
import { exerciseLibrary as exercises, heroCategories, workoutFilters as filters, workouts as circuits, exerciseVideoMap } from "@/lib/fitnessData";

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
   // audio context muted or blocked
 }
}


type SiteLanguage = "English" | "Français" | "Ελληνικά" | "Русский" | "हिन्दी" | "ગુજરાતી";

interface Translations {
  navWorkouts: string;
  navPrograms: string;
  navChallenges: string;
  navExercises: string;
  headerCta: string;
  workoutOfTheDay: string;
  heroSpecLabel: string;
  heroCopy: string;
  studioEyebrow: string;
  studioHeadingPre: string;
  studioHeadingSpan: string;
  studioDescription: string;
  startWorkout: string;
  questEyebrow: string;
  questHeadingPre: string;
  questHeadingSpan: string;
  questDescription: string;
  questButton: string;
  libraryEyebrow: string;
  libraryHeadingPre: string;
  libraryHeadingSpan: string;
  libraryCountText: string;
  searchPlaceholder: string;
  colExplore: string;
  colLegal: string;
  colSupport: string;
  studioWorkouts: string;
  movementVault: string;
  circuitsPrograms: string;
  dailyQuests: string;
  startQuickSession: string;
  terms: string;
  privacy: string;
  disclaimer: string;
  cookies: string;
  cookiePref: string;
  warmupGuide: string;
  safetyGuide: string;
  contact: string;
  responseTime: string;
  disclaimerTitle: string;
  disclaimerText: string;
  selectLang: string;
  langNote: string;
  allRightsReserved: string;
}

const siteTranslations: Record<SiteLanguage, Translations> = {
  English: {
    navWorkouts: "WORKOUTS",
    navPrograms: "PROGRAMS",
    navChallenges: "CHALLENGES",
    navExercises: "EXERCISES",
    headerCta: "DAILY WORKOUT",
    workoutOfTheDay: "WORKOUT OF THE DAY",
    heroSpecLabel: "FULL BODY / 20 MIN / BEGINNER",
    heroCopy: "Free workouts. Clear plans. A stronger everyday.",
    studioEyebrow: "01 / FIND YOUR FOCUS",
    studioHeadingPre: "WORKOUTS",
    studioHeadingSpan: "FOR YOU.",
    studioDescription: "{t.studioDescription}",
    startWorkout: "START WORKOUT",
    questEyebrow: "03 / FREE PROGRAMS",
    questHeadingPre: "START",
    questHeadingSpan: "SMALL.",
    questDescription: "{t.questDescription}",
    questButton: "EXPLORE PROGRAMS",
    libraryEyebrow: "04 / EXERCISE LIBRARY",
    libraryHeadingPre: "MOVE",
    libraryHeadingSpan: "BETTER.",
    libraryCountText: "EXERCISES TO EXPLORE",
    searchPlaceholder: "Search movement, muscle, code...",
    colExplore: "EXPLORE & WORKOUTS",
    colLegal: "LEGAL & TRUST",
    colSupport: "SUPPORT & COMMUNITY",
    studioWorkouts: "Studio Workouts",
    movementVault: "Movement Vault & Library",
    circuitsPrograms: "Circuits & Programs",
    dailyQuests: "Daily Quests & Challenges",
    startQuickSession: "Start Quick Session →",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    disclaimer: "Health & Fitness Disclaimer",
    cookies: "Website Cookies Policy",
    cookiePref: "Cookie Preferences",
    warmupGuide: "Beginner Warm-Up Guide",
    safetyGuide: "Workout Safety Precautions",
    contact: "Contact & Feedback",
    responseTime: "Response time: < 24 hrs",
    disclaimerTitle: "HEALTH & FITNESS DISCLAIMER:",
    disclaimerText: "The exercises, training routines, and movement demonstrations provided on ATHLENTO are designed solely for educational, instructional, and general fitness purposes. Before beginning this or any exercise program, you should consult your physician or other qualified healthcare professional to determine your physical fitness readiness. Do not perform exercises if you have pre-existing cardiovascular conditions, acute musculoskeletal injuries, or if advised against physical activity by your doctor. You exercise entirely at your own risk and discretion.",
    selectLang: "SELECT LANGUAGE / BROWSE IN:",
    langNote: "Interface set to: English (Global)",
    allRightsReserved: "All rights reserved."
  },
  "Français": {
    navWorkouts: "ENTRAÎNEMENTS",
    navPrograms: "PROGRAMMES",
    navChallenges: "DÉFIS",
    navExercises: "EXERCICES",
    headerCta: "SÉANCE DU JOUR",
    workoutOfTheDay: "ENTRAÎNEMENT DU JOUR",
    heroSpecLabel: "CORPS ENTIER / 20 MIN / DÉBUTANT",
    heroCopy: "Entraînements gratuits. Plans clairs. Plus fort chaque jour.",
    studioEyebrow: "01 / TROUVEZ VOTRE OBJECTIF",
    studioHeadingPre: "SÉANCES",
    studioHeadingSpan: "POUR VOUS.",
    studioDescription: "Choisissez une zone ci-dessous, observez le tempo du mouvement et commencez une séance en quelques secondes.",
    startWorkout: "COMMENCER",
    questEyebrow: "03 / PROGRAMMES GRATUITS",
    questHeadingPre: "COMMENCEZ",
    questHeadingSpan: "PETIT.",
    questDescription: "Créez une habitude avec un plan simple de 30 jours. Avancez jour après jour.",
    questButton: "EXPLORER LES PROGRAMMES",
    libraryEyebrow: "04 / BIBLIOTHÈQUE D'EXERCICES",
    libraryHeadingPre: "BOUGEZ",
    libraryHeadingSpan: "MIEUX.",
    libraryCountText: "EXERCICES À DÉCOUVRIR",
    searchPlaceholder: "Rechercher un mouvement, muscle...",
    colExplore: "EXPLORER & ENTRAÎNEMENTS",
    colLegal: "LÉGAL & CONFIANCE",
    colSupport: "SUPPORT & COMMUNAUTÉ",
    studioWorkouts: "Séances Studio",
    movementVault: "Bibliothèque de mouvements",
    circuitsPrograms: "Circuits & Programmes",
    dailyQuests: "Quêtes & Défis Quotidiens",
    startQuickSession: "Démarrer une session rapide →",
    terms: "Conditions Générales",
    privacy: "Politique de Confidentialité",
    disclaimer: "Avis de Santé & Sécurité",
    cookies: "Politique des Cookies",
    cookiePref: "Préférences des Cookies",
    warmupGuide: "Guide d'échauffement",
    safetyGuide: "Précautions de sécurité",
    contact: "Contact & Avis",
    responseTime: "Délai de réponse : < 24 h",
    disclaimerTitle: "AVIS DE SANTÉ ET SÉCURITÉ :",
    disclaimerText: "Les exercices et routines sur ATHLENTO sont conçus à des fins éducatives et de remise en forme. Veuillez consulter un médecin avant de commencer tout programme. Vous vous entraînez à vos propres risques.",
    selectLang: "CHOISIR LA LANGUE :",
    langNote: "Langue de l'interface : Français",
    allRightsReserved: "Tous droits réservés."
  },
  "Ελληνικά": {
    navWorkouts: "ΠΡΟΠΟΝΗΣΕΙΣ",
    navPrograms: "ΠΡΟΓΡΑΜΜΑΤΑ",
    navChallenges: "ΠΡΟΚΛΗΣΕΙΣ",
    navExercises: "ΑΣΚΗΣΕΙΣ",
    headerCta: "ΚΑΘΗΜΕΡΙΝΗ ΠΡΟΠΟΝΗΣΗ",
    workoutOfTheDay: "ΠΡΟΠΟΝΗΣΗ ΤΗΣ ΗΜΕΡΑΣ",
    heroSpecLabel: "ΟΛΟΚΛΗΡΟ ΣΩΜΑ / 20 ΛΕΠΤΑ / ΑΡΧΑΡΙΟΣ",
    heroCopy: "Δωρεάν προπονήσεις. Σαφή προγράμματα. Πιο δυνατοί κάθε μέρα.",
    studioEyebrow: "01 / ΒΡΕΙΤΕ ΤΟ ΣΤΟΧΟ ΣΑΣ",
    studioHeadingPre: "ΠΡΟΠΟΝΗΣΕΙΣ",
    studioHeadingSpan: "ΓΙΑ ΕΣΑΣ.",
    studioDescription: "Επιλέξτε εστίαση σώματος, δείτε τον ρυθμό κίνησης και ξεκινήστε μια δομημένη προπόνηση σε δευτερόλεπτα.",
    startWorkout: "ΕΝΑΡΞΗ ΠΡΟΠΟΝΗΣΗΣ",
    questEyebrow: "03 / ΔΩΡΕΑΝ ΠΡΟΓΡΑΜΜΑΤΑ",
    questHeadingPre: "ΞΕΚΙΝΗΣΤΕ",
    questHeadingSpan: "ΑΠΛΑ.",
    questDescription: "Χτίστε μια συνήθεια με ένα απλό πλάνο 30 ημερών. Κάντε ένα βήμα τη μέρα.",
    questButton: "ΕΞΕΡΕΥΝΗΣΤΕ ΠΡΟΓΡΑΜΜΑΤΑ",
    libraryEyebrow: "04 / ΒΙΒΛΙΟΘΗΚΗ ΑΣΚΗΣΕΩΝ",
    libraryHeadingPre: "ΚΙΝΗΘΕΙΤΕ",
    libraryHeadingSpan: "ΚΑΛΥΤΕΡΑ.",
    libraryCountText: "ΑΣΚΗΣΕΙΣ ΓΙΑ ΕΞΕΡΕΥΝΗΣΗ",
    searchPlaceholder: "Αναζήτηση άσκησης, μυός...",
    colExplore: "ΕΞΕΡΕΥΝΗΣΗ & ΠΡΟΠΟΝΗΣΕΙΣ",
    colLegal: "ΝΟΜΙΚΑ & ΕΜΠΙΣΤΟΣΥΝΗ",
    colSupport: "ΥΠΟΣΤΗΡΙΞΗ & ΚΟΙΝΟΤΗΤΑ",
    studioWorkouts: "Προπονήσεις Στούντιο",
    movementVault: "Βιβλιοθήκη κινήσεων",
    circuitsPrograms: "Κυκλώματα & Προγράμματα",
    dailyQuests: "Καθημερινές Προκλήσεις",
    startQuickSession: "Γρήγορη Έναρξη →",
    terms: "Όροι & Προϋποθέσεις",
    privacy: "Πολιτική Απορρήτου",
    disclaimer: "Αποποίηση Ευθύνης Υγείας",
    cookies: "Πολιτική Cookies",
    cookiePref: "Προτιμήσεις Cookies",
    warmupGuide: "Οδηγός Προθέρμανσης",
    safetyGuide: "Προφυλάξεις Ασφαλείας",
    contact: "Επικοινωνία & Σχόλια",
    responseTime: "Χρόνος απάντησης: < 24 ώρες",
    disclaimerTitle: "ΑΠΟΠΟΙΗΣΗ ΕΥΘΥΝΗΣ ΥΓΕΙΑΣ & ΑΣΚΗΣΗΣ:",
    disclaimerText: "Οι ασκήσεις στο ATHLENTO προορίζονται για εκπαιδευτικούς σκοπούς. Συμβουλευτείτε το γιατρό σας πριν ξεκινήσετε. Ασκείστε με δική σας ευθύνη.",
    selectLang: "ΕΠΙΛΟΓΗ ΓΛΩΣΣΑΣ:",
    langNote: "Γλώσσα διεπαφής: Ελληνικά",
    allRightsReserved: "Όλα τα δικαιώματα διατηρούνται."
  },
  "Русский": {
    navWorkouts: "ТРЕНИРОВКИ",
    navPrograms: "ПРОГРАММЫ",
    navChallenges: "ВЫЗОВЫ",
    navExercises: "УПРАЖНЕНИЯ",
    headerCta: "ТРЕНИРОВКА ДНЯ",
    workoutOfTheDay: "ТРЕНИРОВКА ДНЯ",
    heroSpecLabel: "ВСЁ ТЕЛО / 20 МИН / ДЛЯ НАЧИНАЮЩИХ",
    heroCopy: "Бесплатные тренировки. Четкие планы. Сильнее каждый день.",
    studioEyebrow: "01 / НАЙДИТЕ СВОЙ ФОКУС",
    studioHeadingPre: "ТРЕНИРОВКИ",
    studioHeadingSpan: "ДЛЯ ВАС.",
    studioDescription: "Выберите целевую зону ниже, оцените темп движений и начните тренировку за считанные секунды.",
    startWorkout: "НАЧАТЬ ТРЕНИРОВКУ",
    questEyebrow: "03 / БЕСПЛАТНЫЕ ПРОГРАММЫ",
    questHeadingPre: "НАЧНИТЕ",
    questHeadingSpan: "С МАЛОГО.",
    questDescription: "Выработайте привычку с простым 30-дневным планом. Двигайтесь день за днем.",
    questButton: "ИЗУЧИТЬ ПРОГРАММЫ",
    libraryEyebrow: "04 / БИБЛИОТЕКА УПРАЖНЕНИЙ",
    libraryHeadingPre: "ДВИГАЙТЕСЬ",
    libraryHeadingSpan: "ЛУЧШЕ.",
    libraryCountText: "УПРАЖНЕНИЙ ДЛЯ ВАС",
    searchPlaceholder: "Поиск упражнения, мышцы...",
    colExplore: "РАЗДЕЛЫ И ТРЕНИРОВКИ",
    colLegal: "ПРАВОВАЯ ИНФОРМАЦИЯ",
    colSupport: "ПОДДЕРЖКА И СООБЩЕСТВО",
    studioWorkouts: "Студийные тренировки",
    movementVault: "База упражнений",
    circuitsPrograms: "Круговые и программы",
    dailyQuests: "Ежедневные вызовы",
    startQuickSession: "Быстрая тренировка →",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    disclaimer: "Отказ от ответственности",
    cookies: "Политика файлов cookie",
    cookiePref: "Настройки файлов cookie",
    warmupGuide: "Разминка для начинающих",
    safetyGuide: "Техника безопасности",
    contact: "Контакты и поддержка",
    responseTime: "Время ответа: < 24 ч",
    disclaimerTitle: "ПРЕДУПРЕЖДЕНИЕ О ЗДОРОВЬЕ И ТРЕНИРОВКАХ:",
    disclaimerText: "Упражнения на ATHLENTO предназначены исключительно для образовательных и оздоровительных целей. Перед началом проконсультируйтесь с врачом. Вы тренируетесь на свой страх и риск.",
    selectLang: "ВЫБЕРИТЕ ЯЗЫК:",
    langNote: "Язык интерфейса: Русский",
    allRightsReserved: "Все права защищены."
  },
  "हिन्दी": {
    navWorkouts: "वर्कआउट्स",
    navPrograms: "प्रोग्राम्स",
    navChallenges: "चुनौतियाँ",
    navExercises: "व्यायाम",
    headerCta: "दैनिक वर्कआउट",
    workoutOfTheDay: "आज का वर्कआउट",
    heroSpecLabel: "फुल बॉडी / 20 मिनट / शुरुआती",
    heroCopy: "मुफ़्त वर्कआउट्स। स्पष्ट योजनाएँ। हर दिन अधिक मज़बूत।",
    studioEyebrow: "01 / अपना फ़ोकस चुनें",
    studioHeadingPre: "वर्कआउट्स",
    studioHeadingSpan: "आपके लिए।",
    studioDescription: "नीचे अपने शरीर का फोकस क्षेत्र चुनें, मूवमेंट की गति देखें और कुछ ही सेकंड में सत्र शुरू करें।",
    startWorkout: "वर्कआउट शुरू करें",
    questEyebrow: "03 / मुफ़्त प्रोग्राम्स",
    questHeadingPre: "शुरुआत",
    questHeadingSpan: "करें।",
    questDescription: "सरल 30-दिवसीय योजना के साथ आदत बनाएं। हर दिन एक कदम आगे बढ़ें और निरंतरता बनाए रखें।",
    questButton: "प्रोग्राम्स देखें",
    libraryEyebrow: "04 / व्यायाम लाइब्रेरी",
    libraryHeadingPre: "बेहतर",
    libraryHeadingSpan: "मूव करें।",
    libraryCountText: "खोजने के लिए व्यायाम",
    searchPlaceholder: "व्यायाम, मांसपेशी, कोड खोजें...",
    colExplore: "एक्सप्लोर व वर्कआउट्स",
    colLegal: "कानूनी व नियम (लीगल)",
    colSupport: "सपोर्ट व कम्युनिटी",
    studioWorkouts: "स्टूडियो वर्कआउट्स",
    movementVault: "मूवमेंट वॉल्ट व लाइब्रेरी",
    circuitsPrograms: "सर्किट्स व प्रोग्राम्स",
    dailyQuests: "दैनिक चुनौतियाँ व क्वैस्ट",
    startQuickSession: "क्विक सत्र शुरू करें →",
    terms: "नियम और शर्तें (Terms)",
    privacy: "गोपनीयता नीति (Privacy)",
    disclaimer: "स्वास्थ्य डिस्क्लेमर",
    cookies: "वेबसाइट कुकीज़ नीति",
    cookiePref: "कुकी प्राथमिकताएँ",
    warmupGuide: "शुरुआती वॉर्म-अप गाइड",
    safetyGuide: "वर्कआउट सुरक्षा सावधानियां",
    contact: "संपर्क व फीडबैक",
    responseTime: "जवाब का समय: 24 घंटे से कम",
    disclaimerTitle: "स्वास्थ्य एवं फ़िटनेस चेतावनी (डिस्क्लेमर):",
    disclaimerText: "ATHLENTO पर दिए गए सभी व्यायाम और वर्कआउट केवल सामान्य फ़िटनेस और मार्गदर्शन के लिए हैं। किसी भी कसरत को शुरू करने से पहले डॉक्टर से परामर्श अवश्य लें। आप अपनी स्वेच्छा और ज़िम्मेदारी पर व्यायाम करते हैं।",
    selectLang: "भाषा चुनें (SELECT LANGUAGE):",
    langNote: "इंटरफ़ेस भाषा: हिन्दी (भारत)",
    allRightsReserved: "सर्वाधिकार सुरक्षित।"
  },
  "ગુજરાતી": {
    navWorkouts: "વર્કઆઉટ્સ",
    navPrograms: "પ્રોગ્રામ્સ",
    navChallenges: "પડકારો",
    navExercises: "કસરતો",
    headerCta: "દૈનિક વર્કઆઉટ",
    workoutOfTheDay: "આજનો વર્કઆઉટ",
    heroSpecLabel: "સંપૂર્ણ શરીર / 20 મિનિટ / શિખાઉ",
    heroCopy: "મફત વર્કઆઉટ્સ. સ્પષ્ટ યોજનાઓ. દરરોજ વધુ મજબૂત.",
    studioEyebrow: "01 / તમારું લક્ષ્ય પસંદ કરો",
    studioHeadingPre: "વર્કઆઉટ્સ",
    studioHeadingSpan: "તમારા માટે.",
    studioDescription: "નીચે તમારા શરીરનો ટાર્ગેટ ઝોન પસંદ કરો, મૂવમેન્ટ જોઈને થોડી જ સેકન્ડોમાં સત્ર શરૂ કરો.",
    startWorkout: "વર્કઆઉટ શરૂ કરો",
    questEyebrow: "03 / મફત કાર્યક્રમો",
    questHeadingPre: "નાની શરૂઆત",
    questHeadingSpan: "કરો.",
    questDescription: "સરળ 30-દિવસીય યોજના સાથે આદત બનાવો. એક-એક દિવસ આગળ વધો અને નિયમિત રહો.",
    questButton: "પ્રોગ્રામ્સ જુઓ",
    libraryEyebrow: "04 / કસરત લાઈબ્રેરી",
    libraryHeadingPre: "વધુ સારું",
    libraryHeadingSpan: "હલનચલન કરો.",
    libraryCountText: "કસરતો ઉપલબ્ધ છે",
    searchPlaceholder: "કસરત, સ્નાયુ કે કોડ શોધો...",
    colExplore: "એક્સપ્લોર અને વર્કઆઉટ્સ",
    colLegal: "કાયદાકીય અને નિયમો (લીગલ)",
    colSupport: "સહાય અને સમુદાય",
    studioWorkouts: "સ્ટુડિયો વર્કઆઉટ્સ",
    movementVault: "મૂવમેન્ટ લાઈબ્રેરી",
    circuitsPrograms: "સર્કિટ્સ અને પ્રોગ્રામ્સ",
    dailyQuests: "દૈનિક પડકારો",
    startQuickSession: "ઝડપી સત્ર શરૂ કરો →",
    terms: "નિયમો અને શરતો (Terms)",
    privacy: "ગોપનીયતા નીતિ (Privacy)",
    disclaimer: "આરોગ્ય ડિસ્ક્લેમર",
    cookies: "વેબસાઇટ કૂકીઝ નીતિ",
    cookiePref: "કૂકી પસંદગીઓ",
    warmupGuide: "વોર્મ-અપ માર્ગદર્શિકા",
    safetyGuide: "સલામતીના નિયમો",
    contact: "સંપર્ક અને પ્રતિસાદ",
    responseTime: "જવાબનો સમય: ૨૪ કલાકથી ઓછો",
    disclaimerTitle: "આરોગ્ય અને ફિટનેસ ડિસ્ક્લેમર (ચેતવણી):",
    disclaimerText: "ATHLENTO પર દર્શાવેલ તમામ કસરતો અને વર્કઆઉટ્સ માત્ર સામાન્ય ફિટનેસ અને માર્ગદર્શન માટે છે. કોઈપણ કસરત શરૂ કરતાં પહેલાં તમારા ડૉક્ટરની સલાહ અવશ્ય લો. તમે પોતાની જવાબદારીથી કસરત કરો છો.",
    selectLang: "ભાષા પસંદ કરો (SELECT LANGUAGE):",
    langNote: "ઇન્ટરફેસ ભાષા: ગુજરાતી (ગુજરાત)",
    allRightsReserved: "સર્વ હક્કો સુરક્ષિત."
  }
};

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<SiteLanguage>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return (localStorage.getItem("athlento_selected_language") as SiteLanguage) || "English";
    }
    return "English";
  });
  const t = siteTranslations[selectedLanguage] || siteTranslations.English;

  const handleLanguageChange = (lang: SiteLanguage) => {
    setSelectedLanguage(lang);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("athlento_selected_language", lang);
    }
  };
  const [activeLegalModal, setActiveLegalModal] = useState<null | "terms" | "privacy" | "disclaimer" | "cookies">(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackUserEmail, setFeedbackUserEmail] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackSubmitted(true);
    const mailSubject = encodeURIComponent("ATHLENTO User Feedback");
    const mailBody = encodeURIComponent(`From: ${feedbackUserEmail || "Anonymous"}\n\nFeedback:\n${feedbackMessage}`);
    window.open(`mailto:creed.athlento@gmail.com?subject=${mailSubject}&body=${mailBody}`, "_blank");
    setTimeout(() => {
      setFeedbackMessage("");
      setFeedbackUserEmail("");
      setFeedbackSubmitted(false);
      setFeedbackOpen(false);
    }, 2800);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard?.writeText("creed.athlento@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };
 const navigate = useNavigate();
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

 useEffect(() => {
   try {
     const saved = window.localStorage.getItem("athlento-daily-streak");
     if (saved) {
       setUserStreak(parseInt(saved, 10) || 1);
     }
   } catch {}
 }, []);

 useEffect(() => {
   if (!sessionOpen || !sessionStarted || sessionCompleted || isTimerPaused) return;

   const interval = setInterval(() => {
     setTimerSeconds((prev) => {
       if (prev <= 1) {
         if (timerPhase === "work") {
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
             return 20;
           }
         } else {
           if (!isMuted) playCountdownTone(1200, 0.25);
           setActiveStep((s) => s + 1);
           setActiveSet((st) => (st + 1) % 3);
           setTimerPhase("work");
           return 40;
         }
       }

       if (prev <= 4 && prev > 1 && !isMuted) {
         playCountdownTone(750, 0.08);
       }

       return prev - 1;
     });
   }, 1000);

   return () => clearInterval(interval);
 }, [sessionOpen, sessionStarted, sessionCompleted, isTimerPaused, timerPhase, activeStep, selectedCircuit, isMuted, userStreak]);

 const getTodaysCircuit = () => {
   const day = new Date().getDay();
   const schedule = [
     "foundation",
     "cyber-ignition",
     "titan-core-300",
     "metabolic-reaper",
     "slowburn",
     "blacksmith",
     "inferno-hiit",
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

 useEffect(() => {
   try {
     const stored = window.localStorage.getItem("athlento-completed-days");
     if (stored) {
       const parsed = JSON.parse(stored);
       if (Array.isArray(parsed)) {
         setCompletedDays(parsed);
       }
     }
   } catch {}
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
         <button onClick={() => navigate("/workouts")} data-testid="nav-studio-button">{t.navWorkouts}</button>
         <button onClick={() => scrollTo("quest")} data-testid="nav-circuits-button">{t.navPrograms}</button>
         <button onClick={() => scrollTo("quest")} data-testid="nav-quest-button">{t.navChallenges}</button>
         <button onClick={() => scrollTo("library")} data-testid="nav-library-button">{t.navExercises}</button>
       </nav>
       <div className="header-actions">
         <Button className="header-cta inline-flex items-center justify-center gap-2 whitespace-nowrap" onClick={() => openSession()} data-testid="header-start-workout-button"><span>{t.headerCta}</span><ArrowRight size={15} className="shrink-0" /></Button>
         <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((value) => !value)} data-testid="mobile-menu-toggle-button" aria-label="Toggle menu">
           {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
       </div>
       {mobileMenuOpen && (
         <div className="mobile-menu" data-testid="mobile-navigation-menu">
           <button onClick={() => { setMobileMenuOpen(false); navigate("/workouts"); }} data-testid="mobile-nav-studio-button">01 / {t.navWorkouts} <ChevronRight size={15} /></button>
           <button onClick={() => scrollTo("quest")} data-testid="mobile-nav-circuits-button">02 / {t.navPrograms} <ChevronRight size={15} /></button>
           <button onClick={() => scrollTo("quest")} data-testid="mobile-nav-quest-button">03 / {t.navChallenges} <ChevronRight size={15} /></button>
           <button onClick={() => scrollTo("library")} data-testid="mobile-nav-library-button">04 / {t.navExercises} <ChevronRight size={15} /></button>
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
           <button className="text-cta" onClick={() => navigate("/workouts")} data-testid="hero-explore-circuits-button">BROWSE WORKOUTS <ArrowRight size={16} /></button>
         </div>
         <div className="hero-proof" data-testid="hero-proof-stats">
           <div><strong data-testid="hero-stat-exercises">50<span>+</span></strong><small data-testid="hero-stat-exercises-label">FREE WORKOUTS</small></div>
           <div><strong data-testid="hero-stat-circuits">05</strong><small data-testid="hero-stat-circuits-label">PROGRAMS</small></div>
           <div><strong data-testid="hero-stat-days">30</strong><small data-testid="hero-stat-days-label">30 DAY CHALLENGE</small></div>
         </div>
       </div>

       <div className="hero-stage-wrap" data-testid="hero-stage-wrap">
         <div className="hero-stage-label label-top" data-testid="hero-stage-mode-label"><Move3d size={14} /> {t.workoutOfTheDay}</div>
         <div className="hero-stage !bg-white overflow-hidden relative" style={{ background: "#ffffff" }} data-testid="hero-stage">
           <video
             className="hero-stage-video w-full h-full object-cover !opacity-100"
             style={{ opacity: 1 }}
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
           <img
             src={heroImage}
             alt="Workout of the day"
             className="hero-stage-fallback w-full h-full object-cover !opacity-100"
             style={{ opacity: 1, filter: "none" }}
             onError={(e) => { e.currentTarget.style.display = "none"; }}
           />
         </div>
         <div className="hero-stage-label label-bottom" data-testid="hero-stage-asset-label"><span className="live-dot" /> {t.heroSpecLabel}</div>
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
         <div><SectionEyebrow testId="studio-eyebrow">{t.studioEyebrow}</SectionEyebrow><h2 data-testid="studio-heading">{t.studioHeadingPre}<br /><span>{t.studioHeadingSpan}</span></h2></div>
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
           <button type="button" onClick={() => scrollTo("library")} className="w-full py-3.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm mt-4" data-testid="studio-open-library-button"><span>BROWSE EXERCISES</span><ArrowRight size={15} /></button>
         </div>
       </div>
     </section>

     <section id="quest" className="page-section quest-section" data-testid="quest-section">
       <div className="quest-copy"><SectionEyebrow testId="quest-eyebrow">{t.questEyebrow}</SectionEyebrow><h2 data-testid="quest-heading">{t.questHeadingPre}<br /><span>{t.questHeadingSpan}</span></h2><p data-testid="quest-description">{t.questDescription}</p><div className="quest-progress" data-testid="quest-progress"><div className="progress-ring"><strong data-testid="quest-progress-number">{String((completedDays || []).length).padStart(2, "0")}</strong><small data-testid="quest-progress-label">/ 30 DAYS</small></div><div><b data-testid="quest-progress-title">{(completedDays || []).length} DAYS COMPLETE</b><span data-testid="quest-progress-copy">Your progress is saved on this device.</span></div></div></div>
       <div className="quest-board panel-surface" data-testid="quest-board"><div className="panel-topline"><span data-testid="quest-board-title">30-DAY PROGRAM / BEGINNER</span><Trophy size={15} /></div><div className="quest-grid" data-testid="quest-day-grid">{Array.from({ length: 30 }, (_, index) => index + 1).map((day) => { const rest = day % 7 === 0; const complete = (completedDays || []).includes(day); return <button className={`day-cell ${complete ? "complete" : ""} ${rest ? "rest" : ""} ${selectedDay === day ? "selected" : ""}`} key={day} onClick={() => { setSelectedDay(day); toggleDay(day); }} data-testid={`quest-day-${day}-button`}><span>{String(day).padStart(2, "0")}</span>{complete && <Check size={12} />}</button>; })}</div><div className="quest-board-detail" data-testid="quest-selected-day-detail"><div><span data-testid="selected-day-label">DAY {String(selectedDay).padStart(2, "0")} / {(completedDays || []).includes(selectedDay) ? "COMPLETED" : selectedDay % 7 === 0 ? "REST DAY" : "WORKOUT"}</span><b data-testid="selected-day-title">{selectedDay % 7 === 0 ? "Stretch & Recover" : "Full Body Basics"}</b></div><span className="xp-pill" data-testid="selected-day-xp">{(completedDays || []).includes(selectedDay) ? "DONE" : selectedDay % 7 === 0 ? "REST" : "START"}</span></div></div>
     </section>

     <section id="library" className="page-section library-section" data-testid="library-section">
       <div className="section-heading-row"><div><SectionEyebrow testId="library-eyebrow">{t.libraryEyebrow}</SectionEyebrow><h2 data-testid="library-heading">{t.libraryHeadingPre}<br /><span>{t.libraryHeadingSpan}</span></h2></div><div className="library-count" data-testid="library-count"><b>50+</b><span>{t.libraryCountText}</span></div></div>
       <div className="video-counter-bar" data-testid="video-counter-bar"><div className="video-counter-summary"><Play size={15} fill="currentColor" /><span data-testid="video-counter-total-label">{videoStats.attached + videoStats.alternates} VIDEO FILES</span></div><div><strong data-testid="video-counter-attached">{videoStats.attached}</strong><span data-testid="video-counter-attached-label">ATTACHED</span></div><div><strong data-testid="video-counter-alternates">{videoStats.alternates}</strong><span data-testid="video-counter-alternates-label">ALTERNATE</span></div><div><strong data-testid="video-counter-pending">{videoStats.pending}</strong><span data-testid="video-counter-pending-label">PENDING</span></div></div>
       <div className="library-toolbar"><div className="search-wrap"><Search size={16} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} data-testid="exercise-search-input" /></div><div className="filter-row" data-testid="exercise-filter-row">{filters.map((filter) => <button className={activeFilter === filter ? "filter-button active" : "filter-button"} key={filter} onClick={() => setActiveFilter(filter)} data-testid={`exercise-filter-${filter.toLowerCase().replace(" ", "-")}-button`}>{filter}</button>)}</div></div>
       <div className="exercise-grid" data-testid="exercise-grid">{filteredExercises.map((exercise) => <article className="exercise-card" key={exercise.id} data-testid={`exercise-card-${exercise.id.toLowerCase()}`}><div className="exercise-preview"><span className="asset-code" data-testid={`${exercise.id.toLowerCase()}-asset-code`}>{exercise.id}_<br />{exercise.name.toUpperCase().replaceAll(" ", "_")}.MP4</span>{exercise.videoUrl ? <VideoThumbnail name={exercise.name} url={exercise.videoUrl} testId={`${exercise.id.toLowerCase()}-video-thumbnail`} /> : <WorkoutPoster circuit={circuits[Number(exercise.id.slice(-2)) % circuits.length]} testId={`${exercise.id.toLowerCase()}-poster`} />}<button onClick={() => exercise.videoUrl ? openVideo(exercise.name, exercise.videoUrl, exercise.alternateVideoUrls) : openSession()} data-testid={`${exercise.id.toLowerCase()}-preview-button`} aria-label={`Preview ${exercise.name}`}><Play size={14} fill="currentColor" /></button></div><div className="exercise-info"><div><h3 data-testid={`${exercise.id.toLowerCase()}-name`}>{exercise.name}</h3><span data-testid={`${exercise.id.toLowerCase()}-group`}>{exercise.group}</span></div><div className="exercise-specs" data-testid={`${exercise.id.toLowerCase()}-specs`}><span>{exercise.reps}</span><span>TEMPO {exercise.tempo}</span></div></div></article>)}{filteredExercises.length === 0 && <div className="empty-library" data-testid="exercise-empty-state">No movements found. Try another signal.</div>}</div>
     </section>

           {/* ================= COMPREHENSIVE ATHLENTO SITE FOOTER ================= */}
      <footer className="site-footer !flex !flex-col !h-auto !items-stretch w-full border-t border-[#d8dcde] bg-[#f8fafc] text-neutral-800 pt-12 pb-28 md:pb-14 px-4 sm:px-6 md:px-12 transition-colors font-sans" data-testid="site-footer">
        <div className="max-w-7xl mx-auto w-full">
          {/* Top Section: 4 Columns with 100% UNIFORM FONT STYLING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-neutral-200">
            {/* Col 1: Brand & Mission */}
            <div className="flex flex-col space-y-4">
              <div className="footer-brand flex items-center">
                <img src="/logo.png" alt="ATHLENTO" className="h-9 w-auto object-contain" />
              </div>
              <p className="text-sm font-semibold text-neutral-900 font-sans" data-testid="footer-copy">{t.heroCopy}</p>
              <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                ATHLENTO is an open, accessible fitness platform engineered to help you move better, build functional strength, and sustain daily longevity with zero paywalls.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  ALL SYSTEMS LIVE
                </span>
              </div>
            </div>

            {/* Col 2: Workouts & Navigation */}
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase font-sans">{t.colExplore}</h4>
              <ul className="space-y-2.5 text-sm text-neutral-600 font-sans">
                <li><button type="button" onClick={() => scrollTo("studio")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">{t.studioWorkouts}</button></li>
                <li><button type="button" onClick={() => scrollTo("library")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">{t.movementVault}</button></li>
                <li><button type="button" onClick={() => navigate("/workouts")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">{t.circuitsPrograms}</button></li>
                <li><button type="button" onClick={() => scrollTo("quest")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">{t.dailyQuests}</button></li>
                <li><button type="button" onClick={() => openSession()} className="hover:text-black transition-colors text-left text-sm font-semibold text-neutral-900 font-sans cursor-pointer">{t.startQuickSession}</button></li>
              </ul>
            </div>

            {/* Col 3: Legal & Trust (Same Font, No Typewriter Monospace) */}
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase font-sans">{t.colLegal}</h4>
              <ul className="space-y-2.5 text-sm text-neutral-600 font-sans">
                <li>
                  <button type="button" onClick={() => setActiveLegalModal("terms")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">
                    {t.terms}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal("privacy")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">
                    {t.privacy}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal("disclaimer")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">
                    {t.disclaimer}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal("cookies")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">
                    {t.cookies}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActiveLegalModal("cookies")} className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer">
                    {t.cookiePref}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Support & Community (With creed.athlento@gmail.com and Feedback Box) */}
            <div className="flex flex-col space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase font-sans">{t.colSupport}</h4>
              <ul className="space-y-2.5 text-sm text-neutral-600 font-sans">
                <li><button type="button" className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer" onClick={() => scrollTo("library")}>{t.warmupGuide}</button></li>
                <li><button type="button" className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans cursor-pointer" onClick={() => setActiveLegalModal("disclaimer")}>{t.safetyGuide}</button></li>
                <li>
                  <button
                    type="button"
                    onClick={() => setFeedbackOpen(true)}
                    className="hover:text-black transition-colors text-left text-sm text-neutral-900 font-semibold font-sans cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{t.contact} (Share Feedback) →</span>
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:creed.athlento@gmail.com"
                    className="hover:text-black transition-colors text-left text-sm text-neutral-600 font-sans flex items-center gap-1.5"
                    title="Send direct email"
                  >
                    <span className="underline underline-offset-2">creed.athlento@gmail.com</span>
                  </a>
                </li>
                <li><span className="text-sm text-neutral-500 font-sans">{t.responseTime}</span></li>
              </ul>
            </div>
          </div>

          {/* Middle Section: Prominent Health & Medical Disclaimer Box */}
          <div className="my-8 p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-950 font-sans">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-amber-700">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 font-sans">{t.disclaimerTitle}</h5>
                <p className="text-xs sm:text-[13px] leading-relaxed text-amber-900/90 font-sans">
                  {t.disclaimerText}
                </p>
              </div>
            </div>
          </div>

          {/* Language Selector Section with instant full-site language change */}
          <div className="my-6 p-4 sm:p-5 rounded-xl border border-neutral-200 bg-white shadow-xs font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-sans">
                  {t.selectLang}
                </span>
                <span className="text-xs text-neutral-500 font-sans font-medium">({selectedLanguage})</span>
              </div>
              
              {/* Language Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { name: "English" as SiteLanguage, code: "EN", label: "English" },
                  { name: "Français" as SiteLanguage, code: "FR", label: "Français" },
                  { name: "Ελληνικά" as SiteLanguage, code: "EL", label: "Ελληνικά" },
                  { name: "Русский" as SiteLanguage, code: "RU", label: "Русский" },
                  { name: "हिन्दी" as SiteLanguage, code: "HI", label: "हिन्दी" },
                  { name: "ગુજરાતી" as SiteLanguage, code: "GU", label: "ગુજરાતી" },
                ].map((lang) => (
                  <button
                    key={lang.name}
                    type="button"
                    onClick={() => handleLanguageChange(lang.name)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border flex items-center gap-1.5 cursor-pointer font-sans ${
                      selectedLanguage === lang.name
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200"
                    }`}
                  >
                    <span className="text-[10px] font-semibold opacity-75">{lang.code}</span>
                    <span>{lang.name}</span>
                    {selectedLanguage === lang.name && (
                      <Check size={12} className="text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Active Language note */}
            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-sans">
              <span>{t.langNote}</span>
              <span className="hidden sm:inline">Multilingual engine active</span>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Legal Links & Asset Note */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span>&copy; {new Date().getFullYear()} ATHLENTO Inc. {t.allRightsReserved}</span>
              <span className="hidden sm:inline text-neutral-300">|</span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => setActiveLegalModal("terms")} className="hover:text-black underline underline-offset-2 cursor-pointer">{t.terms}</button>
                <button type="button" onClick={() => setActiveLegalModal("privacy")} className="hover:text-black underline underline-offset-2 cursor-pointer">{t.privacy}</button>
                <button type="button" onClick={() => setActiveLegalModal("disclaimer")} className="hover:text-black underline underline-offset-2 cursor-pointer">{t.disclaimer}</button>
                <button type="button" onClick={() => setActiveLegalModal("cookies")} className="hover:text-black underline underline-offset-2 cursor-pointer">{t.cookies}</button>
              </div>
            </div>
            <span className="footer-note text-center md:text-right font-sans" data-testid="footer-asset-note">
              EXERCISE LIBRARY / WORKOUTS / PROGRAMS / CHALLENGES
            </span>
          </div>
        </div>
      </footer>

      {/* ================= LEGAL & POLICY MODALS ================= */}
      {activeLegalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLegalModal(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl border border-neutral-300 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                  {activeLegalModal === "terms" && "T&C"}
                  {activeLegalModal === "privacy" && "PRV"}
                  {activeLegalModal === "disclaimer" && "MED"}
                  {activeLegalModal === "cookies" && "CK"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {activeLegalModal === "terms" && "Terms & Conditions"}
                    {activeLegalModal === "privacy" && "Privacy Policy"}
                    {activeLegalModal === "disclaimer" && "Health & Fitness Disclaimer"}
                    {activeLegalModal === "cookies" && "Website Cookies & Tracking"}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">ATHLENTO Legal & Compliance Documentation</p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                onClick={() => setActiveLegalModal(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 overflow-y-auto space-y-4 text-sm text-neutral-700 leading-relaxed">
              {activeLegalModal === "terms" && (
                <>
                  <p className="font-semibold text-neutral-900">Last Updated: January 2026</p>
                  <h4 className="font-bold text-neutral-900">1. Acceptance of Terms</h4>
                  <p>By accessing or using the ATHLENTO platform, workout generator, exercise library, or associated media, you agree to be bound by these Terms and Conditions. If you disagree with any portion, you must discontinue platform use.</p>
                  <h4 className="font-bold text-neutral-900">2. Free Personal Non-Commercial License</h4>
                  <p>ATHLENTO provides workout programs and video movement guidance free of charge solely for your personal athletic conditioning. You may not sell, redistribute, commercially broadcast, or extract platform media assets without explicit written authorization.</p>
                  <h4 className="font-bold text-neutral-900">3. Platform Modifications & Availability</h4>
                  <p>ATHLENTO continuously updates movement libraries, workout tempos, and visual timers. We reserve the right to modify, suspend, or enhance features at any time without liability.</p>
                  <h4 className="font-bold text-neutral-900">4. Limitation of Liability</h4>
                  <p>To the maximum extent permitted by law, ATHLENTO and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the workouts or exercises.</p>
                </>
              )}

              {activeLegalModal === "privacy" && (
                <>
                  <p className="font-semibold text-neutral-900">Last Updated: January 2026</p>
                  <h4 className="font-bold text-neutral-900">1. Data Privacy Commitment</h4>
                  <p>At ATHLENTO, privacy is fundamental. We do not sell your personal data, track your browsing across external websites, or serve third-party advertising trackers.</p>
                  <h4 className="font-bold text-neutral-900">2. Information Stored Locally</h4>
                  <p>Workout progress, selected language preferences, audio volume settings, and exercise filter states are stored directly in your browser's local storage (LocalStorage) on your device. We do not transmit sensitive personal fitness metrics to remote profiling servers.</p>
                  <h4 className="font-bold text-neutral-900">3. Diagnostic Logging</h4>
                  <p>Anonymous technical metrics (such as video load success rates and HTTP error codes) may be collected to resolve playback issues and ensure seamless high-definition streaming.</p>
                  <h4 className="font-bold text-neutral-900">4. Your Control</h4>
                  <p>You can clear your stored workout progress and preferences at any time by clearing your browser cookies and site data.</p>
                </>
              )}

              {activeLegalModal === "disclaimer" && (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium leading-normal">
                    CRITICAL: Please read this physical exercise safety notice carefully prior to starting any workout session.
                  </div>
                  <h4 className="font-bold text-neutral-900">1. Not Medical Advice</h4>
                  <p>The workout routines, strength circuits, mobility demonstrations, and timer intervals displayed on ATHLENTO are intended purely for educational and physical fitness conditioning. They do not constitute medical advice, diagnosis, prescription, or clinical rehabilitation.</p>
                  <h4 className="font-bold text-neutral-900">2. Physician Consultation</h4>
                  <p>Consult a licensed physician before starting any new physical training program, especially if you have high blood pressure, asthma, chest pain, arthritis, diabetes, spinal injuries, or if you are pregnant.</p>
                  <h4 className="font-bold text-neutral-900">3. Assumption of Risk</h4>
                  <p>Participating in resistance and cardiovascular exercises inherently involves physical exertion and risk of musculoskeletal injury. By undertaking any exercises demonstrated on this website, you voluntarily assume all known and unknown risks.</p>
                  <h4 className="font-bold text-neutral-900">4. Stop If You Experience Pain</h4>
                  <p>If at any time during a workout you experience dizziness, sharp pain, faintness, or shortness of breath, cease physical activity immediately and consult emergency medical services.</p>
                </>
              )}

              {activeLegalModal === "cookies" && (
                <>
                  <p className="font-semibold text-neutral-900">Last Updated: January 2026</p>
                  <h4 className="font-bold text-neutral-900">1. What Are Cookies?</h4>
                  <p>Cookies and browser storage are small text tokens retained by your web browser that enable the ATHLENTO application to remember your chosen preferences across visits.</p>
                  <h4 className="font-bold text-neutral-900">2. Essential Cookies Used</h4>
                  <p>We use essential cookies and LocalStorage solely to remember: (a) your chosen display language, (b) workout session volume and mute status, and (c) completed training badges.</p>
                  <h4 className="font-bold text-neutral-900">3. No Advertising Cookies</h4>
                  <p>ATHLENTO does not deploy third-party advertising cookies, marketing tracking beacons, or cross-site data broker trackers.</p>
                  <h4 className="font-bold text-neutral-900">4. How to Manage Cookies</h4>
                  <p>You can manage, restrict, or wipe cookies through your browser settings at any time. Essential features will continue to operate.</p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono">ATHLENTO Legal Document</span>
              <button
                type="button"
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                onClick={() => setActiveLegalModal(null)}
              >
                Close &amp; Understand
              </button>
            </div>
          </div>
        </div>
      )}

     <div className="mobile-bottom-nav" data-testid="mobile-bottom-navigation"><button onClick={() => scrollTo("studio")} data-testid="bottom-nav-studio-button"><Move3d size={17} /><span>STUDIO</span></button><button onClick={() => navigate("/workouts")} data-testid="bottom-nav-circuits-button"><Flame size={17} /><span>WORKOUTS</span></button><button className="bottom-nav-main" onClick={() => openSession()} data-testid="bottom-nav-start-button"><Play size={17} fill="currentColor" /><span>START</span></button><button onClick={() => scrollTo("quest")} data-testid="bottom-nav-quest-button"><Trophy size={17} /><span>QUEST</span></button><button onClick={() => scrollTo("library")} data-testid="bottom-nav-library-button"><Search size={17} /><span>VAULT</span></button></div>

     {/* ================= WORKOUT RUNNER MODAL (STAGE 1 & STAGE 2) ================= */}
     {sessionOpen && (
       <div className="session-backdrop fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 md:backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Workout runner" data-testid="workout-runner-modal">
          <div className="relative w-full h-full md:h-auto md:max-w-4xl max-h-none md:max-h-[92vh] bg-white dark:bg-zinc-950 border-0 md:border border-zinc-300 dark:border-zinc-800 rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-12">
           
           {/* STAGE 1: BRIEFING (PRE-WORKOUT) */}
           {!sessionStarted && !sessionCompleted && (
             <>
               <button
                 type="button"
                 className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                 onClick={() => setSessionOpen(false)}
                 data-testid="workout-runner-close-button"
                 aria-label="Close workout runner"
               >
                 <X size={20} />
               </button>

               {/* LEFT: VERTICAL POSTER & PROTOCOL BRIEFING (md:col-span-5) */}
               <div className="md:col-span-5 relative p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border-b md:border-b-0 md:border-r border-zinc-800 overflow-hidden min-h-0 md:min-h-[440px]">
                 <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                 <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                 <div className="relative z-10 flex items-center justify-between pr-10">
                   <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/60 backdrop-blur">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-zinc-300">
                       DAILY PROTOCOL BRIEFING
                     </span>
                   </div>
                   <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                     NX / {selectedCircuit.id}
                   </span>
                 </div>

                 <div className="relative z-10 my-auto py-4 flex flex-col items-center text-center">
                   {selectedCircuit.posterUrl ? (
                     <div className="w-full max-w-[140px] sm:max-w-[180px] md:max-w-[210px] aspect-[9/16] max-h-[190px] sm:max-h-[240px] md:max-h-[290px] rounded-lg overflow-hidden border border-zinc-700 shadow-xl relative">
                       <img
                         src={selectedCircuit.posterUrl}
                         alt={selectedCircuit.name}
                         className="w-full h-full object-cover"
                         onError={(e) => { e.currentTarget.style.display = "none"; }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                         <span className="text-xs font-mono font-bold text-white tracking-wider">
                           {selectedCircuit.name}
                         </span>
                       </div>
                     </div>
                   ) : (
                     <div className="w-full max-w-[230px] p-5 rounded-lg bg-zinc-900/90 border border-zinc-800 flex flex-col items-center justify-center gap-3">
                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                         <Flame size={32} />
                       </div>
                       <div>
                         <h4 className="font-extrabold text-lg font-heading tracking-tight text-white uppercase">
                           {selectedCircuit.name}
                         </h4>
                         <p className="text-xs text-zinc-400 mt-1">
                           {selectedCircuit.moves} • Level {selectedCircuit.level} • {selectedCircuit.target}
                         </p>
                       </div>
                     </div>
                   )}

                   <div className="grid grid-cols-2 gap-2 w-full mt-4">
                     <div className="px-2.5 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono font-semibold text-zinc-300 flex items-center justify-center gap-1.5">
                       <Check size={12} className="text-emerald-400" />
                       <span>NO EQUIPMENT</span>
                     </div>
                     <div className="px-2.5 py-1.5 rounded bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono font-semibold text-zinc-300 flex items-center justify-center gap-1.5">
                       <Activity size={12} className="text-cyan-400" />
                       <span>AUDIO CUES ON</span>
                     </div>
                   </div>
                 </div>

                 <div className="relative z-10 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-left">
                   <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                     <Sparkles size={13} />
                     <span>COACHING CUE</span>
                   </div>
                   <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                     Maintain controlled breathing and strict tempo throughout every interval.
                   </p>
                 </div>
               </div>

               {/* RIGHT: BRIEFING DETAILS & WORKOUT LIST (md:col-span-7) */}
               <div className="md:col-span-7 p-4 sm:p-6 flex-1 flex flex-col justify-between gap-4 sm:gap-5 bg-white dark:bg-zinc-950 overflow-y-auto">
                 <div className="session-copy">
                   <SectionEyebrow testId="session-eyebrow">LIVE WORKOUT RUNNER</SectionEyebrow>
                   <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-zinc-900 dark:text-white" data-testid="session-heading">
                     {selectedCircuit.name}
                   </h2>
                   <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed" data-testid="session-description">
                     {selectedCircuit.description}
                   </p>

                   <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-zinc-100/80 dark:bg-zinc-900/90 rounded-lg border border-zinc-200 dark:border-zinc-800">
                     <div className="flex flex-col items-center justify-center text-center p-1">
                       <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                         SESSION
                       </span>
                       <b className="font-mono text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight" data-testid="session-time">
                         {selectedCircuit.time}
                       </b>
                     </div>
                     <div className="flex flex-col items-center justify-center text-center p-1 border-x border-zinc-200 dark:border-zinc-800">
                       <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                         SETS
                       </span>
                       <b className="font-mono text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight" data-testid="session-set-count">
                         0{activeSet + 1} / 03
                       </b>
                     </div>
                     <div className="flex flex-col items-center justify-center text-center p-1">
                       <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                         TARGET
                       </span>
                       <b className="font-mono text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight" data-testid="session-target">
                         {selectedCircuit.target}
                       </b>
                     </div>
                   </div>
                 </div>

                 <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 bg-zinc-50/70 dark:bg-zinc-900/50 max-h-48 overflow-y-auto flex flex-col gap-1.5">
                   <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                     Movement Sequence:
                   </span>
                   {selectedCircuit.steps?.map((step, idx) => (
                     <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-0">
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
                   className="primary-cta session-cta w-full py-3.5 bg-black text-white hover:bg-zinc-800 font-bold rounded-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                   onClick={() => setSessionStarted(true)}
                   data-testid="workout-runner-action-button"
                 >
                   START SESSION <ArrowRight size={16} />
                 </Button>
               </div>
             </>
           )}

           {/* STAGE 2: ACTIVE LIVE WORKOUT RUNNER (Vertical Video on Left, Controls on Right) */}
           {sessionStarted && !sessionCompleted && (
             <>
               {/* LEFT: FULL VERTICAL VIDEO (md:col-span-5) */}
               <div className="md:col-span-5 relative w-full h-[48vh] sm:h-[52vh] md:h-full md:min-h-[520px] bg-black overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 shrink-0">
                 {selectedCircuit.steps?.[activeStep]?.videoKey && exerciseVideoMap[selectedCircuit.steps[activeStep].videoKey] ? (
                   <video
                     key={selectedCircuit.steps[activeStep].videoKey}
                     className="h-full w-auto max-w-full object-contain md:object-cover mx-auto"
                      style={{ aspectRatio: "9/16" }}
                     autoPlay
                     loop
                     muted
                     playsInline
                     src={exerciseVideoMap[selectedCircuit.steps[activeStep].videoKey]}
                   />
                 ) : (
                   <div className="flex flex-col items-center justify-center text-zinc-500 p-6 text-center">
                     <Play size={44} className="mb-3 opacity-60 text-white" />
                     <span className="font-mono text-xs uppercase tracking-wider text-white">DEMO PLAYBACK READY</span>
                   </div>
                 )}

                 {/* High-Tech Timer Overlay on Video */}
                 <div className="absolute top-4 right-4 bg-black/85 backdrop-blur border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-xl">
                   <span className={`w-2.5 h-2.5 rounded-full ${timerPhase === "work" ? "bg-red-500 animate-ping" : "bg-cyan-400"}`} />
                   <span className="font-mono font-bold text-white text-lg tracking-tight">
                     00:{String(timerSeconds).padStart(2, "0")}
                   </span>
                   <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
                     {timerPhase === "work" ? "WORK" : "REST"}
                   </span>
                 </div>

                 {/* Phase Banner at bottom-left */}
                 <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-white/15 px-3 py-1.5 rounded-md flex items-center gap-2">
                   {timerPhase === "work" ? <Flame size={14} className="text-amber-400" /> : <TimerReset size={14} className="text-cyan-400" />}
                   <span className="text-[11px] font-mono font-bold uppercase text-white tracking-wider">
                     {timerPhase === "work" ? "ACTIVE WORKOUT" : "REST & HYDRATE"}
                   </span>
                 </div>

                 {/* Video Asset Tag */}
                 <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-2 py-0.5 rounded text-[9px] font-mono text-zinc-400 uppercase">
                   {selectedCircuit.steps?.[activeStep]?.videoKey || "EXERCISE"}.MP4
                 </div>
               </div>

               {/* RIGHT: WORKOUT DETAILS & TELEMETRY CONTROLS (md:col-span-7) */}
               <div className="md:col-span-7 p-4 sm:p-6 flex-1 flex flex-col justify-between gap-3 sm:gap-4 bg-white dark:bg-zinc-950 overflow-y-auto">
                 {/* Top Header */}
                 <div>
                   <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-700 dark:text-zinc-300">
                         MOVE {String(activeStep + 1).padStart(2, "0")} / {String(selectedCircuit.steps?.length || 1).padStart(2, "0")}
                       </span>
                     </div>
                     <div className="flex items-center gap-2">
                       <button
                         type="button"
                         onClick={() => setIsMuted(!isMuted)}
                         className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                         title={isMuted ? "Unmute sound" : "Mute sound"}
                       >
                         {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                       </button>
                       <button
                         type="button"
                         onClick={() => setSessionOpen(false)}
                         className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                         aria-label="Close"
                       >
                         <X size={18} />
                       </button>
                     </div>
                   </div>

                   <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                     <div
                       className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                       style={{
                         width: `${((activeStep + 1) / (selectedCircuit.steps?.length || 1)) * 100}%`,
                       }}
                     />
                   </div>
                 </div>

                 {/* Exercise Title & Details */}
                 <div className="flex flex-col gap-3.5 my-auto">
                   <div className="flex items-start justify-between gap-3">
                     <div>
                       <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest block mb-1">
                         {selectedCircuit.name} • {selectedCircuit.target}
                       </span>
                       <h3 className="text-2xl sm:text-3xl font-heading font-black text-zinc-900 dark:text-white tracking-tight uppercase">
                         {selectedCircuit.steps?.[activeStep]?.exercise || selectedCircuit.name}
                       </h3>
                     </div>
                     <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 whitespace-nowrap">
                       {selectedCircuit.steps?.[activeStep]?.reps || "40 SEC"}
                     </span>
                   </div>

                   {selectedCircuit.steps?.[activeStep]?.modification && (
                     <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                       <strong className="text-zinc-900 dark:text-zinc-200 font-semibold uppercase tracking-wider block text-[10px] mb-0.5">
                         FORM MODIFICATION:
                       </strong>
                       {selectedCircuit.steps[activeStep].modification}
                     </div>
                   )}

                   <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-100/70 dark:bg-zinc-900/60 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center">
                     <div>
                       <small className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">CURRENT SET</small>
                       <b className="font-mono text-sm font-bold text-zinc-900 dark:text-white">0{activeSet + 1} OF 03</b>
                     </div>
                     <div className="border-l border-zinc-200 dark:border-zinc-800">
                       <small className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">TARGET PACE</small>
                       <b className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">STEADY CADENCE</b>
                     </div>
                   </div>

                   {activeStep < (selectedCircuit.steps?.length || 1) - 1 && (
                     <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 px-1">
                       <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">UP NEXT:</span>
                       <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                         {selectedCircuit.steps[activeStep + 1].exercise}
                       </span>
                       <span className="text-[11px] font-mono text-zinc-500">
                         ({selectedCircuit.steps[activeStep + 1].reps})
                       </span>
                     </div>
                   )}
                 </div>

                 {/* Player Controls */}
                 <div>
                   <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                     <button
                       type="button"
                       disabled={activeStep === 0}
                       onClick={() => {
                         setActiveStep((s) => Math.max(0, s - 1));
                         setTimerSeconds(40);
                         setTimerPhase("work");
                       }}
                       className="p-2.5 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-700 dark:text-zinc-300 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
                     >
                       <ChevronLeft size={16} /> PREV
                     </button>

                     <button
                       type="button"
                       onClick={() => setIsTimerPaused(!isTimerPaused)}
                       className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                     >
                       {isTimerPaused ? <Play size={15} fill="currentColor" /> : <Pause size={15} />}
                       {isTimerPaused ? "RESUME" : "PAUSE"}
                     </button>

                     <Button
                       className="primary-cta session-cta px-5 py-2.5 bg-black text-white hover:bg-zinc-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
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

                   <div className="session-live-status text-center text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-3" data-testid="session-live-status">
                     <span className="live-dot inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                     LIVE / MOVE {activeStep + 1} OF {selectedCircuit.steps?.length || 1} / STAY CONSISTENT
                   </div>
                 </div>
               </div>
             </>
           )}

           {/* STAGE 3: VICTORY SCREEN (Full Width) */}
           {sessionCompleted && (
             <div className="col-span-12 p-8 flex flex-col items-center justify-center text-center py-8 gap-4 bg-white dark:bg-zinc-950">
               <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
                 <Trophy size={32} />
               </div>
               <div>
                 <span className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                   MISSION ACCOMPLISHED
                 </span>
                 <h2 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">
                   {selectedCircuit.name} CLEARED!
                 </h2>
                 <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm">
                   Great work! You finished today's protocol with zero excuses. Consistency builds legends.
                 </p>
               </div>

               <div className="grid grid-cols-3 gap-3 w-full max-w-md my-2">
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                   <span className="block text-lg font-black text-zinc-900 dark:text-white">{selectedCircuit.time}</span>
                   <small className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">DURATION</small>
                 </div>
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                   <span className="block text-lg font-black text-zinc-900 dark:text-white">{selectedCircuit.steps?.length || 10}</span>
                   <small className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">MOVES DONE</small>
                 </div>
                 <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                   <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400">🔥 {userStreak} DAYS</span>
                   <small className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">STREAK</small>
                 </div>
               </div>

               <button
                 type="button"
                 onClick={() => setSessionOpen(false)}
                 className="w-full max-w-md py-3.5 bg-black text-white hover:bg-zinc-800 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors mt-2 cursor-pointer shadow-md"
               >
                 COMPLETE & RETURN TO HOME
               </button>
             </div>
           )}
         </div>
       </div>
     )}{selectedVideo && <div className="video-backdrop" role="dialog" aria-modal="true" aria-label={`${selectedVideo.name} video`} data-testid="exercise-video-modal"><div className="video-modal"><button className="modal-close" onClick={() => setSelectedVideo(null)} data-testid="exercise-video-close-button" aria-label="Close exercise video"><X size={19} /></button><SectionEyebrow testId="exercise-video-eyebrow">EXERCISE DEMO / PUBLIC ASSET</SectionEyebrow><h2 data-testid="exercise-video-heading">{selectedVideo.name}</h2>{selectedVideo.urls.length > 1 && <div className="video-source-tabs" data-testid="exercise-video-source-tabs">{selectedVideo.urls.map((url, index) => <button className={selectedVideo.index === index ? "active" : ""} key={url} onClick={() => setSelectedVideo((video) => video ? { ...video, index } : null)} data-testid={`exercise-video-source-${index + 1}-button`}>DEMO {index + 1}</button>)}</div>}<video className="exercise-video-player" controls autoPlay playsInline key={selectedVideo.urls[selectedVideo.index]} src={selectedVideo.urls[selectedVideo.index]} data-testid="exercise-video-player" /><a className="video-open-link" href={selectedVideo.urls[selectedVideo.index]} target="_blank" rel="noreferrer" data-testid="exercise-video-open-link">OPEN VIDEO IN NEW TAB <ArrowRight size={14} /></a></div></div>}

      {/* ================= CONTACT & FEEDBACK MODAL ================= */}
      {feedbackOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans"
          role="dialog"
          aria-modal="true"
          onClick={() => setFeedbackOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-300 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-mono text-xs font-bold">
                  MSG
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 font-sans">Contact &amp; Share Feedback</h3>
                  <p className="text-xs text-neutral-500 font-sans">ATHLENTO Support &amp; Community</p>
                </div>
              </div>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                onClick={() => setFeedbackOpen(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content / Form */}
            <div className="p-6">
              {/* Direct Mail Information Card */}
              <div className="mb-5 p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="p-2 bg-white rounded-lg border border-neutral-200 text-neutral-700 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">Official Mail ID</span>
                    <a
                      href="mailto:creed.athlento@gmail.com"
                      className="text-sm font-semibold text-neutral-900 hover:underline truncate block"
                    >
                      creed.athlento@gmail.com
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedEmail ? "Copied! ✓" : "Copy Mail"}
                </button>
              </div>

              {/* Feedback form */}
              {feedbackSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <h4 className="text-base font-bold text-neutral-900">Feedback Prepared &amp; Sent!</h4>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                    Thank you for sharing your thoughts. Your feedback has been directed to <strong>creed.athlento@gmail.com</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Your Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={feedbackUserEmail}
                      onChange={(e) => setFeedbackUserEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Share Feedback / Type Here *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Type your feedback, feature requests, or workout suggestions here..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-neutral-300 focus:outline-hidden focus:border-neutral-900 transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-neutral-500 font-sans">
                      To: <strong className="text-neutral-700">creed.athlento@gmail.com</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={!feedbackMessage.trim()}
                      className={`px-5 py-2 rounded-lg text-sm font-bold text-white transition-all cursor-pointer flex items-center gap-2 ${
                        feedbackMessage.trim()
                          ? "bg-neutral-900 hover:bg-neutral-800 shadow-sm"
                          : "bg-neutral-300 cursor-not-allowed"
                      }`}
                    >
                      <span>Send Feedback</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

