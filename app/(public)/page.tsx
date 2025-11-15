import Link from "next/link";

const featuresMedecins = [
  {
    title: "Agenda intelligent",
    description: "Synchronisation instantanée de vos consultations, téléconsultations et disponibilités partagées.",
  },
  {
    title: "Suivi patient enrichi",
    description: "Historique unifié, documents sécurisés et alertes de suivi personnalisées.",
  },
  {
    title: "Ordonnances digitales",
    description: "Création rapide, modèles favoris et envoi sécurisé aux patients et pharmaciens partenaires.",
  },
];

const featuresAdmin = [
  {
    title: "Vision 360° des équipes",
    description: "Tableaux de bord dynamiques, contrôle des accès et pilotage des performances en temps réel.",
  },
  {
    title: "Gestion simplifiée des comptes",
    description: "Création, activation et suivi des rôles en quelques clics, avec historique des actions.",
  },
  {
    title: "Conformité et sécurité",
    description: "Traçabilité complète, export réglementaire et chiffrement de bout en bout.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#e0f2fe] via-white to-[#eef2ff]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-[120px]" aria-hidden />
        <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-[120px]" aria-hidden />
      </div>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-24 px-6 py-16 sm:py-24 lg:gap-32">
        <header className="animate-in-up relative rounded-[36px] border border-white/60 bg-white/80 p-10 shadow-xl shadow-sky-900/10 backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[36px]">
            <div className="absolute -left-12 top-12 h-40 w-40 rounded-full bg-sky-300/20 blur-[90px]" aria-hidden />
            <div className="absolute bottom-[-60px] right-[-40px] h-48 w-48 rounded-full bg-indigo-300/15 blur-[80px]" aria-hidden />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.09),_transparent_60%)]" aria-hidden />
          </div>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/60 bg-sky-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600 shadow-inner shadow-sky-900/5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden />
                MÉDIPlan
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a] sm:text-5xl">
                La plateforme médicale intégrée pour un parcours patient irréprochable
              </h1>
              <p className="text-lg leading-relaxed text-[#475569]">
                Orchestration des rendez-vous, dossier patient unifié, prescriptions digitales et pilotage analytique : MediPlan sécurise vos échanges et libère du temps médical.
              </p>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(37,99,235,0.6)] transition hover:shadow-[0_26px_60px_-24px_rgba(37,99,235,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                  Se connecter
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white/70 px-7 py-3 text-sm font-semibold text-sky-600 shadow-sm shadow-sky-900/5 transition hover:border-sky-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                  Demander une démonstration
                </Link>
              </div>
              <dl className="grid gap-4 rounded-3xl border border-sky-100/80 bg-white/80 p-6 shadow-inner shadow-sky-900/5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-500">Adoption accélérée</dt>
                  <dd className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-semibold text-slate-900">95%</span>
                    <span className="text-sm text-slate-500">des équipes réduisent leurs tâches administratives dès le 1<sup>er</sup> mois.</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">Rendez-vous confirmés</dt>
                  <dd className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-semibold text-slate-900">+40%</span>
                    <span className="text-sm text-slate-500">grâce aux rappels automatisés et aux disponibilités partagées en temps réel.</span>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="relative hidden h-full rounded-[32px] border border-slate-100/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 lg:block">
              <div className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full bg-sky-200/40 blur-[80px]" aria-hidden />
              <div className="pointer-events-none absolute -right-12 bottom-6 h-16 w-16 rounded-full bg-indigo-200/40 blur-[60px]" aria-hidden />
              <div className="relative space-y-6">
                <h2 className="text-lg font-semibold text-slate-900">Expérience MediPlan</h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Un environnement unifié pour suivre les patients, orchestrer les équipes pluridisciplinaires et sécuriser chaque décision médicale.
                </p>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="mt-1 text-base" aria-hidden>🌟</span>
                    <span>Accès sécurisé par rôle, authentification multi-facteur et journaux d’audit complets.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 text-base" aria-hidden>⚡</span>
                    <span>Synchronisation temps réel entre calendrier, dossiers cliniques et notifications automatisées.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 text-base" aria-hidden>🛡️</span>
                    <span>Hébergement certifié HDS, conformité RGPD et sauvegarde chiffrée sans compromis.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" aria-labelledby="solutions-title">
          <header className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-lg shadow-sky-900/10 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Solutions modulaires</p>
            <h2 id="solutions-title" className="text-2xl font-semibold text-slate-900">
              Des parcours conçus pour les médecins et les directions de cliniques
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Chaque module MediPlan s’active selon vos besoins : agenda intelligent, suivi patient enrichi, ordonnances digitales et analytics avancés.
            </p>
          </header>
          <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-lg shadow-sky-900/10 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Engagement patient</p>
            <p className="mt-4 text-sm text-slate-600">
              Notifications omnicanales, rappel SMS, portail patient (bientôt) et indicateurs de satisfaction prêts à l’emploi.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">Intégrations</p>
            <p className="mt-2 text-sm text-slate-600">Synchro calendrier externe, exports comptables, connecteurs SIH/HL7 sur demande.</p>
          </div>
        </section>

        <section className="grid gap-12 lg:grid-cols-2" aria-labelledby="medecins-title">
          <article className="rounded-3xl border border-white/60 bg-white/80 p-10 shadow-lg shadow-sky-900/10 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Pour les médecins</p>
            <h2 id="medecins-title" className="mt-4 text-2xl font-semibold text-slate-900">
              Un cockpit clinique pour des consultations sereines
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Visualisez vos rendez-vous, accédez au dossier patient complet et générez vos ordonnances digitalisées en quelques secondes.
            </p>
            <ul className="mt-8 space-y-5">
              {featuresMedecins.map((feature) => (
                <li key={feature.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 shadow-inner shadow-slate-900/5">
                  <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/60 bg-white/80 p-10 shadow-lg shadow-sky-900/10 backdrop-blur" aria-labelledby="admin-title">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Pour l’administration</p>
            <h2 id="admin-title" className="mt-4 text-2xl font-semibold text-slate-900">
              Pilotez vos équipes et garantissez l’excellence opérationnelle
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Contrôlez l’activité de l’établissement, créez des comptes en masse, attribuez les rôles et exportez vos indicateurs qualité et financiers.
            </p>
            <ul className="mt-8 space-y-5">
              {featuresAdmin.map((feature) => (
                <li key={feature.title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 shadow-inner shadow-slate-900/5">
                  <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-10 rounded-3xl border border-white/70 bg-white/80 p-10 shadow-xl shadow-sky-900/10 backdrop-blur" id="contact" aria-labelledby="contact-title">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">Accompagnement dédié</p>
              <h2 id="contact-title" className="mt-4 text-2xl font-semibold text-slate-900">
                Déployez MediPlan sereinement avec une équipe experte
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Onboarding personnalisé, migration sécurisée, sessions de formation ciblées et support prioritaire : nous transformons votre transition numérique en succès opérationnel.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-400">Support 7j/7</p>
                  <p className="mt-2 font-semibold text-slate-900">Chat sécurisé & hotline dédiée</p>
                  <p className="mt-2 text-xs text-slate-500">Réponse en moins d’une heure en semaine.</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-slate-600">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">Migration guidée</p>
                  <p className="mt-2 font-semibold text-slate-900">Audit, import et vérification qualité</p>
                  <p className="mt-2 text-xs text-slate-500">Déploiement possible en moins de 10 jours.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50/90 p-8 text-sm text-slate-600 shadow-inner shadow-slate-900/5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact commercial</p>
              <p className="mt-3 text-lg font-semibold text-slate-900">Discutons de votre transformation</p>
              <p className="mt-4">Par téléphone : <a className="font-semibold text-sky-600" href="tel:+33184260000">+33 1 84 26 00 00</a></p>
              <p className="mt-2">Par e-mail : <a className="font-semibold text-sky-600" href="mailto:contact@mediplan.fr">contact@mediplan.fr</a></p>
              <p className="mt-4 text-xs text-slate-500">Réponse sous 24h ouvrées. Sessions de découverte disponibles chaque semaine.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
