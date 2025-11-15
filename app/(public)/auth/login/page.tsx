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
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-[#1e3a8a26] lg:grid-cols-[1.1fr_1fr]">
        <div className="relative hidden bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#0f172a] px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#bfdbfe]">MEDIPLAN</p>
            <h2 className="mt-6 text-3xl font-semibold leading-tight">
              La coordination médicale nouvelle génération
            </h2>
            <p className="mt-4 text-sm text-[#dbeafe]">
              Rendez-vous synchronisés, dossiers patients unifiés, ordonnances digitales : tout est prêt pour transformer vos journées de consultation.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4 text-sm">
              <p className="font-semibold text-white">Support réactif 7j/7</p>
              <p className="mt-1 text-[#dbeafe]">Nos experts vous accompagnent lors du déploiement et tout au long de votre utilisation.</p>
            </div>
            <p className="text-xs text-[#dbeafe]">
              Hébergement certifié HDS – Respect intégral du RGPD – Authentification multifacteur disponible.
            </p>
          </div>
        </div>
        <div className="px-8 py-12 sm:px-12">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-[#0f172a]">Connexion</h1>
            <p className="text-sm text-[#475569]">
              Identifiez-vous avec votre adresse professionnelle pour accéder à vos espaces administratifs et médicaux.
            </p>
          </div>
          <form className="mt-10 space-y-6" onSubmit={onSubmit} noValidate>
            <div>
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" type="email" placeholder="vous@mediplan.fr" {...register("email")} />
              {formState.errors.email && (
                <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.email}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="#" className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8]">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input id="password" type="password" placeholder="********" {...register("password")} />
              {formState.errors.password && (
                <p className="mt-1 text-xs text-[#dc2626]">{formState.errors.password}</p>
              )}
            </div>
            {submitError && (
              <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
                {submitError}
              </div>
            )}
            <Button type="submit" className="w-full" loading={isAuthenticating}>
              Accéder à MediPlan
            </Button>
          </form>
          <div className="mt-8 rounded-2xl bg-[#f8fafc] p-6 text-sm text-[#475569]">
            <p className="font-semibold text-[#1f2937]">Vous n’avez pas encore de compte ?</p>
            <p className="mt-2">
              Contactez votre administrateur MediPlan ou écrivez-nous à
              {" "}
              <a href="mailto:contact@mediplan.fr" className="font-semibold text-[#2563eb]">
                contact@mediplan.fr
              </a>
              {" "}
              pour initier la création de votre espace professionnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
