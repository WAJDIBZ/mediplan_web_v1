import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-white to-[#e0e7ff]">{children}</div>;
}
