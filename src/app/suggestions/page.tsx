"use client";

import { useMemo, useState } from "react";

type SuggestionStatus =
  | "جديدة"
  | "قيد الدراسة"
  | "مقبولة"
  | "مرفوضة";

type Suggestion = {
  id: number;
  title: string;
  content: string;
  author: string;
  molimId: string;
  department: string;
  date: string;
  status: SuggestionStatus;
  reviewer: string;
  reviewedAt: string;
  notes: string;
};

type FilterType = "الكل" | SuggestionStatus;

const CURRENT_REVIEWER = "أصيل";

const initialSuggestions: Suggestion[] = [
  {
    id: 1,
    title: "إضافة صفحة للفرص التطوعية",
    content:
      "أقترح إضافة صفحة تجمع الفرص التطوعية المتاحة مع إمكانية تصنيفها حسب القسم.",
    author: "محمد أحمد",
    molimId: "MOL-00012",
    department: "الإدارة",
    date: "2026/09/01",
    status: "جديدة",
    reviewer: "",
    reviewedAt: "",
    notes: "",
  },
  {
    id: 2,
    title: "تنظيم اجتماعات الأقسام",
    content:
      "أقترح وضع موعد ثابت لاجتماعات الأقسام ومتابعة المهام الناتجة عنها.",
    author: "خالد علي",
    molimId: "MOL-00008",
    department: "الموارد البشرية",
    date: "2026/08/30",
    status: "قيد الدراسة",
    reviewer: "أصيل",
    reviewedAt: "2026/09/01",
    notes: "يتم دراسة المقترح مع رؤساء الأقسام.",
  },
  {
    id: 3,
    title: "نظام تقدير للمتطوعين",
    content:
      "إضافة نظام لتقدير المتطوعين المتميزين بشكل دوري بناءً على الأداء والالتزام.",
    author: "سارة محمد",
    molimId: "MOL-00015",
    department: "البحث",
    date: "2026/08/28",
    status: "مقبولة",
    reviewer: "أصيل",
    reviewedAt: "2026/08/29",
    notes: "تم قبول المقترح مبدئيًا وسيتم العمل عليه.",
  },
  {
    id: 4,
    title: "إضافة قناة إعلانات داخلية",
    content:
      "إضافة مساحة خاصة للإعلانات المهمة داخل المنصة لتسهيل وصول المعلومات للمتطوعين.",
    author: "محمد علي",
    molimId: "MOL-00019",
    department: "الإعلام",
    date: "2026/08/26",
    status: "مرفوضة",
    reviewer: "أصيل",
    reviewedAt: "2026/08/27",
    notes:
      "الوظيفة موجودة حاليًا ضمن نظام الإعلانات والتنبيهات.",
  },
];

