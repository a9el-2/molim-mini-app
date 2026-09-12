"use client";

import { useMemo, useState } from "react";
import RoleGuard from "../components/RoleGuard";

type RequestStatus =
  | "قيد المراجعة"
  | "بانتظار الاعتماد"
  | "صادرة"
  | "مرفوضة";

type RequestType =
  | "شهادة التطوع"
  | "شهادة المشاركة"
  | "شهادة الخبرة"
  | "خطاب توصية";

type CertificateRequest = {
  id: number;
  volunteer: string;
  molimId: string;
  type: RequestType;
  status: RequestStatus;
  hours: number;
  volunteerPeriod: string;
  department: string;
  requestDate: string;
  departmentHead: string;
  evaluation: string;
  notes: string;
  reviewer: string;
  reviewedAt: string;
};

type FilterType =
  | "الكل"
  | "شهادات"
  | "خطابات توصية"
  | RequestStatus;

const CURRENT_REVIEWER = "أصيل";

const initialRequests: CertificateRequest[] = [
  {
    id: 1,
    volunteer: "محمد أحمد",
    molimId: "MOL-00012",
    type: "شهادة التطوع",
    status: "قيد المراجعة",
    hours: 52,
    volunteerPeriod: "3 أشهر",
    department: "الإدارة",
    requestDate: "2026/09/01",
    departmentHead: "أحمد خالد",
    evaluation: "أداء جيد والتزام مستمر بالمهام.",
    notes: "",
    reviewer: "",
    reviewedAt: "",
  },
  {
    id: 2,
    volunteer: "خالد علي",
    molimId: "MOL-00008",
    type: "شهادة الخبرة",
    status: "بانتظار الاعتماد",
    hours: 320,
    volunteerPeriod: "6 أشهر",
    department: "الإدارة",
    requestDate: "2026/08/30",
    departmentHead: "أحمد خالد",
    evaluation: "أداء ممتاز ومشاركة فعالة في مهام القسم.",
    notes: "الطلب مكتمل وينتظر الاعتماد.",
    reviewer: "الموارد البشرية",
    reviewedAt: "2026/08/31",
  },
  {
    id: 3,
    volunteer: "سارة محمد",
    molimId: "MOL-00015",
    type: "خطاب توصية",
    status: "قيد المراجعة",
    hours: 185,
    volunteerPeriod: "5 أشهر",
    department: "البحث",
    requestDate: "2026/08/29",
    departmentHead: "أصيل",
    evaluation: "ممتازة في البحث وتحليل المعلومات.",
    notes: "",
    reviewer: "",
    reviewedAt: "",
  },
  {
    id: 4,
    volunteer: "محمد علي",
    molimId: "MOL-00019",
    type: "شهادة المشاركة",
    status: "صادرة",
    hours: 68,
    volunteerPeriod: "4 أشهر",
    department: "الإعلام",
    requestDate: "2026/08/27",
    departmentHead: "أحمد خالد",
    evaluation: "مشاركة جيدة في أنشطة الفريق.",
    notes: "تم إصدار الشهادة.",
    reviewer: "أصيل",
    reviewedAt: "2026/08/28",
  },
  {
    id: 5,
    volunteer: "عبدالله حسن",
    molimId: "MOL-00021",
    type: "خطاب توصية",
    status: "مرفوضة",
    hours: 40,
    volunteerPeriod: "شهر واحد",
    department: "البحث",
    requestDate: "2026/08/25",
    departmentHead: "سارة محمد",
    evaluation: "المعلومات غير كافية لإصدار التوصية.",
    notes: "يحتاج المتطوع إلى مدة وتقييم أداء أكبر.",
    reviewer: "أصيل",
    reviewedAt: "2026/08/26",
  },
];

const filters: FilterType[] = [
  "الكل",
  "شهادات",
  "خطابات توصية",
  "قيد المراجعة",
  "بانتظار الاعتماد",
  "صادرة",
  "مرفوضة",
];

