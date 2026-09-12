"use client";

import Link from "next/link";
import { useState } from "react";

type Certificate = {
  id: number;
  title: string;
  description: string;
  requirement: string;
  eligible: boolean;
  progress?: string;
  icon: string;
};

const certificates: Certificate[] = [
  {
    id: 1,
    title: "شهادة التطوع",
    description:
      "شهادة تقديرية توثق مشاركتك في العمل التطوعي مع فريق مُلم.",
    requirement: "إكمال 40 ساعة تطوعية معتمدة",
    eligible: true,
    progress: "42 / 40 ساعة",
    icon: "🏅",
  },
  {
    id: 2,
    title: "شهادة المشاركة",
    description:
      "شهادة توثق مشاركتك الفعلية في أعمال وأنشطة فريق مُلم.",
    requirement: "المشاركة الفعلية في أعمال الفريق",
    eligible: true,
    icon: "🎖️",
  },
  {
    id: 3,
    title: "شهادة الخبرة",
    description:
      "شهادة توثق الخبرة التي اكتسبتها من خلال العمل والمشاركة المستمرة.",
    requirement: "إكمال 300 ساعة تطوعية معتمدة",
    eligible: false,
    progress: "42 / 300 ساعة",
    icon: "🏆",
  },
];

export default function CertificatesPage() {
  const [requested, setRequested] = useState<number[]>([]);
  const [recommendationRequested, setRecommendationRequested] =
    useState(false);

  const requestCertificate = (id: number) => {
    setRequested((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  const requestRecommendation = () => {
    setRecommendationRequested(true);
  };

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
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-24 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />

        <div className="absolute bottom-10 left-14 h-20 w-20 rotate-45 border border-[#202124]/10" />
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
            href="/notifications"
            aria-label="الإشعارات"
            className="flex h-10 w-10 items-center justify-center border border-molim bg-molim-soft text-lg"
          >
            🔔
          </Link>
        </header>

        {/* العنوان */}
        <section className="mt-9">
          <p className="text-sm font-bold text-[#ed542f]">
            الإنجازات
          </p>

          <h2 className="mt-2 text-3xl font-black text-molim-foreground">
            الشهادات والخطابات
          </h2>

          <p className="mt-3 text-sm leading-7 text-molim-muted">
            استعرض الشهادات المستحقة وخطاب التوصية، وقدّم طلبك
            ليتم مراجعته واعتماده من الجهة المختصة.
          </p>
        </section>

        {/* ملخص الساعات */}
        <section className="mt-7 border border-molim bg-molim-soft p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-molim-muted">
                الساعات المعتمدة
              </p>

              <p className="mt-1 text-3xl font-black text-molim-foreground">
                42
              </p>

              <p className="mt-1 text-xs text-molim-muted">
                ساعة تطوعية معتمدة
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center bg-[#ed542f]/10 text-2xl">
              ⏱
            </div>
          </div>

          <div className="mt-5 h-2 w-full bg-molim-soft">
            <div
              className="h-2 bg-[#ed542f]"
              style={{ width: "100%" }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-molim-muted">
            <span>0 ساعة</span>
            <span>40 ساعة — شهادة التطوع</span>
          </div>
        </section>

        {/* الشهادات */}
        <section className="mt-8">
          <div className="mb-3">
            <h3 className="text-lg font-black text-molim-foreground">
              الشهادات
            </h3>

            <p className="mt-1 text-xs text-molim-muted">
              يظهر لكل شهادة وضع الاستحقاق والإجراء المتاح لك.
            </p>
          </div>

          <div className="space-y-3">
            {certificates.map((certificate) => {
              const isRequested = requested.includes(certificate.id);

              return (
                <article
                  key={certificate.id}
                  className={`border bg-molim-soft p-5 ${
                    certificate.eligible
                      ? "border-[#ed542f]/30"
                      : "border-molim"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center text-xl ${
                        certificate.eligible
                          ? "bg-[#ed542f]/10"
                          : "bg-molim-soft"
                      }`}
                    >
                      {certificate.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-black text-molim-foreground">
                          {certificate.title}
                        </h4>

                        <span
                          className={`shrink-0 px-2 py-1 text-[10px] font-bold ${
                            certificate.eligible
                              ? "bg-green-50 text-green-700"
                              : "bg-molim-soft text-molim-muted"
                          }`}
                        >
                          {certificate.eligible
                            ? "مؤهل"
                            : "غير مؤهل"}
                        </span>
                      </div>

                      <p className="mt-2 text-xs leading-6 text-molim-muted">
                        {certificate.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-molim pt-4">
                    <p className="text-[11px] text-molim-muted">
                      شرط الاستحقاق
                    </p>

                    <p className="mt-1 text-xs font-bold text-molim-foreground">
                      {certificate.requirement}
                    </p>

                    {certificate.progress && (
                      <p
                        className={`mt-2 text-[11px] font-bold ${
                          certificate.eligible
                            ? "text-green-700"
                            : "text-[#ed542f]"
                        }`}
                      >
                        {certificate.progress}
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    {certificate.eligible ? (
                      isRequested ? (
                        <div className="border border-blue-200 bg-blue-50 px-4 py-3">
                          <p className="text-xs font-black text-blue-700">
                            ✓ تم إرسال طلبك
                          </p>

                          <p className="mt-1 text-[10px] leading-5 text-blue-600">
                            طلب الشهادة بانتظار مراجعة واعتماد الجهة
                            المختصة.
                          </p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            requestCertificate(certificate.id)
                          }
                          className="h-12 w-full bg-[#ed542f] text-sm font-black text-white transition hover:opacity-90"
                        >
                          طلب الشهادة
                        </button>
                      )
                    ) : (
                      <div className="flex items-center justify-between border border-molim bg-molim-soft px-4 py-3">
                        <span className="text-xs text-molim-muted">
                          لم تستوفِ شروط الاستحقاق بعد
                        </span>

                        <span className="text-sm text-molim-muted">
                          🔒
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* خطاب التوصية */}
        <section className="mt-8">
          <div className="mb-3">
            <h3 className="text-lg font-black text-molim-foreground">
              ✉️ خطاب التوصية
            </h3>

            <p className="mt-1 text-xs leading-6 text-molim-muted">
              خطاب التوصية يختلف عن الشهادات، ويعتمد على مدة
              المشاركة وجودة الأداء وتقييم المسؤول المختص.
            </p>
          </div>

          <article className="border border-molim bg-molim-soft p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#ed542f]/10 text-xl">
                ✉️
              </div>

              <div>
                <h4 className="text-sm font-black text-molim-foreground">
                  طلب خطاب توصية
                </h4>

                <p className="mt-2 text-xs leading-6 text-molim-muted">
                  يمكنك تقديم طلب خطاب توصية، وسيتم تقييم طلبك
                  من خلال بيانات مشاركتك وأدائك داخل الفريق.
                </p>
              </div>
            </div>

            {/* معايير التقييم */}
            <div className="mt-5 border-t border-molim pt-4">
              <p className="text-[11px] font-bold text-molim-muted">
                يعتمد الطلب على
              </p>

              <div className="mt-3 space-y-2">
                <Requirement text="وجود فترة تطوع فعلية داخل فريق مُلم" />

                <Requirement text="وجود مهام وساعات تطوعية معتمدة" />

                <Requirement text="جودة أداء المتطوع ومشاركته" />

                <Requirement text="تقييم رئيس القسم أو المسؤول المباشر" />

                <Requirement text="عدم وجود ملاحظات إدارية مؤثرة على الطلب" />
              </div>
            </div>

            {/* الزر */}
            <div className="mt-5">
              {recommendationRequested ? (
                <div className="border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs font-black text-blue-700">
                    ✓ تم إرسال طلب خطاب التوصية
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-blue-600">
                    سيتم مراجعة طلبك من الموارد البشرية والجهة
                    المختصة، وقد يُطلب منك تقديم معلومات إضافية.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={requestRecommendation}
                  className="h-12 w-full bg-[#ed542f] text-sm font-black text-white transition hover:opacity-90"
                >
                  طلب خطاب التوصية
                </button>
              )}
            </div>
          </article>
        </section>

        {/* آلية خطاب التوصية */}
        <section className="mt-8 border border-[#ed542f]/20 bg-[#ed542f]/5 p-5">
          <p className="text-xs font-black text-molim-foreground">
            📌 كيف يتم إصدار خطاب التوصية؟
          </p>

          <div className="mt-4 space-y-3">
            <Step
              number="1"
              text="تقدم طلب خطاب التوصية من المنصة."
            />

            <Step
              number="2"
              text="تراجع الموارد البشرية بيانات مشاركتك وساعاتك."
            />

            <Step
              number="3"
              text="يمكن مراجعة أدائك من رئيس القسم أو المسؤول المباشر."
            />

            <Step
              number="4"
              text="يتم اعتماد الطلب أو طلب معلومات إضافية أو رفضه."
            />

            <Step
              number="5"
              text="عند الاعتماد يتم تجهيز الخطاب وإتاحته لك."
            />
          </div>
        </section>

        {/* سجل الطلبات */}
        <section className="mt-8 border border-molim bg-molim-soft p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-molim-foreground">
                طلباتك
              </h3>

              <p className="mt-1 text-[11px] text-molim-muted">
                متابعة الطلبات السابقة الخاصة بالشهادات والخطابات.
              </p>
            </div>

            <span className="text-xs font-bold text-molim-muted">
              0 طلبات سابقة
            </span>
          </div>

          {recommendationRequested && (
            <div className="mt-4 border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black text-blue-700">
                    خطاب التوصية
                  </p>

                  <p className="mt-1 text-[10px] text-blue-600">
                    قيد المراجعة
                  </p>
                </div>

                <span className="text-lg">✉️</span>
              </div>
            </div>
          )}
        </section>

        {/* ملاحظة */}
        <section className="mt-6 border-r-4 border-[#ed542f] bg-molim-soft px-5 py-4">
          <p className="text-xs font-black text-molim-foreground">
            🔐 ملاحظة
          </p>

          <p className="mt-1 text-xs leading-6 text-molim-muted">
            تقديم الطلب لا يعني الموافقة التلقائية. يتم اعتماد
            الشهادات والخطابات من الجهة المخولة بعد مراجعة البيانات
            والساعات والمشاركة والأداء.
          </p>
        </section>

        <footer className="mt-10 border-t border-molim pt-6 text-center">
          <p className="text-[11px] text-molim-muted">
            مُلم — إدارة فريقك بشكل أبسط وآمن وسلس
          </p>
        </footer>
      </div>
    </main>
  );
}

function Requirement({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1 text-xs font-black text-[#ed542f]">
        ✓
      </span>

      <p className="text-xs leading-5 text-molim-muted">
        {text}
      </p>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-molim-surface text-[10px] font-black text-[#ed542f]">
        {number}
      </div>

      <p className="text-xs font-semibold text-molim-foreground">
        {text}
      </p>
    </div>
  );
}