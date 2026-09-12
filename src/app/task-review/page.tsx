"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import PageShell from "../components/PageShell";
import RoleGuard from "../components/RoleGuard";
import { useAuth } from "../lib/auth-context";
import { ROLE_NAMES } from "../lib/roles";

type AttachmentKind = "صورة" | "مستند" | "رابط";

type Attachment = {
  id: number;
  name: string;
  kind: AttachmentKind;
  size: string;
  preview: string;
  url: string;
};

type PendingTask = {
  id: number;
  title: string;
  volunteer: string;
  department: string;
  hours: number;
  completedAt: string;
  description: string;
  attachments: Attachment[];
};

type ReviewedTask = {
  id: number;
  title: string;
  volunteer: string;
  hours: number;
  decision: "معتمدة" | "مرفوضة";
  reason: string;
};

/* صورة معاينة تجريبية لقسم المرفقات (SVG بهوية مُلم) */
const SAMPLE_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420" viewBox="0 0 800 420" dir="rtl"><rect width="800" height="420" fill="#0f1f3d"/><rect x="40" y="40" width="140" height="140" fill="#ff4500"/><text x="110" y="150" font-family="Arial" font-size="80" font-weight="bold" fill="#ffffff" text-anchor="middle">م</text><text x="745" y="115" font-family="Arial" font-size="46" font-weight="bold" fill="#ff4500" text-anchor="end">مرفق العمل</text><text x="745" y="175" font-family="Arial" font-size="26" fill="#ffffff" text-anchor="end">مُلم — نموذج الإنجاز والمرفقات</text></svg>`
  );

const DRIVE_ROOT =
  "https://drive.google.com/drive/my-drive";

const initialPendingTasks: PendingTask[] = [
  {
    id: 1,
    title: "تصميم منشور إعلان المنح",
    volunteer: "أحمد محمد",
    department: "التصميم",
    hours: 3,
    completedAt: "2026/09/04",
    description:
      "أنجزت تصميم منشور إعلان المنح الجديد بقياس 1080×1080 بعدة نسخ ألوان، مع مراعاة هوية منصة مُلم وضبط النصوص العربية وتصدير الملفات النهائية بصيغتي PNG و SVG.",
    attachments: [
      {
        id: 101,
        name: "منشور-المنح-final.png",
        kind: "صورة",
        size: "1.8 MB",
        preview: SAMPLE_IMAGE,
        url: "",
      },
      {
        id: 102,
        name: "مسودة التصميم على Drive",
        kind: "رابط",
        size: "رابط خارجي",
        preview: "",
        url: DRIVE_ROOT,
      },
    ],
  },
  {
    id: 2,
    title: "كتابة محتوى فرص التطوع",
    volunteer: "سارة علي",
    department: "المحتوى",
    hours: 4,
    completedAt: "2026/09/05",
    description:
      "كتبت مقالًا تعريفيًا عن فرص التطوع في مُلم مع مراجعة لغوية كاملة وتنسيق الأقسام، وأعددت مسودة النشرة الإخبارية الشهرية مع حصر العناوين والروابط المرجعية.",
    attachments: [
      {
        id: 201,
        name: "مسودة-المقال.docx",
        kind: "مستند",
        size: "340 KB",
        preview: "",
        url: "",
      },
      {
        id: 202,
        name: "مجلد مسودات الكتابة",
        kind: "رابط",
        size: "رابط خارجي",
        preview: "",
        url: DRIVE_ROOT,
      },
    ],
  },
  {
    id: 3,
    title: "تحديث صفحة المنصة",
    volunteer: "محمد خالد",
    department: "التقنية",
    hours: 2,
    completedAt: "2026/09/05",
    description:
      "حدّثت محتوى صفحة المنصة وأصلحت الروابط المكسورة في الصفحة الرئيسية، وتأكدت من استجابة العرض على شاشات الجوال مع فحص سريع للأداء.",
    attachments: [
      {
        id: 301,
        name: "لقطة-الشاشة.JPG",
        kind: "صورة",
        size: "920 KB",
        preview: SAMPLE_IMAGE,
        url: "",
      },
    ],
  },
];

const attachmentIcons: Record<AttachmentKind, string> = {
  صورة: "🖼️",
  مستند: "📄",
  رابط: "🔗",
};