const filters: FilterType[] = [
  "الكل",
  "جديدة",
  "قيد الدراسة",
  "مقبولة",
  "مرفوضة",
];

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(initialSuggestions);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("الكل");

  const [search, setSearch] = useState("");

  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  const [reviewNotes, setReviewNotes] = useState("");

  const newCount = suggestions.filter(
    (suggestion) => suggestion.status === "جديدة"
  ).length;

  const studyingCount = suggestions.filter(
    (suggestion) => suggestion.status === "قيد الدراسة"
  ).length;

  const acceptedCount = suggestions.filter(
    (suggestion) => suggestion.status === "مقبولة"
  ).length;

  const rejectedCount = suggestions.filter(
    (suggestion) => suggestion.status === "مرفوضة"
  ).length;

  const filteredSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suggestions.filter((suggestion) => {
      const matchesFilter =
        activeFilter === "الكل" ||
        suggestion.status === activeFilter;

      const matchesSearch =
        !query ||
        suggestion.title.toLowerCase().includes(query) ||
        suggestion.author.toLowerCase().includes(query) ||
        suggestion.molimId.toLowerCase().includes(query) ||
        suggestion.department.toLowerCase().includes(query) ||
        suggestion.content.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [suggestions, activeFilter, search]);

  function openSuggestion(suggestion: Suggestion) {
    setSelectedSuggestion(suggestion);
    setReviewNotes(suggestion.notes);
  }

  function closeSuggestion() {
    setSelectedSuggestion(null);
    setReviewNotes("");
  }

  function updateSuggestionStatus(
    newStatus: SuggestionStatus
  ) {
    if (!selectedSuggestion) return;

    const reviewedDate =
      new Date().toLocaleDateString("ar-SA");

    setSuggestions((current) =>
      current.map((suggestion) =>
        suggestion.id === selectedSuggestion.id
          ? {
              ...suggestion,
              status: newStatus,
              reviewer: CURRENT_REVIEWER,
              reviewedAt: reviewedDate,
              notes: reviewNotes.trim(),
            }
          : suggestion
      )
    );

    closeSuggestion();
    setActiveFilter(newStatus);
  }

  function statusStyle(status: SuggestionStatus) {
    if (status === "جديدة") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (status === "قيد الدراسة") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "مقبولة") {
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
          <span>الإدارة</span>
          <span className="mx-2">←</span>
          <span className="font-semibold text-molim-foreground">
            الاقتراحات
          </span>
        </div>

        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold">
            الاقتراحات
          </h1>

          <p className="mt-2 text-sm leading-6 text-molim-muted">
            متابعة اقتراحات أعضاء الفريق ودراستها واتخاذ
            الإجراء المناسب بشأنها.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">

          <StatCard
            title="جديدة"
            value={newCount}
            icon="💡"
          />

          <StatCard
            title="قيد الدراسة"
            value={studyingCount}
            icon="🔎"
          />

          <StatCard
            title="مقبولة"
            value={acceptedCount}
            icon="✅"
          />

          <StatCard
            title="مرفوضة"
            value={rejectedCount}
            icon="❌"
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
            placeholder="ابحث بعنوان الاقتراح، اسم صاحبه أو Molim ID..."
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

        {/* Suggestions */}
        <section className="mt-5">

          <div className="mb-3 flex items-center justify-between">

            <h2 className="text-lg font-bold">
              الاقتراحات
            </h2>

            <span className="text-sm text-molim-muted">
              {filteredSuggestions.length} اقتراح
            </span>

          </div>

          {filteredSuggestions.length === 0 ? (

            <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">

              <p className="font-semibold">
                لا توجد اقتراحات
              </p>

              <p className="mt-2 text-sm text-molim-muted">
                لا توجد اقتراحات مطابقة للبحث أو الحالة.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredSuggestions.map((suggestion) => (

                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() =>
                    openSuggestion(suggestion)
                  }
                  className="block w-full cursor-pointer border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {suggestion.title}
                        </h3>

                        <span className="bg-molim-soft px-2 py-1 text-xs text-molim-muted">
                          {suggestion.author}
                        </span>

                        <span className="border border-molim bg-molim-soft px-2 py-1 text-xs text-molim-muted">
                          {suggestion.molimId}
                        </span>

                        <span
                          className={`border px-2 py-1 text-xs font-medium ${statusStyle(
                            suggestion.status
                          )}`}
                        >
                          {suggestion.status}
                        </span>

                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-molim-muted">
                        {suggestion.content}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">

                        <span>
                          القسم: {suggestion.department}
                        </span>

                        <span>
                          تاريخ التقديم: {suggestion.date}
                        </span>

                        {suggestion.reviewer && (
                          <span>
                            المراجع: {suggestion.reviewer}
                          </span>
                        )}

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

      {/* Suggestion Modal */}
      {selectedSuggestion && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSuggestion();
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-sm text-molim-muted">
                  تفاصيل الاقتراح
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedSuggestion.title}
                </h2>

                <p className="mt-1 text-xs text-molim-muted">
                  {selectedSuggestion.author} —{" "}
                  {selectedSuggestion.molimId}
                </p>

              </div>

              <button
                type="button"
                onClick={closeSuggestion}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              {/* Content */}
              <div className="border border-molim bg-molim-soft p-4">

                <p className="text-xs text-molim-muted">
                  محتوى الاقتراح
                </p>

                <p className="mt-2 text-sm leading-7 text-molim-foreground">
                  {selectedSuggestion.content}
                </p>

              </div>

              {/* Information */}
              <div className="grid grid-cols-2 gap-3">

                <InfoBox
                  title="صاحب الاقتراح"
                  value={selectedSuggestion.author}
                />

                <InfoBox
                  title="Molim ID"
                  value={selectedSuggestion.molimId}
                />

                <InfoBox
                  title="القسم"
                  value={selectedSuggestion.department}
                />

                <InfoBox
                  title="تاريخ التقديم"
                  value={selectedSuggestion.date}
                />

              </div>

              {/* Status */}
              <div className="border border-molim bg-molim-soft p-4">

                <p className="text-xs text-molim-muted">
                  الحالة الحالية
                </p>

                <p className="mt-1 font-semibold">
                  {selectedSuggestion.status}
                </p>

              </div>

              {/* Previous reviewer */}
              {selectedSuggestion.reviewer && (
                <div className="border border-molim bg-molim-surface p-4">

                  <p className="text-xs text-molim-muted">
                    آخر مراجع
                  </p>

                  <p className="mt-1 font-bold">
                    {selectedSuggestion.reviewer}
                  </p>

                  {selectedSuggestion.reviewedAt && (
                    <p className="mt-1 text-xs text-molim-muted">
                      بتاريخ {selectedSuggestion.reviewedAt}
                    </p>
                  )}

                </div>
              )}

              {/* Existing Notes */}
              {selectedSuggestion.notes && (
                <div className="border border-molim bg-molim-soft p-4">

                  <p className="text-xs text-molim-muted">
                    ملاحظات المراجعة
                  </p>

                  <p className="mt-2 text-sm leading-6 text-molim-foreground">
                    {selectedSuggestion.notes}
                  </p>

                </div>
              )}

              {/* Review */}
              {(selectedSuggestion.status === "جديدة" ||
                selectedSuggestion.status === "قيد الدراسة") && (

                <>
                  <div>

                    <label
                      htmlFor="suggestionNotes"
                      className="mb-2 block text-sm font-semibold"
                    >
                      ملاحظات الإدارة
                    </label>

                    <textarea
                      id="suggestionNotes"
                      rows={4}
                      value={reviewNotes}
                      onChange={(event) =>
                        setReviewNotes(event.target.value)
                      }
                      placeholder="اكتب ملاحظات الإدارة..."
                      className="w-full resize-none border border-molim bg-molim-soft p-4 text-sm outline-none transition focus:border-[#ed542f]"
                    />

                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <button
                      type="button"
                      onClick={() =>
                        updateSuggestionStatus(
                          "قيد الدراسة"
                        )
                      }
                      className="h-12 cursor-pointer bg-blue-600 font-semibold text-white hover:bg-blue-700"
                    >
                      🔎 دراسة
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateSuggestionStatus(
                          "مقبولة"
                        )
                      }
                      className="h-12 cursor-pointer bg-green-600 font-semibold text-white hover:bg-green-700"
                    >
                      ✅ قبول
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateSuggestionStatus(
                          "مرفوضة"
                        )
                      }
                      className="h-12 cursor-pointer bg-red-600 font-semibold text-white hover:bg-red-700"
                    >
                      ❌ رفض
                    </button>

                  </div>

                </>
              )}

              <button
                type="button"
                onClick={closeSuggestion}
                className="h-12 w-full cursor-pointer border border-molim bg-molim-surface font-semibold text-molim-foreground hover:bg-molim-soft"
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