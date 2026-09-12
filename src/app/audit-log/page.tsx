"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RoleGuard from "../components/RoleGuard";

type AuditCategory =
  | "المتطوعون"
  | "المهام"
  | "الساعات"
  | "الشهادات"
  | "الاتفاقيات"
  | "الأقسام"
  | "الصلاحيات";

type AuditAction =
  | "اعتماد ساعات"
  | "رفض ساعات"
  | "اعتماد مهمة"
  | "إرجاع مهمة للتعديل"
  | "إصدار شهادة"
  | "تعديل بيانات متطوع"
  | "توقيع اتفاقية"
  | "إنهاء اتفاقية"
  | "تعديل قسم"
  | "تغيير صلاحية";

type AuditRecord = {
  id: number;
  actor: string;
  actorId: string;
  category: AuditCategory;
  action: AuditAction;
  target: string;
  department: string;
  date: string;
  time: string;
  before: string;
  after: string;
  details: string;
};

type FilterType = "الكل" | AuditCategory;

const initialLogs: AuditRecord[] = [
  {
    id: 1,
    actor: "أصيل",
    actorId: "MOL-00001",
    category: "الساعات",
    action: "اعتماد ساعات",
    target: "خالد علي — تصميم منشورات المنصة",
    department: "الإدارة",
    date: "2026/09/03",
    time: "08:42",
    before: "قيد المراجعة — 6 ساعات",
    after: "معتمدة — 6 ساعات",
    details:
      "تم اعتماد الساعات المسجلة بعد مراجعة تفاصيل المهمة.",
  },
  {
    id: 2,
    actor: "أصيل",
    actorId: "MOL-00001",
    category: "المهام",
    action: "إرجاع مهمة للتعديل",
    target: "سارة محمد — البحث عن المنح",
    department: "البحث",
    date: "2026/09/03",
    time: "08:20",
    before: "قيد المراجعة",
    after: "تحتاج تعديل",
    details:
      "تم إرجاع المهمة لإضافة المصادر وتوضيح نتائج البحث.",
  },
  {
    id: 3,
    actor: "خالد علي",
    actorId: "MOL-00008",
    category: "المتطوعون",
    action: "تعديل بيانات متطوع",
    target: "محمد أحمد",
    department: "الموارد البشرية",
    date: "2026/09/02",
    time: "15:30",
    before: "رقم الهاتف السابق",
    after: "رقم الهاتف الجديد",
    details:
      "تم تحديث بيانات التواصل الخاصة بالمتطوع.",
  },
  {
    id: 4,
    actor: "أصيل",
    actorId: "MOL-00001",
    category: "الشهادات",
    action: "إصدار شهادة",
    target: "محمد علي — شهادة المشاركة",
    department: "الموارد البشرية",
    date: "2026/09/02",
    time: "12:15",
    before: "بانتظار الاعتماد",
    after: "صادرة",
    details:
      "تم إصدار شهادة المشاركة بعد اكتمال إجراءات الاعتماد.",
  },
  {
    id: 5,
    actor: "أصيل",
    actorId: "MOL-00001",
    category: "الأقسام",
    action: "تعديل قسم",
    target: "الإدارة",
    department: "الإدارة",
    date: "2026/09/01",
    time: "18:05",
    before: "رئيس القسم: محمد أحمد",
    after: "رئيس القسم: أحمد خالد",
    details:
      "تم تعديل رئيس القسم من خلال الإدارة العليا.",
  },
  {
    id: 6,
    actor: "أصيل",
    actorId: "MOL-00001",
    category: "الصلاحيات",
    action: "تغيير صلاحية",
    target: "خالد علي",
    department: "الموارد البشرية",
    date: "2026/08/31",
    time: "16:10",
    before: "متطوع",
    after: "الموارد البشرية",
    details:
      "تم تحديث رتبة المستخدم وصلاحياته.",
  },
  {
    id: 7,
    actor: "أصيل",
    actorId: "MOL-00001",
    category: "الاتفاقيات",
    action: "توقيع اتفاقية",
    target: "سارة محمد — اتفاقية تطوع — البحث والتحقق",
    department: "البحث",
    date: "2026/09/03",
    time: "09:15",
    before: "بانتظار التوقيع",
    after: "سارية",
    details:
      "تم توقيع اتفاقية التطوع بعد اكتمال إجراءات القبول.",
  },
];

