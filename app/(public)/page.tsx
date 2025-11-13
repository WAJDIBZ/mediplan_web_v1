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
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#e0f2fe] via-white to-[#eef2ff]" aria-hidden />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-24 px-6 py-16 sm:py-24 lg:gap-32">
        <header className="flex flex-col items-center gap-12 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#2563eb] shadow-sm">
              MÉDECINE AUGMENTÉE
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#0f172a] sm:text-5xl">
              MediPlan, la plateforme qui harmonise vos soins et votre organisation
            </h1>
            <p className="text-lg text-[#475569]">
              Centralisez les rendez-vous, sécurisez les échanges médicaux et offrez un parcours patient fluide. Une interface premium pensée pour les médecins, les directions de cliniques et les groupes de santé exigeants.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_-20px_rgba(37,99,235,0.7)] transition hover:bg-[#1d4ed8]"
              >
                Se connecter
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl border border-[#2563eb] px-6 py-3 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#e0f2fe]"
              >
                Demander une démonstration
              </Link>
            </div>
            <div className="grid gap-6 rounded-3xl bg-white/70 p-6 text-left shadow-lg shadow-[#1e3a8a14] backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]/10 text-lg">95%</div>
                <p className="text-sm text-[#475569]">
                  de nos utilisateurs constatent une réduction des tâches administratives dès le premier mois.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e]/10 text-lg">+40%</div>
                <p className="text-sm text-[#475569]">
                  de rendez-vous confirmés grâce aux rappels automatisés et à la vue calendrier collaborative.
                </p>
              </div>
            </div>
          </div>
          <div className="relative hidden w-full max-w-md rounded-[32px] border border-[#dbeafe] bg-white p-8 shadow-xl lg:block">
            <div className="absolute -left-10 top-8 hidden h-24 w-24 rounded-full bg-[#bfdbfe] opacity-60 lg:block" aria-hidden />
            <div className="absolute -right-8 bottom-6 hidden h-16 w-16 rounded-full bg-[#bae6fd] opacity-70 lg:block" aria-hidden />
            <div className="relative space-y-6">
              <h2 className="text-lg font-semibold text-[#1f2937]">Expérience MediPlan</h2>
              <p className="text-sm leading-relaxed text-[#64748b]">
                Tableau de bord unifié, suivi patient détaillé, ordonnances digitales et export analytique : tout est pensé pour orchestrer vos soins et piloter votre établissement avec précision.
              </p>
              <ul className="space-y-4 text-left text-sm text-[#475569]">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-base">🌟</span>
                  <span>Accès sécurisé par rôle avec double authentification et journalisation complète.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-base">⚡</span>
                  <span>Synchronisation en temps réel entre le calendrier, les dossiers et les notifications patients.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-base">🛡️</span>
                  <span>Hébergement certifié HDS, conformité RGPD et sauvegardes automatiques chiffrées.</span>
                </li>
              </ul>
            </div>
          </div>
        </header>

        <section className="grid gap-16 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-10 shadow-lg shadow-[#1e3a8a14]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2563eb]">POUR LES MÉDECINS</p>
            <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">Un cockpit clinique pour des consultations sereines</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#475569]">
              Visualisez vos rendez-vous par journée, semaine ou mois, accédez au dossier patient complet en un clic et générez vos ordonnances digitalisées avec signatures sécurisées.
            </p>
            <ul className="mt-8 space-y-5">
              {featuresMedecins.map((feature) => (
                <li key={feature.title} className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                  <h3 className="text-base font-semibold text-[#1f2937]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#64748b]">{feature.description}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-lg shadow-[#1e3a8a14]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0ea5e9]">POUR L’ADMINISTRATION</p>
            <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">Pilotez vos équipes et garantissez l’excellence opérationnelle</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#475569]">
              Contrôlez l’activité de l’établissement, créez des comptes en masse, attribuez les rôles, exportez vos indicateurs financiers et qualité en un instant.
            </p>
            <ul className="mt-8 space-y-5">
              {featuresAdmin.map((feature) => (
                <li key={feature.title} className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
                  <h3 className="text-base font-semibold text-[#1f2937]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-[#64748b]">{feature.description}</p>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-3xl bg-white/90 p-10 shadow-lg shadow-[#1e3a8a14] backdrop-blur" id="contact">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2563eb]">ACCOMPAGNEMENT DÉDIÉ</p>
              <h2 className="mt-4 text-2xl font-semibold text-[#0f172a]">Une équipe experte pour déployer MediPlan dans votre structure</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                Onboarding personnalisé, migration sécurisée de vos données, sessions de formation et support prioritaire : nous faisons de la transition numérique un levier de performance.
              </p>
            </div>
            <div className="rounded-2xl border border-[#cbd5f5] bg-[#f8fafc] p-6 text-sm text-[#475569]">
              <p className="font-semibold text-[#1f2937]">Contact commercial</p>
              <p className="mt-2">Par téléphone : <a className="font-semibold text-[#2563eb]" href="tel:+33184260000">+33 1 84 26 00 00</a></p>
              <p className="mt-2">Par e-mail : <a className="font-semibold text-[#2563eb]" href="mailto:contact@mediplan.fr">contact@mediplan.fr</a></p>
              <p className="mt-3 text-xs text-[#94a3b8]">
                Réponse sous 24h ouvrées. Déploiement possible en moins de 10 jours selon votre taille d’organisation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
