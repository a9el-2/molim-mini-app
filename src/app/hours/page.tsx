"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../lib/auth-context";

type HoursStatus = "قيد المراجعة" | "معتمدة" | "مرفوضة";

type HoursRecord = {
  id: number;
  volunteer: string;
  molimId: string;
  task: string;
  description: string;
  department: string;
  submittedHours: number;
  approvedHours: number;
  date: string;
  status: HoursStatus;
  reviewer: string;
  reviewedAt: string;
  notes: string;
};

type FilterType = "الكل" | HoursStatus;

const CURRENT_REVIEWER = "أصيل";

const initialRecords: HoursRecord[] = [
  {
    id: 1,
    volunteer: "محمد أحمد",
    molimId: "MOL-00012",
    task: "تنظيم ملفات الفريق",
    description:
      "تنظيم وترتيب ملفات المتطوعين ومراجعة المستندات الموجودة في مجلد الفريق.",
    department: "الإدارة",
    submittedHours: 4,
    approvedHours: 0,
    date: "2026/09/01",
    status: "قيد المراجعة",
    reviewer: "",
    reviewedAt: "",
    notes: "",
  },
  {
    id: 2,
    volunteer: "خالد علي",
    molimId: "MOL-00008",
    task: "تصميم منشورات المنصة",
    description:
      "تصميم مجموعة من المنشورات الخاصة بإعلانات المنح وفرص التطوع.",
    department: "الإدارة",
    submittedHours: 6,
    approvedHours: 6,
    date: "2026/08/30",
    status: "معتمدة",
    reviewer: "أصيل",
    reviewedAt: "2026/08/31",
    notes: "تمت مراجعة المهمة واعتماد الساعات.",
  },
  {
    id: 3,
    volunteer: "سارة محمد",
    molimId: "MOL-00015",
    task: "البحث عن المنح",
    description:
      "البحث عن المنح الدراسية وجمع المعلومات وتجهيزها للنشر.",
    department: "البحث",
    submittedHours: 3,
    approvedHours: 0,
    date: "2026/08/29",
    status: "مرفوضة",
    reviewer: "أصيل",
    reviewedAt: "2026/08/30",
    notes: "المهمة تحتاج إلى توضيح إضافي.",
  },
  {
    id: 4,
    volunteer: "محمد علي",
    molimId: "MOL-00019",
    task: "إدارة محتوى القناة",
    description:
      "متابعة المحتوى المنشور في القناة وتجهيز المواد المطلوبة للنشر.",
    department: "الإدارة",
    submittedHours: 5,
    approvedHours: 0,
    date: "2026/09/02",
    status: "قيد المراجعة",
    reviewer: "",
    reviewedAt: "",
    notes: "",
  },
];

const filters: FilterType[] = [
  "الكل",
  "قيد المراجعة",
  "معتمدة",
  "مرفوضة",
];

