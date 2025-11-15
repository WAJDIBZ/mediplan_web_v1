"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

const navLinks = [
  { label: "Fonctionnalités", href: "#features" },
  { label: "Médecins", href: "#doctors" },
  { label: "Administrateurs", href: "#admins" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const heroBadges = [
  "+1200 praticiens",
  "Hébergement certifié HDS",
  "Rappels SMS / email intelligents",
];

const kpiStats = [
  { value: "98%", label: "de satisfaction praticiens" },
  { value: "4,8/5", label: "sur l'onboarding" },
  { value: "< 2 min", label: "pour confirmer un RDV" },
  { value: "+30%", label: "de no-shows en moins" },
];

const doctorBenefits = [
  {
    title: "Agenda clair et synchronisé",
    description: "Vue unifiée des consultations présentielles, téléconsultations et blocs opératoires.",
  },
  {
    title: "Dossiers patients centralisés",
    description: "Historique complet, ordonnances, imageries et annotations partagées en un clic.",
  },
  {
    title: "Automatisations intelligentes",
    description: "Rappels multicanaux, relances post-consultation et protocoles personnalisables.",
  },
];

const adminBenefits = [
  {
    title: "Vue globale en temps réel",
    description: "Heatmap des créneaux, monitoring des flux et pilotage multi-sites.",
  },
  {
    title: "Gestion fine des rôles",
    description: "Contrôles d'accès, MFA, audit trail complet et exports réglementaires.",
  },
  {
    title: "Analytics et prévisions",
    description: "Tableaux prêts à l'emploi et projections de charge alimentées par IA.",
  },
];

const featureCards = [
  {
    badge: "Agenda",
    title: "Rendez-vous intelligent",
    description: "Planification adaptative, fuseaux multiples et buffers automatiques.",
    icon: "📅",
  },
  {
    badge: "Disponibilités",
    title: "Gestion des horaires",
    description: "Synchronisation Outlook/Google, remplacement express et règles de congés.",
    icon: "⏱️",
  },
  {
    badge: "Patients",
    title: "Fiches enrichies",
    description: "Données cliniques structurées, uploads sécurisés et prescriptions.",
    icon: "🩺",
  },
  {
    badge: "Insights",
    title: "Statistiques & rapports",
    description: "KPIs en direct, exports CSV/BI et rapports automatiques.",
    icon: "📊",
  },
  {
    badge: "Engagement",
    title: "Rappels automatiques",
    description: "SMS, email, WhatsApp et messages vocaux avec suivi de lecture.",
    icon: "📣",
  },
  {
    badge: "IA",
    title: "Chatbot & copilote",
    description: "Assistant conversationnel pour guider patients et équipes (bientôt).",
    icon: "🤖",
  },
];

const workflowSteps = [
  { title: "Onboard du cabinet", detail: "Diagnostic flash, import sécurisé des données et paramétrage HDS." },
  { title: "Configure tes horaires", detail: "Modèles par praticien, blocs privés et synchronisation multi-calendriers." },
  { title: "Ouvre les créneaux", detail: "Publication omnicanale, priorisation d'actes et rappels automatiques." },
  { title: "Analyse tes stats", detail: "Suivi des performances, projections financières et feedback patient." },
];

const testimonials = [
  {
    name: "Dr. Nadia Lefèvre",
    role: "Cardiologue — Paris",
    quote: "MediPlan a réduit nos absences de 32% et libéré une assistante à temps plein.",
  },
  {
    name: "Clara Bianchi",
    role: "Directrice de clinique — Lyon",
    quote: "Le cockpit administratif et les exports réglementaires nous font gagner des heures chaque semaine.",
  },
  {
    name: "Dr. Karim Benali",
    role: "Chirurgien orthopédiste — Marseille",
    quote: "Je visualise mon carnet opératoire, mes ordonnances et mes suivis sur une seule interface premium.",
  },
];

const faqItems = [
  {
    question: "Vos données sont-elles hébergées en France ?",
    answer: "Oui, l'infrastructure est certifiée HDS et située sur des datacenters français redondés.",
  },
  {
    question: "Comment garantissez-vous la conformité RGPD ?",
    answer: "Chiffrement de bout en bout, contrôle d'accès fin et registre des traitements.",
  },
  {
    question: "Peut-on importer nos historiques ?",
    answer: "Nos équipes assurent l'import sécurisé des patients, documents et modèles d'actes en quelques jours.",
  },
  {
    question: "Quel est le délai d'onboarding ?",
    answer: "La plupart des cabinets sont opérationnels en moins de 10 jours avec formation sur-mesure.",
  },
  {
    question: "Quel support proposez-vous ?",
    answer: "Support premium 7j/7, chat sécurisé, hotline dédiée et Customer Success attitré.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <motion.nav
          initial={false}
          animate={
            scrolled
              ? {
                  backgroundColor: "rgba(1,8,21,0.95)",
                  borderColor: "rgba(148,163,184,0.25)",
                  boxShadow: "0 30px 60px rgba(15,23,42,0.45)",
                }
              : {
                  backgroundColor: "rgba(1,8,21,0.15)",
                  borderColor: "rgba(148,163,184,0)",
                  boxShadow: "0 0 0 rgba(0,0,0,0)",
                }
          }
          className="flex items-center justify-between rounded-3xl border px-5 py-4 text-sm text-slate-200 backdrop-blur-xl transition"
        >
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            MediPlan
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-200 transition hover:text-white">
                {item.label}
              </a>
            ))}
            <Link
              href="/auth/login"
              className="group inline-flex items-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,165,233,0.35)] transition"
            >
              <span>Connexion</span>
              <span className="ml-2 text-base transition group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <button type="button" aria-label="Ouvrir le menu" className="lg:hidden" onClick={() => setOpen((prev) => !prev)}>
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              {[0, 1, 2].map((bar) => (
                <span
                  key={bar}
                  className={`block h-0.5 w-6 rounded-full bg-white transition ${open && bar === 1 ? "opacity-0" : "opacity-100"}`}
                />
              ))}
            </div>
          </button>
        </motion.nav>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#030b1d]/95 px-6 py-6 text-sm text-slate-200 backdrop-blur-xl lg:hidden"
          >
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="py-1 font-medium">
                {item.label}
              </a>
            ))}
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 px-5 py-2 font-semibold text-white"
            >
              Connexion
            </Link>
          </motion.div>
        )}
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <motion.section id="hero" variants={staggerContainer} initial="hidden" animate="visible" className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-8">
        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.35em] text-cyan-200"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> SaaS médical nouvelle génération
        </motion.span>
        <motion.h1 variants={fadeInUp} className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          La plateforme qui orchestre vos rendez-vous médicaux.
        </motion.h1>
        <motion.p variants={fadeInUp} className="max-w-2xl text-lg leading-relaxed text-slate-300">
          MediPlan synchronise agendas, dossiers, rappels automatiques et analytics pour offrir une expérience premium aux équipes médicales et aux patients.
        </motion.p>
        <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/login"
            className="group inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 px-7 py-3 text-base font-semibold text-white shadow-[0_25px_60px_-20px_rgba(14,165,233,0.7)]"
          >
            Se connecter
            <span className="ml-2 text-lg transition group-hover:translate-x-1">↗</span>
          </Link>
          <a href="#pricing" className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-7 py-3 text-base font-semibold text-white">
            Demander une démo
          </a>
        </motion.div>
        <motion.ul variants={fadeInUp} className="flex flex-wrap gap-3 text-sm text-slate-300">
          {heroBadges.map((badge) => (
            <li key={badge} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
              {badge}
            </li>
          ))}
        </motion.ul>
      </div>
      <HeroMockup />
    </motion.section>
  );
}

