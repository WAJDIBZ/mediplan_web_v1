"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sora } from "next/font/google";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/components/feedback/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchema, stringField } from "@/lib/validation";
import { useForm } from "@/hooks/useForm";
import { MedTerminalLoader } from "@/components/ui/med-terminal-loader";

const loginSchema = createSchema({
  email: stringField({ required: true, email: true, label: "Adresse e-mail" }),
  password: stringField({ required: true, minLength: 8, label: "Mot de passe" }),
});

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

const heroStats = [
  { value: "98%", label: "Satisfaction praticiens" },
  { value: "4,8/5", label: "Onboarding noté par les équipes" },
  { value: "< 2 min", label: "Pour confirmer un rendez-vous" },
];

const securityBadges = [
  "Authentification forte", 
  "Chiffrement AES-256", 
  "Journalisation continue"
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export default function LoginPage() {
  const { login, isAuthenticating } = useAuth();
  const { notify } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    schema: loginSchema,
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login({ email: values.email || "", password: values.password || "" });
      notify({
        variant: "success",
        title: "Connexion réussie",
        description: "Bienvenue sur MediPlan !",
      });
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
        notify({ variant: "error", title: "Impossible de se connecter", description: error.message });
      } else {
        setSubmitError("Une erreur inattendue est survenue.");
        notify({
          variant: "error",
          title: "Erreur inattendue",
          description: "Merci de réessayer dans quelques instants.",
        });
      }
    }
  });

  return (
    <>
      {isAuthenticating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/95">
          <MedTerminalLoader message="🔐 Vérification des accès..." />
        </div>
      )}
      <main className={`${sora.className} relative flex min-h-screen items-center justify-center bg-[#020617] px-6 py-10 text-slate-100`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-[420px] w-[420px] rounded-full bg-sky-500/30 blur-[180px]" aria-hidden />
        <div className="absolute right-[-15%] top-[30%] h-[520px] w-[520px] rounded-full bg-indigo-600/30 blur-[220px]" aria-hidden />
        <div className="absolute bottom-[-25%] left-[20%] h-[380px] w-[380px] rounded-full bg-emerald-500/25 blur-[200px]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_60%)]" aria-hidden />
      </div>
      <div className="absolute left-0 right-0 top-6 z-20 px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white backdrop-blur-xl">
          <Link href="/" className="font-semibold tracking-tight">
            MediPlan
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20"
          >
            <span aria-hidden>←</span> Retour accueil
          </Link>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid gap-8 rounded-[40px] border border-white/10 bg-white/5 p-4 shadow-[0_60px_140px_-60px_rgba(2,6,23,0.9)] backdrop-blur-2xl lg:grid-cols-2 lg:p-6">
          <motion.section
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-inner shadow-black/20"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute right-[-20%] top-[-10%] h-64 w-64 rounded-full bg-cyan-400/20 blur-[120px]" aria-hidden />
              <div className="absolute bottom-[-15%] left-[-25%] h-80 w-80 rounded-full bg-indigo-400/25 blur-[150px]" aria-hidden />
            </div>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Accès professionnel
            </motion.div>
            <motion.h1 variants={fadeInUp} className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              La coordination médicale nouvelle génération.
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-4 text-sm leading-relaxed text-slate-200">
              Synchronisez agendas, dossiers patients et ordonnances digitales sur une plateforme certifiée et pensée pour les équipes médicales exigeantes.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-200">{stat.label}</p>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-8 rounded-2xl border border-white/15 bg-black/30 p-5 text-sm leading-relaxed">
              <p className="font-semibold text-white">Hébergement certifié HDS</p>
              <p className="mt-1 text-slate-200">
                Conformité RGPD, authentification forte optionnelle, journalisation complète et support dédié 7j/7 pour médecins & administrateurs.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-6 flex flex-wrap gap-3 text-xs text-slate-200">
              {securityBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                  {badge}
                </span>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="relative rounded-[32px] border border-white/20 bg-white p-8 text-slate-900 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.6)] transition hover:shadow-[0_40px_100px_-50px_rgba(15,23,42,0.65)]"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-transparent" aria-hidden />
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-600">
                Accès sécurisé
              </span>
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Connexion à MediPlan</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Identifiez-vous avec vos accès professionnels pour retrouver vos flux médicaux et administratifs.
                </p>
              </div>
            </div>
            <form className="mt-8 space-y-7" onSubmit={onSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@mediplan.fr"
                    aria-describedby={formState.errors.email ? "email-error" : undefined}
                    className="peer pr-3"
                    {...register("email")}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 peer-focus:text-slate-500">@</span>
                </div>
                {formState.errors.email && (
                  <motion.p id="email-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-600">
                    {formState.errors.email}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="#"
                    className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="********"
                    aria-describedby={formState.errors.password ? "password-error" : undefined}
                    className="pr-12"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                  >
                    {showPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
                {formState.errors.password && (
                  <motion.p id="password-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-rose-600">
                    {formState.errors.password}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Se souvenir de moi
                </label>
                <p className="text-xs text-slate-400">Session chiffrée et limitée dans le temps.</p>
              </div>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  aria-live="assertive"
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {submitError}
                </motion.div>
              )}

              <Button type="submit" className="w-full text-base" loading={isAuthenticating}>
                Accéder à MediPlan
              </Button>
            </form>

            <div className="mt-8 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-500">
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {securityBadges.map((badge) => (
                  <span key={badge} className="rounded-full border border-slate-200 px-3 py-1">
                    {badge}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-semibold text-slate-900">Besoin d'un accès ?</p>
                <p className="mt-1">
                  Contactez votre administrateur ou écrivez-nous à {" "}
                  <a href="mailto:contact@mediplan.fr" className="font-semibold text-indigo-600 transition hover:text-indigo-500">
                    contact@mediplan.fr
                  </a>{" "}
                  pour activer votre espace sécurisé.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  </>
  );
}