export default function HoursPage() {
  const [records, setRecords] =
    useState<HoursRecord[]>(initialRecords);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("الكل");

  const [search, setSearch] = useState("");

  const [selectedRecord, setSelectedRecord] =
    useState<HoursRecord | null>(null);

  const [approvedHours, setApprovedHours] =
    useState("");

  const [reviewNotes, setReviewNotes] =
    useState("");

  const { user, role } = useAuth();

  const isVolunteer = role === "VOLUNTEER";

  /* المتطوع يرى سجلاته فقط، والبقية يرون سجلات كل الفريق */
  const visibleRecords = useMemo(
    () =>
      isVolunteer
        ? records.filter((record) => record.molimId === user.id)
        : records,
    [isVolunteer, records, user.id]
  );

  const pendingCount = visibleRecords.filter(
    (record) => record.status === "قيد المراجعة"
  ).length;

  const approvedCount = visibleRecords.filter(
    (record) => record.status === "معتمدة"
  ).length;

  const rejectedCount = visibleRecords.filter(
    (record) => record.status === "مرفوضة"
  ).length;

  const submittedHoursTotal = visibleRecords.reduce(
    (total, record) => total + record.submittedHours,
    0
  );

  const approvedHoursTotal = visibleRecords.reduce(
    (total, record) =>
      total +
      (record.status === "معتمدة"
        ? record.approvedHours
        : 0),
    0
  );

  const unapprovedRecords = visibleRecords.filter(
    (record) => record.status !== "معتمدة"
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return visibleRecords.filter((record) => {
      const matchesFilter =
        activeFilter === "الكل" ||
        record.status === activeFilter;

      const matchesSearch =
        !query ||
        record.volunteer.toLowerCase().includes(query) ||
        record.molimId.toLowerCase().includes(query) ||
        record.task.toLowerCase().includes(query) ||
        record.department.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [visibleRecords, activeFilter, search]);

  function openRecord(record: HoursRecord) {
    setSelectedRecord(record);

    setApprovedHours(
      record.approvedHours > 0
        ? String(record.approvedHours)
        : String(record.submittedHours)
    );

    setReviewNotes(record.notes);
  }

  function closeRecord() {
    setSelectedRecord(null);
    setApprovedHours("");
    setReviewNotes("");
  }

  function reviewRecord(
    newStatus: "معتمدة" | "مرفوضة"
  ) {
    if (!selectedRecord) return;

    const enteredHours = Number(approvedHours);

    const finalApprovedHours =
      Number.isFinite(enteredHours) &&
      enteredHours >= 0
        ? Math.min(
            enteredHours,
            selectedRecord.submittedHours
          )
        : 0;

    const reviewedDate =
      new Date().toLocaleDateString("ar-SA");

    setRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === selectedRecord.id
          ? {
              ...record,
              status: newStatus,
              approvedHours:
                newStatus === "معتمدة"
                  ? finalApprovedHours
                  : 0,
              reviewer: CURRENT_REVIEWER,
              reviewedAt: reviewedDate,
              notes: reviewNotes.trim(),
            }
          : record
      )
    );

    closeRecord();

    // بعد الاعتماد أو الرفض ننتقل تلقائيًا إلى الحالة المناسبة.
    setActiveFilter(newStatus);
  }

  function statusStyle(status: HoursStatus) {
    if (status === "قيد المراجعة") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (status === "معتمدة") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-molim px-4 py-5 text-molim-foreground"
    >
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-molim-muted">
          <span>الرئيسية</span>
          <span className="mx-2">←</span>
          <span>سجل متابعة العمل التطوعي</span>
          <span className="mx-2">←</span>
          <span className="font-semibold text-molim-foreground">
            سجل الساعات التطوعية
          </span>
        </div>

        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold">
            سجل الساعات التطوعية
          </h1>

          <p className="mt-2 text-sm leading-6 text-molim-muted">
            متابعة الساعات التطوعية المسجلة ومراجعتها
            واعتمادها.
          </p>
        </section>

        {/* Statistics */}
        {isVolunteer ? (
          <>
            {/* إجمالي الساعات المعتمدة — بارز أعلى الصفحة */}
            <section className="overflow-hidden rounded-2xl border border-molim bg-molim-surface">
              <div className="border-b-4 border-[#ed542f]">
                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm text-molim-muted">
                      إجمالي الساعات المعتمدة
                    </p>

                    <p className="mt-2 text-5xl font-black text-[#ed542f]">
                      {approvedHoursTotal}
                    </p>

                    <p className="mt-3 text-xs leading-5 text-molim-muted">
                      الساعات المعتمدة في سجلّك التطوعي حتى الآن.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#ed542f]/10 px-5 py-4 text-3xl">
                    📊
                  </div>
                </div>
              </div>
            </section>

            {/* الساعات غير المعتمدة */}
            <section className="mt-6">
              <h2 className="text-lg font-bold">
                الساعات غير المعتمدة
              </h2>

              {unapprovedRecords.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {unapprovedRecords.map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => openRecord(record)}
                      className="block w-full cursor-pointer rounded-2xl border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {record.task}
                          </p>

                          <p className="mt-1 text-xs text-molim-muted">
                            {record.submittedHours} ساعة —{" "}
                            {record.date}
                          </p>
                        </div>

                        <span
                          className={`rounded-lg border px-2 py-1 text-xs font-medium ${statusStyle(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-molim-muted">
                  لا توجد ساعات غير معتمدة حاليًا.
                </p>
              )}
            </section>

            {/* الفاصل */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-molim" />
              <span className="text-xs font-bold text-molim-muted">
                حالة سجلاتك
              </span>
              <span className="h-px flex-1 bg-molim" />
            </div>

            {/* عدادات الحالة */}
            <section className="grid grid-cols-3 gap-3">
              <StatCard
                title="قيد المراجعة"
                value={pendingCount}
                icon="⏳"
              />

              <StatCard
                title="معتمدة"
                value={approvedCount}
                icon="✅"
              />

              <StatCard
                title="مرفوضة"
                value={rejectedCount}
                icon="❌"
              />
            </section>
          </>
        ) : (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">

          <StatCard
            title="قيد المراجعة"
            value={pendingCount}
            icon="⏳"
          />

          <StatCard
            title="معتمدة"
            value={approvedCount}
            icon="✅"
          />

          <StatCard
            title="الساعات المسجلة"
            value={submittedHoursTotal}
            icon="🕒"
          />

          <StatCard
            title="مرفوضة"
            value={rejectedCount}
            icon="❌"
          />

          <StatCard
            title="إجمالي الساعات المعتمدة"
            value={approvedHoursTotal}
            icon="📊"
          />

        </section>
        )}

        {/* Search & Filters */}
        <section className="mt-5 rounded-2xl border border-molim bg-molim-surface p-4">

          <label className="mb-2 block text-sm font-semibold">
            البحث
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="ابحث باسم المتطوع، المهمة أو Molim ID..."
            className="h-12 w-full rounded-xl border border-molim bg-molim-soft px-4 text-sm outline-none transition focus:border-[#ed542f] focus:ring-2 focus:ring-[#ed542f]/10"
          />

          <div className="mt-4 flex flex-wrap gap-2">

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
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

        {/* Records */}
        <section className="mt-5">

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              السجلات
            </h2>

            <span className="text-sm text-molim-muted">
              {filteredRecords.length} سجل
            </span>
          </div>

          {filteredRecords.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-molim bg-molim-surface p-10 text-center">
              <p className="font-semibold">
                لا توجد سجلات
              </p>

              <p className="mt-2 text-sm text-molim-muted">
                لا توجد سجلات مطابقة للبحث أو الحالة.
              </p>
            </div>

          ) : (

            <div className="space-y-3">

              {filteredRecords.map((record) => (

                <button
                  key={record.id}
                  type="button"
                  onClick={() => openRecord(record)}
                  className="block w-full cursor-pointer rounded-2xl border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {record.volunteer}
                        </h3>

                        <span className="rounded-lg bg-molim-soft px-2 py-1 text-xs text-molim-muted">
                          {record.molimId}
                        </span>

                        <span
                          className={`rounded-lg border px-2 py-1 text-xs font-medium ${statusStyle(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>

                      </div>

                      <p className="mt-2 text-sm font-medium text-molim-foreground">
                        {record.task}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">

                        <span>
                          القسم: {record.department}
                        </span>

                        <span>
                          تاريخ التسجيل: {record.date}
                        </span>

                        <span>
                          الساعات المسجلة:{" "}
                          {record.submittedHours}
                        </span>

                        {record.status === "معتمدة" && (
                          <span>
                            الساعات المعتمدة:{" "}
                            {record.approvedHours}
                          </span>
                        )}

                        {record.reviewer && (
                          <span>
                            {record.status === "معتمدة"
                              ? "اعتمدها"
                              : "رفضها"}
                            : {record.reviewer}
                          </span>
                        )}

                      </div>
                    </div>

                    <div className="shrink-0 text-sm font-semibold text-[#ed542f]">
                      {!isVolunteer && record.status === "قيد المراجعة"
                        ? "مراجعة السجل ←"
                        : "عرض التفاصيل ←"}
                    </div>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>
      </div>

      {/* Review Modal */}
      {selectedRecord && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRecord();
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-molim-surface p-5 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm text-molim-muted">
                  تفاصيل سجل الساعات
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedRecord.volunteer}
                </h2>

                <p className="mt-1 text-xs text-molim-muted">
                  {selectedRecord.molimId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRecord}
                className="cursor-pointer rounded-xl bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              {/* Task */}
              <div className="rounded-2xl bg-molim-soft p-4">

                <p className="text-xs text-molim-muted">
                  المهمة
                </p>

                <p className="mt-1 font-bold">
                  {selectedRecord.task}
                </p>

                <p className="mt-3 text-sm leading-6 text-molim-muted">
                  {selectedRecord.description}
                </p>

              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">

                <InfoBox
                  title="القسم"
                  value={selectedRecord.department}
                />

                <InfoBox
                  title="تاريخ التسجيل"
                  value={selectedRecord.date}
                />

                <InfoBox
                  title="الساعات المسجلة"
                  value={`${selectedRecord.submittedHours} ساعة`}
                />

                <InfoBox
                  title="الحالة"
                  value={selectedRecord.status}
                />

              </div>

              {/* Reviewer */}
              {selectedRecord.reviewer && (
                <div className="rounded-2xl border border-molim bg-molim-surface p-4">

                  <p className="text-xs text-molim-muted">
                    {selectedRecord.status === "معتمدة"
                      ? "الشخص الذي اعتمد الساعات"
                      : "الشخص الذي رفض الساعات"}
                  </p>

                  <p className="mt-1 font-bold">
                    {selectedRecord.reviewer}
                  </p>

                  {selectedRecord.reviewedAt && (
                    <p className="mt-1 text-xs text-molim-muted">
                      بتاريخ {selectedRecord.reviewedAt}
                    </p>
                  )}

                </div>
              )}

              {/* Review controls */}
              {selectedRecord.status === "قيد المراجعة" ? (
                isVolunteer ? (
                  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm font-semibold text-yellow-800">
                      بانتظار المراجعة
                    </p>

                    <p className="mt-1 text-xs leading-5 text-yellow-700">
                      سجلّك هذا بانتظار مراجعة الجهة المختصة
                      واعتماد الساعات.
                    </p>
                  </div>
                ) : (
                <>
                  <div>

                    <label
                      htmlFor="approvedHours"
                      className="mb-2 block text-sm font-semibold"
                    >
                      الساعات المعتمدة
                    </label>

                    <input
                      id="approvedHours"
                      type="number"
                      min="0"
                      max={selectedRecord.submittedHours}
                      value={approvedHours}
                      onChange={(event) =>
                        setApprovedHours(event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-molim bg-molim-soft px-4 outline-none transition focus:border-[#ed542f]"
                    />

                    <p className="mt-2 text-xs text-molim-muted">
                      لا يمكن اعتماد ساعات أكثر من الساعات
                      المسجلة.
                    </p>

                  </div>

                  <div>

                    <label
                      htmlFor="reviewNotes"
                      className="mb-2 block text-sm font-semibold"
                    >
                      ملاحظات المراجع
                    </label>

                    <textarea
                      id="reviewNotes"
                      rows={4}
                      value={reviewNotes}
                      onChange={(event) =>
                        setReviewNotes(event.target.value)
                      }
                      placeholder="اكتب ملاحظات المراجعة..."
                      className="w-full resize-none rounded-xl border border-molim bg-molim-soft p-4 text-sm outline-none transition focus:border-[#ed542f]"
                    />

                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={() => reviewRecord("معتمدة")}
                      className="h-12 cursor-pointer rounded-xl bg-green-600 font-semibold text-white hover:bg-green-700"
                    >
                      ✅ اعتماد الساعات
                    </button>

                    <button
                      type="button"
                      onClick={() => reviewRecord("مرفوضة")}
                      className="h-12 cursor-pointer rounded-xl bg-red-600 font-semibold text-white hover:bg-red-700"
                    >
                      ❌ رفض الساعات
                    </button>

                  </div>
                </>
                )
              ) : (

                /* Approved / Rejected */
                <>

                  {selectedRecord.status === "معتمدة" && (
                    <div className="rounded-2xl bg-green-50 p-4">

                      <p className="text-xs text-green-700">
                        الساعات المعتمدة
                      </p>

                      <p className="mt-1 text-2xl font-bold text-green-800">
                        {selectedRecord.approvedHours} ساعة
                      </p>

                    </div>
                  )}

                  {selectedRecord.notes && (
                    <div className="rounded-2xl bg-molim-soft p-4">

                      <p className="text-xs text-molim-muted">
                        ملاحظات المراجع
                      </p>

                      <p className="mt-2 text-sm leading-6 text-molim-foreground">
                        {selectedRecord.notes}
                      </p>

                    </div>
                  )}

                </>

              )}

              <button
                type="button"
                onClick={closeRecord}
                className="h-12 w-full cursor-pointer rounded-xl border border-molim bg-molim-surface font-semibold text-molim-foreground hover:bg-molim-soft"
              >
                إغلاق
              </button>

            </div>
          </div>
        </div>
      )}
    </main>
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
    <div className="rounded-2xl border border-molim bg-molim-surface p-4">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs leading-5 text-molim-muted">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-molim-soft px-2.5 py-2">
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
    <div className="rounded-2xl border border-molim p-4">

      <p className="text-xs text-molim-muted">
        {title}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>

    </div>
  );
}