"use client";

import { type FormEvent, useState } from "react";

import type { SessionUser } from "@/lib/auth";

type AuthSessionCardProps = {
  user: SessionUser | null;
  isLoading: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onLogin: (input: { name: string; email: string }) => Promise<void>;
  onLogout: () => Promise<void>;
};

export function AuthSessionCard({
  user,
  isLoading,
  isSubmitting,
  errorMessage,
  onLogin,
  onLogout,
}: AuthSessionCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onLogin({
      name,
      email,
    });
  }

  if (isLoading) {
    return (
      <article className="rounded-xl bg-[#f7f7f7] p-6 text-right" dir="rtl">
        <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">
          التحقق من الجلسة
        </h2>
        <p className="mt-2 text-[14px] font-medium leading-7 text-[#667085]">
          جاري التحقق من حالة تسجيل الدخول قبل إتمام الحجز.
        </p>
      </article>
    );
  }

  if (user) {
    return (
      <article className="rounded-[12px] bg-[#f7f7f7] p-6 text-right" dir="rtl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">
              تم تسجيل الدخول
            </h2>
            <p className="mt-2 text-[14px] font-medium leading-7 text-[#344054]">
              يمكنك الآن تأكيد حجز الجلسة باسم {user.name}.
            </p>
            <p
              className="mt-1 text-[13px] font-medium text-[#667085]"
              dir="ltr"
            >
              {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void onLogout()}
            disabled={isSubmitting}
            className="h-11 rounded-[10px] border border-[#d0d5dd] px-5 text-[14px] font-semibold text-[#344054] transition-colors hover:border-[#98a2b3] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>

        {errorMessage ? (
          <p className="mt-4 text-[13px] font-medium text-[#b42318]">
            {errorMessage}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <article className="rounded-[12px] bg-[#f7f7f7] p-6 text-right" dir="rtl">
      <h2 className="text-[18px] font-extrabold leading-normal text-[#242431]">
        تسجيل الدخول للحجز
      </h2>
      <p className="mt-2 text-[14px] font-medium leading-7 text-[#344054]">
        أدخل اسمك وبريدك الإلكتروني لتفعيل جلسة المستخدم وحماية الحجز.
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">
            الاسم
          </span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="الاسم الكامل"
            className="h-11 w-full rounded-[10px] border border-[#d0d5dd] bg-white px-4 text-[14px] text-[#1c1c1c] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#0a66d2]"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] font-semibold text-[#344054]">
            البريد الإلكتروني
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="h-11 w-full rounded-[10px] border border-[#d0d5dd] bg-white px-4 text-[14px] text-[#1c1c1c] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#0a66d2]"
            autoComplete="email"
            dir="ltr"
            required
            maxLength={120}
          />
        </label>

        {errorMessage ? (
          <p className="text-[13px] font-medium text-[#b42318]">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[49px] w-full items-center justify-center rounded-[10px] bg-[#0a66d2] px-[14px] py-2 text-[14px] font-extrabold text-white transition-colors hover:bg-[#095ab8] disabled:cursor-not-allowed disabled:bg-[#8eb7e9]"
        >
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول والمتابعة"}
        </button>
      </form>
    </article>
  );
}
