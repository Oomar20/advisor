"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthSessionCard } from "@/components/auth-session-card";
import type { SessionUser } from "@/lib/auth";

type AuthResponse = {
  user: SessionUser | null;
  message?: string;
};

export function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(input: { name: string; email: string }) {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const payload = (await response.json()) as AuthResponse;

      if (!response.ok || !payload.user) {
        throw new Error(payload.message ?? "تعذر تسجيل الدخول حالياً.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "تعذر تسجيل الدخول حالياً.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5 py-10 text-[#1c1c1c] sm:px-8">
      <div className="w-full max-w-95">
        <AuthSessionCard
          user={null}
          isLoading={false}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onLogin={handleLogin}
          onLogout={async () => {}}
        />
      </div>
    </main>
  );
}
