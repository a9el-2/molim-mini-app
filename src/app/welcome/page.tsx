"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUser, statusToArabic } from "../lib/supabase/dto";
import type { UserDTO } from "../lib/supabase/dto";
import { ROLE_NAMES } from "../lib/roles";
import type { UserRole } from "../lib/roles";

export default function WelcomePage() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [userId] = useState(() => {
    if (typeof window === "undefined") return "MOL-00002";
    return new URLSearchParams(window.location.search).get("id") ?? "MOL-00002";
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchUser(userId).then((fetched) => {
      if (fetched) {
        setUser(fetched);
      }
      setLoaded(true);
    });
  }, [userId]);

  const roleName =
    user && user.role in ROLE_NAMES
      ? ROLE_NAMES[user.role as UserRole]
      : "متطوع";

  const statusLabel = user
    ? statusToArabic(user.status)
    : "بانتظار اعتماد القسم";

  const departmentLabel = user
    ? user.department === "غير محدد"
      ? "سيتم تحديده من الإدارة والموارد البشرية"
      : user.department
    : "سيتم تحديده من الإدارة والموارد البشرية";

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-molim-soft text-molim-foreground"
    >
      {/* الخلفية الهندسية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-16 h-48 w-48 rotate-12 border-2 border-[#ed542f]/10" />

        <div className="absolute -left-10 top-72 h-36 w-36 -rotate-12 border border-[#202124]/10" />

        <div
          className="absolute left-8 top-36 h-24 w-24 border border-[#ed542f]/10"
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-28 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />

        <div className="absolute bottom-10 left-16 h-20 w-20 rotate-45 border border-[#202124]/10" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-5 py-7">
        {/* الشعار */}
        <header className="flex items-center gap-3 border-b border-[#202124]/10 pb-4">
          <div className="flex h-11 w-11 items-center justify-center bg-[#ed542f] text-xl font-black text-white">
            م
          </div>

          <div>
            <p className="text-[11px] text-molim-muted">منصة الفريق</p>

            <h1 className="text-lg font-black text-molim-foreground">
              مُلم
            </h1>
          </div>
        </header>

        {/* المحتوى الرئيسي */}
        <section className="my-auto py-12">
          <div className="flex h-20 w-20 items-center justify-center bg-[#ed542f]/10 text-4xl">
            ✓
          </div>

          <p className="mt-7 text-sm font-bold text-[#ed542f]">
            تم إكمال التسجيل
          </p>

          <h2 className="mt-2 text-4xl font-black leading-tight text-molim-foreground">
            حياك الله رسميًا
            <br />
            في فريق مُلم 🎉
          </h2>

          <p className="mt-4 text-sm leading-7 text-molim-muted">
            اكتملت خطوات تسجيلك بنجاح، وسُجلت موافقتك على اتفاقية
            التطوع. أهلًا بك بيننا، ونتمنى أن تكون رحلتك مع مُلم
            مليئة بالإنجاز والأثر الجميل.
          </p>

          {/* بيانات الحساب */}
          <div className="mt-8 space-y-2">
            <InfoRow
              label="Molim ID"
              value={user ? user.id : userId}
            />

            <InfoRow
              label="الرتبة"
              value={loaded && user ? roleName : "متطوع"}
            />

            <InfoRow
              label="القسم"
              value={departmentLabel}
            />

            <InfoRow
              label="الساعات المعتمدة"
              value="0 ساعة"
            />

            <InfoRow
              label="حالة الحساب"
              value={statusLabel}
            />
          </div>

          {/* التنبيه */}
          <div className="mt-6 border border-[#ed542f]/20 bg-[#ed542f]/5 p-4">
            <p className="text-xs font-black text-molim-foreground">
              📢 ماذا يحدث الآن؟
            </p>

            <p className="mt-2 text-xs leading-6 text-molim-muted">
              ستقوم الإدارة أو الموارد البشرية بمراجعة بياناتك
              وتحديد القسم المناسب لك. عند اعتماد القسم، سيصلك
              إشعار داخل منصة مُلم.
            </p>
          </div>

          {/* رسالة ترحيب */}
          <div className="mt-6 border border-molim bg-molim-soft p-5">
            <p className="text-sm font-black text-molim-foreground">
              من الآن، أنت جزء من مُلم ❤️
            </p>

            <p className="mt-2 text-xs leading-6 text-molim-muted">
              كل مهمة تنجزها، وكل ساعة تقدمها، وكل فكرة ومساعدة
              تقدمها للفريق، تساهم في بناء هذا الكيان. نعتز
              بانضمامك ونتطلع للأثر الذي ستصنعه معنا.
            </p>
          </div>

          {/* الدخول للمنصة */}
          <Link
            href="/"
            className="mt-6 flex h-14 w-full items-center justify-center bg-[#ed542f] text-sm font-black text-white transition hover:opacity-90"
          >
            الدخول إلى منصة الفريق
          </Link>
        </section>

        <footer className="border-t border-molim pt-6 text-center">
          <p className="text-[11px] text-molim-muted">
            مُلم — إدارة فريقك بشكل أبسط وآمن وسلس
          </p>
        </footer>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-molim bg-molim-soft p-4">
      <p className="text-[11px] text-molim-muted">{label}</p>

      <p className="mt-1 text-sm font-black text-molim-foreground">
        {value}
      </p>
    </div>
  );
}