export default function TaskReviewPage() {
  const { user: currentUser } = useAuth();

  const roleName = ROLE_NAMES[currentUser.role];

  const [tasks, setTasks] =
    useState<PendingTask[]>(initialPendingTasks);

  const [hoursInput, setHoursInput] =
    useState<Record<number, string>>({});

  const [completedReviews, setCompletedReviews] =
    useState<ReviewedTask[]>([]);

  const [previewAttachment, setPreviewAttachment] =
    useState<Attachment | null>(null);

  const [rejectingId, setRejectingId] =
    useState<number | null>(null);

  const [rejectReason, setRejectReason] = useState("");

  function getHoursValue(task: PendingTask) {
    return hoursInput[task.id] ?? String(task.hours);
  }

  function setHours(taskId: number, value: string) {
    setHoursInput((current) => ({
      ...current,
      [taskId]: value,
    }));
  }

  function removeTask(taskId: number) {
    setTasks((current) =>
      current.filter((item) => item.id !== taskId)
    );

    setHoursInput((current) => {
      const next = { ...current };
      delete next[taskId];
      return next;
    });

    cancelReject();
  }

  function approveTask(task: PendingTask) {
    const entered = Number(getHoursValue(task));

    const approvedHours =
      Number.isFinite(entered) && entered >= 0
        ? Math.round(entered)
        : 0;

    setCompletedReviews((current) => [
      {
        id: Date.now(),
        title: task.title,
        volunteer: task.volunteer,
        hours: approvedHours,
        decision: "معتمدة",
        reason: "",
      },
      ...current,
    ]);

    removeTask(task.id);
  }

  function requestReject(task: PendingTask) {
    setRejectingId(task.id);
    setRejectReason("");
  }

  function cancelReject() {
    setRejectingId(null);
    setRejectReason("");
  }

  function confirmReject(task: PendingTask) {
    setCompletedReviews((current) => [
      {
        id: Date.now(),
        title: task.title,
        volunteer: task.volunteer,
        hours: task.hours,
        decision: "مرفوضة",
        reason: rejectReason.trim(),
      },
      ...current,
    ]);

    removeTask(task.id);
  }

  return (
    <RoleGuard allowedRoles={["DEPARTMENT_HEAD", "ADMIN", "SUPER_ADMIN"]}>
      <PageShell narrow>
        {/* الهيدر */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-molim-orange">
              {roleName}
            </p>

            <h1 className="mt-1 text-2xl font-black text-[var(--foreground)]">
              مراجعة المهام
            </h1>

            <p className="mt-2 text-sm leading-6 text-molim-muted">
              مراجعة تفاصيل المهام ومرفقاتها واعتماد ساعات
              الإنجاز المرفوعة من المتطوعين.
            </p>
          </div>

          <Link
            href="/"
            className="shrink-0 text-sm font-bold text-molim-muted transition hover:text-molim-orange"
          >
            ← الرئيسية
          </Link>
        </header>

        {/* طلبات اعتماد الساعات */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-[var(--foreground)]">
              طلبات اعتماد الساعات
            </h2>

            <span className="border border-molim bg-molim-soft px-3 py-1 text-xs font-bold text-molim-foreground">
              {tasks.length} طلب
            </span>
          </div>

          {tasks.length === 0 ? (
            <Card soft className="p-10 text-center">
              <p className="text-base font-bold text-molim-foreground">
                لا توجد طلبات بانتظار المراجعة
              </p>

              <p className="mt-2 text-sm text-molim-muted">
                تمت مراجعة جميع طلبات اعتماد الساعات.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id} className="p-5">
                  {/* رأس البطاقة */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-molim-foreground">
                        {task.title}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-molim-foreground">
                          {task.volunteer}
                        </span>

                        <span className="border border-molim bg-molim-soft px-2 py-0.5 text-xs text-molim-muted">
                          {task.department}
                        </span>
                      </div>
                    </div>

                    <span className="shrink-0 border border-molim bg-molim-soft px-3 py-1 text-xs text-molim-muted">
                      {task.completedAt}
                    </span>
                  </div>

                  {/* الساعات المطلوبة */}
                  <div className="mt-4 flex items-center justify-between gap-3 bg-molim-card border border-molim p-3">
                    <p className="text-xs text-molim-muted">
                      الساعات المطلوبة
                    </p>

                    <p className="text-xl font-black text-molim-orange">
                      {task.hours} ساعات
                    </p>
                  </div>

                  {/* الوصف والتفاصيل */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-molim-muted">
                      الوصف والتفاصيل
                    </p>

                    <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">
                      {task.description}
                    </p>
                  </div>

                  {/* المرفقات والروابط */}
                  <div className="mt-4">
                    <p className="text-xs font-bold text-molim-muted">
                      المرفقات والروابط
                    </p>

                    <div className="mt-2 space-y-2">
                      {task.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between gap-3 border border-molim bg-molim-soft p-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="shrink-0 text-lg">
                              {attachmentIcons[attachment.kind]}
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-molim-foreground">
                                {attachment.name}
                              </p>

                              <p className="mt-0.5 text-xs text-molim-muted">
                                {attachment.size}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setPreviewAttachment(
                                attachment
                              )
                            }
                            className="shrink-0 border border-molim bg-molim-card px-3 py-2 text-xs font-bold text-molim-blue transition hover:bg-molim-soft"
                          >
                            معاينة
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* لوحة اتخاذ القرار */}
                  <div className="mt-5 space-y-3 border-t border-molim pt-4">
                    <div>
                      <label
                        htmlFor={`hours-${task.id}`}
                        className="mb-2 block text-xs font-bold text-molim-muted"
                      >
                        الساعات المعتمدة
                        <span className="mr-1 font-normal">
                          (قابلة للتعديل — الافتراضي طلب
                          المتطوع)
                        </span>
                      </label>

                      <input
                        id={`hours-${task.id}`}
                        type="number"
                        min="0"
                        value={getHoursValue(task)}
                        onChange={(event) =>
                          setHours(task.id, event.target.value)
                        }
                        className="molim-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={() => approveTask(task)}
                        className="border-green-600! bg-green-600! hover:opacity-90"
                      >
                        ✅ اعتماد
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => requestReject(task)}
                        className="border-red-600! bg-red-600! hover:opacity-90"
                      >
                        ❌ رفض
                      </Button>
                    </div>

                    {rejectingId === task.id && (
                      <div className="space-y-3 border border-red-200 bg-red-50 p-3">
                        <div>
                          <label
                            htmlFor={`reason-${task.id}`}
                            className="mb-2 block text-xs font-bold text-red-700"
                          >
                            سبب الرفض (اختياري)
                          </label>

                          <textarea
                            id={`reason-${task.id}`}
                            rows={3}
                            value={rejectReason}
                            onChange={(event) =>
                              setRejectReason(
                                event.target.value
                              )
                            }
                            placeholder="اكتب سبب الرفض ليعود للمتطوع..."
                            className="molim-textarea"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            onClick={() => confirmReject(task)}
                            className="border-red-600! bg-red-600! hover:opacity-90"
                          >
                            تأكيد الرفض
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelReject}
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* تمت المراجعة */}
        {completedReviews.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black text-[var(--foreground)]">
                تمت المراجعة
              </h2>

              <span className="text-sm text-molim-muted">
                {completedReviews.length} عملية
              </span>
            </div>

            <div className="space-y-2">
              {completedReviews.map((review) => (
                <Card
                  key={review.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-molim-foreground">
                      {review.title}
                    </p>

                    <p className="mt-0.5 text-xs text-molim-muted">
                      {review.volunteer}
                    </p>

                    {review.decision === "مرفوضة" &&
                      review.reason && (
                        <p className="mt-1 text-xs leading-5 text-red-700">
                          السبب: {review.reason}
                        </p>
                      )}
                  </div>

                  <span
                    className={`shrink-0 border px-3 py-1 text-xs font-bold ${
                      review.decision === "معتمدة"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {review.decision === "معتمدة"
                      ? `اعتماد ${review.hours} ساعات`
                      : "رفض"}
                  </span>
                </Card>
              ))}
            </div>
          </section>
        )}
      </PageShell>

      {/* معاينة المرفق */}
      {previewAttachment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewAttachment(null);
            }
          }}
        >
          <div className="w-full max-w-md border border-molim bg-molim-surface p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-molim-muted">
                  معاينة المرفق
                </p>

                <h2 className="mt-1 text-lg font-black text-molim-foreground">
                  {previewAttachment.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="bg-molim-soft px-3 py-2 text-molim-foreground transition hover:bg-molim-soft"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {previewAttachment.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewAttachment.preview}
                  alt={previewAttachment.name}
                  className="w-full border border-molim bg-molim-soft"
                />
              ) : (
                <div className="border border-molim bg-molim-soft p-6 text-center">
                  <span className="text-3xl">
                    {attachmentIcons[previewAttachment.kind]}
                  </span>

                  <p className="mt-3 text-sm text-molim-muted">
                    هذا المرفق من نوع «
                    {previewAttachment.kind}
                    » وهو متاح داخل النظام.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <InfoBox
                  title="النوع"
                  value={previewAttachment.kind}
                />

                <InfoBox
                  title="الحجم"
                  value={previewAttachment.size}
                />
              </div>

              {previewAttachment.url && (
                <a
                  href={previewAttachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center bg-molim-blue text-sm font-bold text-white transition hover:opacity-90"
                >
                  فتح المرفق في Drive ←
                </a>
              )}

              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="h-12 w-full cursor-pointer border border-molim bg-molim-surface font-semibold text-molim-foreground transition hover:bg-molim-soft"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="border border-molim p-4">
      <p className="text-xs text-molim-muted">
        {title}
      </p>

      <p className="mt-1 font-semibold text-molim-foreground">
        {value}
      </p>
    </div>
  );
}