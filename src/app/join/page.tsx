"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { verifyInvite } from "../lib/supabase/dto";

export default function JoinPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function handleContinue() {
    const code = inviteCode.trim();

    if (!code) {
      setError("فضلاً أدخل رمز الدعوة.");
      return;
    }

    setError("");
    setChecking(true);

    const result = await verifyInvite(code);

    if (!result.valid) {
      setChecking(false);
      setError(result.message || "رمز الدعوة غير صالح.");
      return;
    }

    setChecking(false);
    router.push(`/register?invite=${encodeURIComponent(code)}`);
  }

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-molim-soft text-molim-foreground"
    >
      {/* الخلفية الهندسية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-16 h-48 w-48 rotate-12 border-2 border-[#ed542f]/10" />

        <div className="absolute left-[-30px] top-72 h-32 w-32 -rotate-12 border border-[#202124]/10" />

        <div
          className="absolute left-8 top-36 h-24 w-24 border border-[#ed542f]/10"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute bottom-24 right-0 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-14 pt-7">

        {/* الهيدر */}
        <header className="flex items-center justify-between border-b border-[#202124]/10 pb-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-[#ed542f] text-xl font-black text-white">
              م
            </div>

            <div>
              <p className="text-[11px] text-molim-muted">
                منصة الفريق
              </p>

              <h1 className="text-lg font-black text-molim-foreground">
                مُلم
              </h1>
            </div>
          </Link>

          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center border border-molim bg-molim-soft text-lg text-molim-muted"
            aria-label="العودة"
          >
            ←
          </Link>
        </header>

        {/* العنوان */}
        <section className="mt-10">
          <p className="text-sm font-bold text-[#ed542f]">
            الانضمام إلى الفريق
          </p>

          <h2 className="mt-2 text-3xl font-black text-molim-foreground">
            أدخل رمز الدعوة
          </h2>

          <p className="mt-3 text-sm leading-7 text-molim-muted">
            أدخل رمز الدعوة الذي حصلت عليه للبدء في إجراءات
            الانضمام إلى فريق مُلم.
          </p>
        </section>

        {/* نموذج الدعوة */}
        <section className="mt-7 border border-molim bg-molim-soft p-5">

          <label
            htmlFor="inviteCode"
            className="mb-2 block text-xs font-black text-molim-foreground"
          >
            رمز الدعوة
          </label>

          <input
            id="inviteCode"
            type="text"
            value={inviteCode}
            onChange={(event) => {
              setInviteCode(event.target.value.toUpperCase());
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleContinue();
              }
            }}
            placeholder="مثال: MOLIM-7K4P9"
            autoComplete="off"
            className="h-14 w-full border border-molim bg-molim-surface px-4 text-center text-sm font-bold tracking-wider text-molim-foreground outline-none transition focus:border-[#ed542f] focus:ring-2 focus:ring-[#ed542f]/10"
          />

          {error && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={checking}
            className="mt-4 h-14 w-full cursor-pointer bg-[#ed542f] text-sm font-black text-white transition hover:bg-[#d94725] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
          >
            {checking ? "جاري التحقق..." : "متابعة"}
          </button>
        </section>

        {/* ملاحظات */}
        <section className="mt-5 space-y-2">
          <div className="border border-molim bg-molim-soft p-4">
            <p className="text-xs font-black text-molim-foreground">
              كيف تعمل الدعوة؟
            </p>

            <p className="mt-2 text-xs leading-6 text-molim-muted">
              رمز الدعوة مخصص للانضمام إلى الفريق، ويُستخدم مرة
              واحدة فقط عند التسجيل.
            </p>
          </div>

          <div className="border-r-4 border-[#ed542f] bg-molim-soft px-4 py-3">
            <p className="text-xs font-black text-molim-foreground">
              ملاحظة
            </p>

            <p className="mt-1 text-xs leading-6 text-molim-muted">
              لا تشارك رمز الدعوة مع أي شخص غير الشخص المخصص له.
            </p>
          </div>
        </section>

        {/* العودة */}
        <Link
          href="/"
          className="mt-7 flex h-14 w-full items-center justify-center border border-molim bg-molim-soft text-sm font-bold text-molim-foreground transition hover:border-[#ed542f]"
        >
          العودة إلى الصفحة الرئيسية
        </Link>

        {/* Footer */}
        <footer className="mt-10 border-t border-molim pt-5 text-center">
          <p className="text-[10px] text-molim-muted">
            مُلم — الانضمام إلى الفريق
          </p>
        </footer>
      </div>
    </main>
  );
}