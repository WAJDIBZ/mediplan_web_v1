"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/auth-context";
import { useToast } from "@/components/feedback/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSchema, stringField } from "@/lib/validation";
import { useForm } from "@/hooks/useForm";

const loginSchema = createSchema({
  email: stringField({ required: true, email: true, label: "Adresse e-mail" }),
  password: stringField({ required: true, minLength: 8, label: "Mot de passe" }),
});

export default function LoginPage() {
  const { login, isAuthenticating } = useAuth();
  const { notify } = useToast();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    <main className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_55%,_#eef2ff_100%)] px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-sky-200/40 blur-[110px]" aria-hidden />
        <div className="absolute bottom-[-100px] right-[-40px] h-80 w-80 rounded-full bg-indigo-200/35 blur-[120px]" aria-hidden />
      </div>
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_35px_80px_-40px_rgba(30,64,175,0.55)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#1d4ed8] via-[#1e40af] to-[#0f172a] px-12 py-16 text-white lg:flex">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#bfdbfe]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" aria-hidden />
              MediPlan
            </p>
            <h2 className="text-3xl font-semibold leading-tight">
              La coordination médicale nouvelle génération
            </h2>
            <p className="text-sm text-[#dbeafe]">
              Rendez-vous synchronisés, dossiers patients unifiés et ordonnances digitales pour un cabinet ou une clinique sans friction.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm leading-relaxed">
              <p className="font-semibold text-white">Support réactif 7j/7</p>
              <p className="mt-1 text-[#dbeafe]">Nos experts vous accompagnent lors du déploiement et tout au long de votre utilisation.</p>
            </div>
            <p className="text-xs text-[#bfdbfe]">
              Hébergement certifié HDS — Respect intégral du RGPD — Authentification multifacteur disponible.
            </p>
          </div>
        </div>
        <div className="relative px-8 py-12 sm:px-12">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute right-[-60px] top-16 h-40 w-40 rounded-full bg-sky-200/40 blur-[80px]" aria-hidden />
            <div className="absolute bottom-[-60px] left-[-20px] h-36 w-36 rounded-full bg-emerald-200/35 blur-[90px]" aria-hidden />
          </div>
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">
              Connexion sécurisée
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-[#0f172a]">Accéder à MediPlan</h1>
              <p className="mt-2 text-sm text-[#475569]">
                Identifiez-vous avec votre adresse professionnelle pour rejoindre vos espaces médicaux et administratifs.
              </p>
            </div>
          </div>
          <form className="mt-10 space-y-7" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="vous@mediplan.fr"
                aria-describedby={formState.errors.email ? "email-error" : undefined}
                {...register("email")}
              />
              {formState.errors.email && (
                <p id="email-error" className="mt-1 text-xs text-[#dc2626]">
                  {formState.errors.email}
                </p>
              )}
            </div>
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-[#2563eb] transition hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                aria-describedby={formState.errors.password ? "password-error" : undefined}
                {...register("password")}
              />
              {formState.errors.password && (
                <p id="password-error" className="mt-1 text-xs text-[#dc2626]">
                  {formState.errors.password}
                </p>
              )}
            </div>
            {submitError && (
              <div
                className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]"
                role="alert"
                aria-live="assertive"
              >
                {submitError}
              </div>
            )}
            <Button type="submit" className="w-full" loading={isAuthenticating}>
              Accéder à MediPlan
            </Button>
          </form>
          <div className="mt-10 rounded-2xl border border-slate-100 bg-slate-50/90 p-6 text-sm text-[#475569] shadow-inner shadow-slate-900/5">
            <p className="font-semibold text-[#1f2937]">Vous n’avez pas encore de compte ?</p>
            <p className="mt-2">
              Contactez votre administrateur MediPlan ou écrivez-nous à{" "}
              <a
                href="mailto:contact@mediplan.fr"
                className="font-semibold text-[#2563eb] transition hover:text-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              >
                contact@mediplan.fr
              </a>{" "}
              pour initier la création de votre espace professionnel.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