function HeroMockup() {
  return (
    <motion.div variants={fadeInUp} className="relative rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-2">
      <div className="absolute -inset-16 -z-10 bg-[radial-gradient(circle,_rgba(37,99,235,0.35),_transparent_55%)] blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-white/10 bg-[#050b1f]/90 p-6 shadow-2xl shadow-blue-900/30">
        <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Tableau de bord</p>
              <p className="text-2xl font-semibold text-white">Journée parfaite</p>
            </div>
            <span className="rounded-full bg-emerald-400/20 px-4 py-2 text-sm text-emerald-200">+18% d'efficacité</span>
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
            {["Matinée fluide", "Suivi post-op"].map((label, index) => (
              <div key={label} className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Bloc {index + 1}</p>
                <p className="mt-2 text-lg font-semibold text-white">{label}</p>
                <p className="text-sm text-slate-300">12 rendez-vous confirmés</p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Satisfaction patient</span>
              <span className="text-white">98%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" style={{ width: "98%" }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">No-shows</span>
              <span className="text-white">-30%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-500" style={{ width: "30%" }} />
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
            <Image
              src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
              alt="Dashboard MediPlan"
              width={720}
              height={460}
              className="h-48 w-full rounded-2xl object-cover"
              priority
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function StatsStrip() {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-blue-900/20 sm:grid-cols-2 lg:grid-cols-4"
    >
      {kpiStats.map((stat) => (
        <motion.div key={stat.label} variants={scaleIn} className="rounded-2xl border border-white/10 bg-[#050c1f]/70 p-5 text-center">
          <p className="text-3xl font-semibold text-white">{stat.value}</p>
          <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
        </motion.div>
      ))}
    </motion.section>
  );
}

function DoctorsSection() {
  return (
    <motion.section
      id="doctors"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-10 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent p-8 lg:grid-cols-2"
    >
      <motion.div variants={fadeInUp} className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Pour les médecins</p>
        <h2 className="text-3xl font-semibold text-white">Un cockpit clinique pour des journées sereines.</h2>
        <p className="text-base leading-relaxed text-slate-300">
          Visualisez vos rendez-vous, accédez à vos dossiers enrichis et laissez MediPlan automatiser les tâches répétitives.
        </p>
        <ul className="space-y-4">
          {doctorBenefits.map((item) => (
            <li key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div variants={fadeInUp} className="relative">
        <div className="absolute -inset-6 -z-10 bg-[radial-gradient(circle,_rgba(16,185,129,0.25),_transparent_60%)] blur-3xl" />
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <Image
            src="https://images.pexels.com/photos/5327917/pexels-photo-5327917.jpeg"
            alt="Collaboration médicale"
            width={700}
            height={520}
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </motion.section>
  );
}

function AdminsSection() {
  return (
    <motion.section
      id="admins"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-10 rounded-[32px] border border-white/10 bg-gradient-to-bl from-white/5 via-white/2 to-transparent p-8 lg:grid-cols-2"
    >
      <motion.div variants={fadeInUp} className="relative order-last lg:order-first">
        <div className="absolute -inset-6 -z-10 bg-[radial-gradient(circle,_rgba(99,102,241,0.35),_transparent_60%)] blur-3xl" />
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
          <Image
            src="https://images.pexels.com/photos/6129041/pexels-photo-6129041.jpeg"
            alt="Vue d'administration"
            width={700}
            height={520}
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
      <motion.div variants={fadeInUp} className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-indigo-300">Pour les administrateurs</p>
        <h2 className="text-3xl font-semibold text-white">Pilotez vos équipes et vos sites en un regard.</h2>
        <p className="text-base leading-relaxed text-slate-300">
          Définissez les accès, monitorez la charge et accédez à des rapports réglementaires prêts à l'emploi.
        </p>
        <ul className="space-y-4">
          {adminBenefits.map((item) => (
            <li key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.section>
  );
}

function FeaturesSection() {
  return (
    <motion.section
      id="features"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-10"
    >
      <div className="space-y-4 text-center">
        <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.35em] text-cyan-300">
          Fonctionnalités clés
        </motion.p>
        <motion.h2 variants={fadeInUp} className="text-3xl font-semibold text-white">
          Tout ce qu'il faut pour une expérience médicale premium.
        </motion.h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {featureCards.map((card) => (
          <motion.div
            key={card.title}
            variants={fadeInUp}
            className="group rounded-[26px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.45)] transition hover:-translate-y-1 hover:border-white/30"
          >
            <span className="text-2xl">{card.icon}</span>
            <p className="mt-4 inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
              {card.badge}
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{card.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function WorkflowSection() {
  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="rounded-[32px] border border-white/10 bg-white/5 p-8">
      <motion.h2 variants={fadeInUp} className="text-center text-3xl font-semibold text-white">
        Comment ça marche ?
      </motion.h2>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {workflowSteps.map((step, index) => (
          <motion.div key={step.title} variants={fadeInUp} className="flex gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500/60 to-emerald-400/60 text-lg font-semibold">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{step.title}</p>
              <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function TestimonialsSection() {
  return (
    <motion.section variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-8">
      <motion.h2 variants={fadeInUp} className="text-center text-3xl font-semibold text-white">
        Ils orchestrent déjà leur activité avec MediPlan.
      </motion.h2>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <motion.figure
            key={testimonial.name}
            variants={fadeInUp}
            className="rounded-[26px] border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/0 p-6 text-sm text-slate-200"
          >
            <p className="text-base text-slate-100">“{testimonial.quote}”</p>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-400">
              {testimonial.name} · {testimonial.role}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}

function PricingSection() {
  return (
    <motion.section
      id="pricing"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-[32px] border border-white/10 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-sky-900/40 p-8 text-center"
    >
      <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.35em] text-cyan-300">
        Tarifs
      </motion.p>
      <motion.h2 variants={fadeInUp} className="mt-4 text-3xl font-semibold text-white">
        Tarification adaptée à votre cabinet.
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-4 text-base text-slate-300">
        Plans sur-mesure selon la taille de l'établissement, démarrage possible en pilote sécurisé avec suivi dédié.
      </motion.p>
      <motion.div variants={fadeInUp} className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <a href="mailto:contact@mediplan.fr" className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white">
          Parler à un expert
        </a>
        <Link
          href="/auth/login"
          className="group inline-flex items-center rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-900"
        >
          Se connecter
          <span className="ml-2 transition group-hover:translate-x-1">↗</span>
        </Link>
      </motion.div>
    </motion.section>
  );
}

function FaqSection() {
  return (
    <motion.section id="faq" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-6">
      <motion.h2 variants={fadeInUp} className="text-center text-3xl font-semibold text-white">
        Questions fréquentes.
      </motion.h2>
      <div className="grid gap-4 md:grid-cols-2">
        {faqItems.map((item) => (
          <motion.div key={item.question} variants={fadeInUp} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">{item.question}</p>
            <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function FinalCtaSection() {
  return (
    <motion.section
      id="contact"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-[32px] border border-white/10 bg-gradient-to-br from-sky-500/20 via-indigo-500/10 to-emerald-400/10 p-10 text-center"
    >
      <motion.h2 variants={fadeInUp} className="text-3xl font-semibold text-white">
        Prêt à fluidifier vos journées de consultation ?
      </motion.h2>
      <motion.p variants={fadeInUp} className="mt-4 text-base text-slate-100">
        Connectez-vous pour découvrir vos tableaux de bord personnalisés ou échangez avec nos experts pour un pilote express.
      </motion.p>
      <motion.div variants={fadeInUp} className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/auth/login" className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-base font-semibold text-slate-900">
          Se connecter
        </Link>
        <a href="mailto:contact@mediplan.fr" className="rounded-2xl border border-white/30 px-8 py-3 text-base font-semibold text-white">
          Parler à un expert
        </a>
      </motion.div>
    </motion.section>
  );
}

function Footer() {
  return (
    <footer className="relative mt-16 border-t border-white/5 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-base font-semibold text-white">MediPlan</p>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">HDS · RGPD · 2025</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="transition hover:text-white">
            Mentions légales
          </a>
          <a href="#" className="transition hover:text-white">
            Politique de confidentialité
          </a>
          <a href="mailto:contact@mediplan.fr" className="transition hover:text-white">
            contact@mediplan.fr
          </a>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} MediPlan. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className={sora.className}>
      <main className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-100">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-[-20%] mx-auto h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-[180px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[420px] w-[420px] rounded-full bg-indigo-600/30 blur-[180px]" />
          <div className="absolute bottom-[-20%] right-[-5%] h-[460px] w-[460px] rounded-full bg-emerald-500/20 blur-[220px]" />
        </div>
        <Navbar />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 pt-32 sm:pt-36 lg:gap-24">
          <HeroSection />
          <StatsStrip />
          <DoctorsSection />
          <AdminsSection />
          <FeaturesSection />
          <WorkflowSection />
          <TestimonialsSection />
          <PricingSection />
          <FaqSection />
          <FinalCtaSection />
        </div>
        <Footer />
      </main>
    </div>
  );
}