export default function CertificateRequestsPage() {
  const [requests, setRequests] =
    useState<CertificateRequest[]>(initialRequests);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("الكل");

  const [search, setSearch] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState<CertificateRequest | null>(null);

  const [reviewNotes, setReviewNotes] = useState("");

  const pendingCount = requests.filter(
    (request) => request.status === "قيد المراجعة"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "بانتظار الاعتماد"
  ).length;

  const issuedCount = requests.filter(
    (request) => request.status === "صادرة"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "مرفوضة"
  ).length;

  const totalCount = requests.length;

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      let matchesFilter = true;

      if (activeFilter === "شهادات") {
        matchesFilter = request.type !== "خطاب توصية";
      } else if (activeFilter === "خطابات توصية") {
        matchesFilter = request.type === "خطاب توصية";
      } else if (
        activeFilter !== "الكل"
      ) {
        matchesFilter = request.status === activeFilter;
      }

      const matchesSearch =
        !query ||
        request.volunteer.toLowerCase().includes(query) ||
        request.molimId.toLowerCase().includes(query) ||
        request.type.toLowerCase().includes(query) ||
        request.department.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [requests, activeFilter, search]);

  function openRequest(request: CertificateRequest) {
    setSelectedRequest(request);
    setReviewNotes(request.notes);
  }

  function closeRequest() {
    setSelectedRequest(null);
    setReviewNotes("");
  }

  function updateRequestStatus(
    newStatus:
      | "بانتظار الاعتماد"
      | "صادرة"
      | "مرفوضة"
  ) {
    if (!selectedRequest) return;

    const reviewedDate =
      new Date().toLocaleDateString("ar-SA");

    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: newStatus,
              notes: reviewNotes.trim(),
              reviewer: CURRENT_REVIEWER,
              reviewedAt: reviewedDate,
            }
          : request
      )
    );

    closeRequest();
    setActiveFilter(newStatus);
  }

  function getStatusStyle(status: RequestStatus) {
    if (status === "قيد المراجعة") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    if (status === "بانتظار الاعتماد") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "صادرة") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <RoleGuard>
    <main
      dir="rtl"
      className="min-h-screen bg-molim px-4 py-5 text-molim-foreground"
    >
      <div className="mx-auto max-w-5xl">

        {/* Breadcrumb */}
        <div className="mb-5 text-sm text-molim-muted">
          <span>الرئيسية</span>
          <span className="mx-2">←</span>
          <span>الموارد البشرية</span>
          <span className="mx-2">←</span>
          <span className="font-semibold text-molim-foreground">
            طلبات الشهادات والتوصيات
          </span>
        </div>

        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold">
            طلبات الشهادات والتوصيات
          </h1>

          <p className="mt-2 text-sm leading-6 text-molim-muted">
            مراجعة طلبات الشهادات وخطابات التوصية ومتابعة
            حالتها حتى الإصدار.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard
            title="قيد المراجعة"
            value={pendingCount}
            icon="⏳"
          />

          <StatCard
            title="بانتظار الاعتماد"
            value={approvedCount}
            icon="🕐"
          />

          <StatCard
            title="صادرة"
            value={issuedCount}
            icon="✅"
          />

          <StatCard
            title="مرفوضة"
            value={rejectedCount}
            icon="❌"
          />

          <StatCard
            title="إجمالي الطلبات"
            value={totalCount}
            icon="📄"
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
            placeholder="ابحث باسم المتطوع، Molim ID أو نوع الطلب..."
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

        {/* Requests */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              الطلبات
            </h2>

            <span className="text-sm text-molim-muted">
              {filteredRequests.length} طلب
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">
              <p className="font-semibold">
                لا توجد طلبات
              </p>

              <p className="mt-2 text-sm text-molim-muted">
                لا توجد طلبات مطابقة للبحث أو الفلتر.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((request) => (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => openRequest(request)}
                  className="block w-full cursor-pointer border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">
                          {request.volunteer}
                        </h3>

                        <span className="bg-molim-soft px-2 py-1 text-xs text-molim-muted">
                          {request.molimId}
                        </span>

                        <span className="bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                          {request.type}
                        </span>

                        <span
                          className={`border px-2 py-1 text-xs font-medium ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">
                        <span>
                          القسم: {request.department}
                        </span>

                        <span>
                          الساعات: {request.hours}
                        </span>

                        <span>
                          مدة التطوع: {request.volunteerPeriod}
                        </span>

                        <span>
                          تاريخ الطلب: {request.requestDate}
                        </span>
                      </div>

                      {request.reviewer && (
                        <p className="mt-2 text-xs text-molim-muted">
                          راجعه: {request.reviewer}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 text-sm font-semibold text-[#ed542f]">
                      {request.status === "قيد المراجعة"
                        ? "مراجعة الطلب ←"
                        : "عرض التفاصيل ←"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Request Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRequest();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-molim-muted">
                  تفاصيل الطلب
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedRequest.type}
                </h2>

                <p className="mt-1 text-xs text-molim-muted">
                  {selectedRequest.volunteer} —{" "}
                  {selectedRequest.molimId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRequest}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">

              {/* Volunteer */}
              <div className="grid grid-cols-2 gap-3">
                <InfoBox
                  title="المتطوع"
                  value={selectedRequest.volunteer}
                />

                <InfoBox
                  title="Molim ID"
                  value={selectedRequest.molimId}
                />

                <InfoBox
                  title="القسم"
                  value={selectedRequest.department}
                />

                <InfoBox
                  title="تاريخ الطلب"
                  value={selectedRequest.requestDate}
                />

                <InfoBox
                  title="الساعات المعتمدة"
                  value={`${selectedRequest.hours} ساعة`}
                />

                <InfoBox
                  title="مدة التطوع"
                  value={selectedRequest.volunteerPeriod}
                />
              </div>

              {/* Status */}
              <div className="border border-molim bg-molim-soft p-4">
                <p className="text-xs text-molim-muted">
                  حالة الطلب
                </p>

                <p className="mt-1 font-semibold">
                  {selectedRequest.status}
                </p>
              </div>

              {/* Recommendation-specific information */}
              {selectedRequest.type === "خطاب توصية" && (
                <>
                  <div className="border border-molim bg-molim-soft p-4">
                    <p className="text-xs text-molim-muted">
                      تقييم رئيس القسم
                    </p>

                    <p className="mt-2 text-sm leading-6 text-molim-foreground">
                      {selectedRequest.evaluation}
                    </p>
                  </div>

                  <InfoBox
                    title="رئيس القسم"
                    value={selectedRequest.departmentHead}
                  />
                </>
              )}

              {/* Certificate information */}
              {selectedRequest.type !== "خطاب توصية" && (
                <div className="border border-molim bg-molim-soft p-4">
                  <p className="text-xs text-molim-muted">
                    بيانات الاستحقاق
                  </p>

                  <p className="mt-2 text-sm leading-6 text-molim-foreground">
                    يتم التحقق من نوع الشهادة والساعات
                    المعتمدة ومدة المشاركة قبل الإصدار.
                  </p>
                </div>
              )}

              {/* Reviewer */}
              {selectedRequest.reviewer && (
                <div className="border border-molim bg-molim-surface p-4">
                  <p className="text-xs text-molim-muted">
                    آخر مراجع
                  </p>

                  <p className="mt-1 font-bold">
                    {selectedRequest.reviewer}
                  </p>

                  {selectedRequest.reviewedAt && (
                    <p className="mt-1 text-xs text-molim-muted">
                      بتاريخ {selectedRequest.reviewedAt}
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedRequest.notes && (
                <div className="border border-molim bg-molim-soft p-4">
                  <p className="text-xs text-molim-muted">
                    الملاحظات الحالية
                  </p>

                  <p className="mt-2 text-sm leading-6 text-molim-foreground">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Review */}
              {selectedRequest.status === "قيد المراجعة" && (
                <>
                  <div>
                    <label
                      htmlFor="certificateReviewNotes"
                      className="mb-2 block text-sm font-semibold"
                    >
                      ملاحظات المراجعة
                    </label>

                    <textarea
                      id="certificateReviewNotes"
                      rows={4}
                      value={reviewNotes}
                      onChange={(event) =>
                        setReviewNotes(event.target.value)
                      }
                      placeholder="اكتب ملاحظات المراجعة..."
                      className="w-full resize-none border border-molim bg-molim-soft p-4 text-sm outline-none transition focus:border-[#ed542f]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <button
                      type="button"
                      onClick={() =>
                        updateRequestStatus("بانتظار الاعتماد")
                      }
                      className="h-12 cursor-pointer bg-green-600 font-semibold text-white hover:bg-green-700"
                    >
                      ✅ قبول الطلب
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateRequestStatus("مرفوضة")
                      }
                      className="h-12 cursor-pointer bg-red-600 font-semibold text-white hover:bg-red-700"
                    >
                      ❌ رفض الطلب
                    </button>

                  </div>
                </>
              )}

              {/* HR can issue approved request */}
              {selectedRequest.status === "بانتظار الاعتماد" && (
                <button
                  type="button"
                  onClick={() =>
                    updateRequestStatus("صادرة")
                  }
                  className="h-12 w-full cursor-pointer bg-[#ed542f] font-semibold text-white hover:bg-[#d94725]"
                >
                  🎓 إصدار الشهادة / الخطاب
                </button>
              )}

              <button
                type="button"
                onClick={closeRequest}
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