const filters: FilterType[] = [
  "الكل",
  "المتطوعون",
  "المهام",
  "الساعات",
  "الشهادات",
  "الاتفاقيات",
  "الأقسام",
  "الصلاحيات",
];

export default function AuditLogPage() {
  const [logs] = useState<AuditRecord[]>(initialLogs);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("الكل");

  const [search, setSearch] = useState("");

  const [selectedLog, setSelectedLog] =
    useState<AuditRecord | null>(null);

  const today = "2026/09/03";

  const todayCount = logs.filter(
    (log) => log.date === today
  ).length;

  const weekCount = logs.length;

  const monthCount = logs.length;

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesFilter =
        activeFilter === "الكل" ||
        log.category === activeFilter;

      const matchesSearch =
        !query ||
        log.actor.toLowerCase().includes(query) ||
        log.actorId.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.target.toLowerCase().includes(query) ||
        log.department.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [logs, activeFilter, search]);

  function categoryStyle(category: AuditCategory) {
    switch (category) {
      case "الساعات":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "المهام":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "الشهادات":
        return "border-green-200 bg-green-50 text-green-700";

      case "الاتفاقيات":
        return "border-teal-200 bg-teal-50 text-teal-700";

      case "المتطوعون":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "الأقسام":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "الصلاحيات":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-molim bg-molim-soft text-molim-foreground";
    }
  }

  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN"]}>
      <main
        dir="rtl"
        className="min-h-screen bg-molim px-4 py-5 text-molim-foreground"
      >
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-molim-muted">
          <span>الرئيسية</span>
          <span className="mx-2">←</span>
          <span>الإدارة</span>
          <span className="mx-2">←</span>
          <span className="font-semibold text-molim-foreground">
            سجل العمليات
          </span>
        </div>

        {/* Header */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              سجل العمليات
            </h1>

            <p className="mt-2 text-sm leading-6 text-molim-muted">
              سجل توثيقي للعمليات والإجراءات التي تمت داخل
              منصة مُلم.
            </p>
          </div>

          <Link
            href="/agreements"
            className="shrink-0 border border-molim bg-molim-surface px-5 py-3 text-sm font-semibold text-molim-foreground transition hover:bg-molim-soft"
          >
            📄 اتفاقيات التطوع ←
          </Link>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <StatCard
            title="عمليات اليوم"
            value={todayCount}
            icon="📅"
          />

          <StatCard
            title="هذا الأسبوع"
            value={weekCount}
            icon="📋"
          />

          <StatCard
            title="هذا الشهر"
            value={monthCount}
            icon="📊"
          />

          <StatCard
            title="إجمالي العمليات"
            value={logs.length}
            icon="🛡️"
          />

        </section>

        {/* Search + Filters */}
        <section className="mt-5 border border-molim bg-molim-surface p-4">

          <label className="mb-2 block text-sm font-semibold">
            البحث
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="ابحث باسم المستخدم، Molim ID، العملية أو القسم..."
            className="h-12 w-full border border-molim bg-molim-soft px-4 text-sm outline-none transition focus:border-[#ed542f]"
          />

          <div className="mt-4 flex flex-wrap gap-2">

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer border px-4 py-2.5 text-sm font-medium transition ${
                  activeFilter === filter
                    ? "border-[#ed542f] bg-[#ed542f] text-white"
                    : "border-molim bg-molim-surface text-molim-foreground hover:bg-molim-soft"
                }`}
              >
                {filter}
              </button>
            ))}

          </div>
        </section>

        {/* Logs */}
        <section className="mt-5">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-lg font-bold">
              العمليات
            </h2>

            <span className="text-sm text-molim-muted">
              {filteredLogs.length} عملية
            </span>

          </div>

          {filteredLogs.length === 0 ? (

            <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">

              <p className="font-semibold">
                لا توجد عمليات
              </p>

              <p className="mt-2 text-sm text-molim-muted">
                لا توجد عمليات مطابقة للبحث أو الفلتر.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredLogs.map((log) => (

                <button
                  key={log.id}
                  type="button"
                  onClick={() => setSelectedLog(log)}
                  className="block w-full cursor-pointer border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {log.actor}
                        </h3>

                        <span className="bg-molim-soft px-2 py-1 text-xs text-molim-muted">
                          {log.actorId}
                        </span>

                        <span
                          className={`border px-2 py-1 text-xs font-medium ${categoryStyle(
                            log.category
                          )}`}
                        >
                          {log.category}
                        </span>

                      </div>

                      <p className="mt-2 text-sm font-semibold text-molim-foreground">
                        {log.action}
                      </p>

                      <p className="mt-1 text-sm text-molim-muted">
                        {log.target}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">

                        <span>
                          القسم: {log.department}
                        </span>

                        <span>
                          التاريخ: {log.date}
                        </span>

                        <span>
                          الوقت: {log.time}
                        </span>

                      </div>

                    </div>

                    <div className="shrink-0 text-sm font-semibold text-[#ed542f]">
                      عرض التفاصيل ←
                    </div>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>
      </div>

      {/* Details Modal */}
      {selectedLog && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLog(null);
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm text-molim-muted">
                  تفاصيل العملية
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedLog.action}
                </h2>

                <p className="mt-1 text-xs text-molim-muted">
                  رقم العملية: #{selectedLog.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              {/* Actor */}
              <div className="grid grid-cols-2 gap-3">

                <InfoBox
                  title="منفذ العملية"
                  value={selectedLog.actor}
                />

                <InfoBox
                  title="Molim ID"
                  value={selectedLog.actorId}
                />

                <InfoBox
                  title="نوع العملية"
                  value={selectedLog.category}
                />

                <InfoBox
                  title="القسم"
                  value={selectedLog.department}
                />

                <InfoBox
                  title="التاريخ"
                  value={selectedLog.date}
                />

                <InfoBox
                  title="الوقت"
                  value={selectedLog.time}
                />

              </div>

              {/* Target */}
              <div className="border border-molim bg-molim-soft p-4">

                <p className="text-xs text-molim-muted">
                  العنصر المتأثر
                </p>

                <p className="mt-1 font-semibold">
                  {selectedLog.target}
                </p>

              </div>

              {/* Before / After */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div className="border border-molim bg-molim-soft p-4">

                  <p className="text-xs text-molim-muted">
                    قبل العملية
                  </p>

                  <p className="mt-2 text-sm leading-6 text-molim-foreground">
                    {selectedLog.before}
                  </p>

                </div>

                <div className="border border-molim bg-molim-soft p-4">

                  <p className="text-xs text-molim-muted">
                    بعد العملية
                  </p>

                  <p className="mt-2 text-sm leading-6 text-molim-foreground">
                    {selectedLog.after}
                  </p>

                </div>

              </div>

              {/* Details */}
              <div className="border border-molim bg-molim-soft p-4">

                <p className="text-xs text-molim-muted">
                  تفاصيل العملية
                </p>

                <p className="mt-2 text-sm leading-6 text-molim-foreground">
                  {selectedLog.details}
                </p>

              </div>

              {/* Read Only Notice */}
              <div className="border border-molim bg-molim-soft p-4">

                <p className="text-sm font-semibold">
                  🔒 سجل توثيقي
                </p>

                <p className="mt-1 text-xs leading-5 text-molim-muted">
                  هذا السجل للعرض والتوثيق فقط، ولا يمكن تعديله
                  أو حذفه من خلال الواجهة.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="h-12 w-full cursor-pointer border border-molim bg-molim-surface font-semibold text-molim-foreground hover:bg-molim-soft"
              >
                إغلاق
              </button>

            </div>
          </div>
        </div>
      )}
      </main>
    </RoleGuard>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="border border-molim bg-molim-surface p-4">

      <div className="flex items-start justify-between gap-3">

        <div>

          <p className="text-xs leading-5 text-molim-muted">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div className="bg-molim-soft px-2.5 py-2">
          {icon}
        </div>

      </div>

    </div>
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

      <p className="mt-1 font-semibold">
        {value}
      </p>

    </div>
  );
}