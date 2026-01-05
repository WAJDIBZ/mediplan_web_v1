import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import Image from "next/image";

export default function DownloadAppPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl ring-1 ring-white/10"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />

            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 h-24 w-24 overflow-hidden rounded-2xl shadow-lg ring-2 ring-white/10">
                <Image
                  src="/logo.jpg"
                  alt="MediPlan Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mb-3 text-2xl font-bold text-white">Application Mobile</h3>
              <p className="mb-8 text-base text-slate-300 leading-relaxed">
                Portez votre cabinet dans votre poche.<br />
                Disponible pour <span className="text-emerald-400 font-medium">médecins</span> et <span className="text-sky-400 font-medium">patients</span>.
              </p>

              <a
                href="/MediPlan.apk"
                download="MediPlan.apk"
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-8 py-4 text-base font-bold text-white shadow-lg transition active:scale-95 hover:brightness-110"
              >
                <Download size={20} />
                Télécharger l'Application
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
