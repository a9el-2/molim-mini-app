"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RoleGuard from "../components/RoleGuard";

type InvitationStatus =
  | "فعالة"
  | "مستخدمة"
  | "منتهية"
  | "ملغاة";

type Invitation = {
  id: number;
  code: string;
  status: InvitationStatus;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  linkedVolunteer: string;
  linkedMolimId: string;
  usedAt: string;
};

type FilterType = "الكل" | InvitationStatus;

const initialInvitations: Invitation[] = [
  {
    id: 1,
    code: "MOLIM-7K4P9",
    status: "فعالة",
    createdBy: "أصيل",
    createdAt: "2026/09/03",
    expiresAt: "2026/09/05",
    linkedVolunteer: "غير مرتبط",
    linkedMolimId: "-",
    usedAt: "",
  },
  {
    id: 2,
    code: "MOLIM-2F8Q1",
    status: "مستخدمة",
    createdBy: "خالد علي",
    createdAt: "2026/08/30",
    expiresAt: "2026/09/01",
    linkedVolunteer: "محمد أحمد",
    linkedMolimId: "MOL-00012",
    usedAt: "2026/08/31",
  },
  {
    id: 3,
    code: "MOLIM-9D3L6",
    status: "منتهية",
    createdBy: "أصيل",
    createdAt: "2026/08/20",
    expiresAt: "2026/08/22",
    linkedVolunteer: "غير مرتبط",
    linkedMolimId: "-",
    usedAt: "",
  },
  {
    id: 4,
    code: "MOLIM-5X2N8",
    status: "ملغاة",
    createdBy: "أصيل",
    createdAt: "2026/08/18",
    expiresAt: "2026/08/20",
    linkedVolunteer: "غير مرتبط",
    linkedMolimId: "-",
    usedAt: "",
  },
];

const filters: FilterType[] = [
  "الكل",
  "فعالة",
  "مستخدمة",
  "منتهية",
  "ملغاة",
];

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "MOLIM-";

  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("الكل");

  const [search, setSearch] = useState("");

  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [expirationDays, setExpirationDays] =
    useState("2");

  const [linkedVolunteer, setLinkedVolunteer] =
    useState("غير مرتبط");

  const activeCount = invitations.filter(
    (invitation) => invitation.status === "فعالة"
  ).length;

  const usedCount = invitations.filter(
    (invitation) => invitation.status === "مستخدمة"
  ).length;

  const expiredCount = invitations.filter(
    (invitation) => invitation.status === "منتهية"
  ).length;

  const cancelledCount = invitations.filter(
    (invitation) => invitation.status === "ملغاة"
  ).length;

  const filteredInvitations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return invitations.filter((invitation) => {
      const matchesFilter =
        activeFilter === "الكل" ||
        invitation.status === activeFilter;

      const matchesSearch =
        !query ||
        invitation.code.toLowerCase().includes(query) ||
        invitation.createdBy.toLowerCase().includes(query) ||
        invitation.linkedVolunteer
          .toLowerCase()
          .includes(query) ||
        invitation.linkedMolimId
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [invitations, activeFilter, search]);

  function createInvitation() {
    const days = Math.max(
      1,
      Number(expirationDays) || 2
    );

    const createdDate = new Date();

    const expiresDate = new Date(createdDate);
    expiresDate.setDate(
      expiresDate.getDate() + days
    );

    const newInvitation: Invitation = {
      id: Date.now(),
      code: generateCode(),
      status: "فعالة",
      createdBy: "أصيل",
      createdAt: createdDate.toLocaleDateString(
        "ar-SA"
      ),
      expiresAt: expiresDate.toLocaleDateString(
        "ar-SA"
      ),
      linkedVolunteer,
      linkedMolimId: "-",
      usedAt: "",
    };

    setInvitations((current) => [
      newInvitation,
      ...current,
    ]);

    setShowCreateForm(false);
    setExpirationDays("2");
    setLinkedVolunteer("غير مرتبط");
    setActiveFilter("فعالة");
  }

  function cancelInvitation() {
    if (!selectedInvitation) return;

    setInvitations((current) =>
      current.map((invitation) =>
        invitation.id === selectedInvitation.id
          ? {
              ...invitation,
              status: "ملغاة",
            }
          : invitation
      )
    );

    setSelectedInvitation((current) =>
      current
        ? {
            ...current,
            status: "ملغاة",
          }
        : null
    );
  }

  function copyCode(code: string) {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(code);
    }
  }

  function statusStyle(status: InvitationStatus) {
    if (status === "فعالة") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "مستخدمة") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    if (status === "منتهية") {
      return "border-molim bg-molim-soft text-molim-foreground";
    }

    return "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <RoleGuard>
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-molim-soft px-4 py-5 text-molim-foreground"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-12 top-14 h-44 w-44 rotate-12 border-2 border-[#ed542f]/10" />

        <div className="absolute left-[-25px] top-72 h-32 w-32 -rotate-12 border border-[#202124]/10" />

        <div
          className="absolute left-8 top-36 h-24 w-24 border border-[#ed542f]/10"
          style={{
            clipPath:
              "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-24 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />
      </div>

      <div className="relative mx-auto max-w-md px-1 pb-14 pt-3">

        {/* Breadcrumb */}
        <div className="mb-5 text-xs text-molim-muted">
          <Link
            href="/"
            className="hover:text-[#ed542f]"
          >
            الرئيسية
          </Link>

          <span className="mx-2">←</span>

          <span>الموارد البشرية</span>

          <span className="mx-2">←</span>

          <span className="font-bold text-molim-foreground">
            دعوات الانضمام
          </span>
        </div>

        {/* Header */}
        <section className="flex items-end justify-between gap-4 border-b border-molim pb-5">
          <div>
            <p className="text-sm font-bold text-[#ed542f]">
              الموارد البشرية
            </p>

            <h1 className="mt-2 text-3xl font-black text-molim-foreground">
              دعوات الانضمام
            </h1>

            <p className="mt-3 text-sm leading-7 text-molim-muted">
              إنشاء ومتابعة دعوات انضمام المتطوعين للفريق.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="shrink-0 bg-[#ed542f] px-4 py-3 text-xs font-black text-white"
          >
            + دعوة
          </button>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid grid-cols-2 gap-2">

          <StatCard
            title="فعالة"
            value={activeCount}
            note="دعوات صالحة"
            icon="✓"
          />

          <StatCard
            title="مستخدمة"
            value={usedCount}
            note="تم استخدامها"
            icon="→"
          />

          <StatCard
            title="منتهية"
            value={expiredCount}
            note="انتهت صلاحيتها"
            icon="!"
          />

          <StatCard
            title="ملغاة"
            value={cancelledCount}
            note="تم إلغاؤها"
            icon="×"
          />

        </section>

        {/* Search + Filters */}
        <section className="mt-7 border border-molim bg-molim-soft p-5">

          <label className="mb-2 block text-xs font-black">
            البحث
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="ابحث برمز الدعوة، اسم المتطوع أو Molim ID..."
            className="h-12 w-full border border-molim bg-molim-surface px-4 text-sm outline-none focus:border-[#ed542f]"
          />

          <div className="mt-4 flex flex-wrap gap-2">

            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`cursor-pointer border px-3 py-2 text-xs font-bold transition ${
                  activeFilter === filter
                    ? "border-[#ed542f] bg-[#ed542f] text-white"
                    : "border-molim bg-molim-surface text-molim-foreground hover:border-[#ed542f]"
                }`}
              >
                {filter}
              </button>
            ))}

          </div>
        </section>

        {/* Invitations */}
        <section className="mt-7">

          <div className="mb-3 flex items-end justify-between">

            <div>
              <h2 className="text-lg font-black text-molim-foreground">
                سجل الدعوات
              </h2>

              <p className="mt-1 text-xs text-molim-muted">
                {filteredInvitations.length} دعوة
              </p>
            </div>

          </div>

          {filteredInvitations.length === 0 ? (

            <div className="border border-dashed border-molim bg-molim-soft p-8 text-center">

              <p className="font-bold">
                لا توجد دعوات
              </p>

              <p className="mt-2 text-xs text-molim-muted">
                لا توجد نتائج مطابقة.
              </p>

            </div>

          ) : (

            <div className="space-y-2">

              {filteredInvitations.map((invitation) => (

                <button
                  key={invitation.id}
                  type="button"
                  onClick={() =>
                    setSelectedInvitation(invitation)
                  }
                  className="block w-full cursor-pointer border border-molim bg-molim-soft p-4 text-right transition hover:border-[#ed542f]"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-sm font-black tracking-wide text-molim-foreground">
                          {invitation.code}
                        </h3>

                        <span
                          className={`border px-2 py-1 text-[10px] font-bold ${statusStyle(
                            invitation.status
                          )}`}
                        >
                          {invitation.status}
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-molim-muted">

                        <span>
                          أنشأها: {invitation.createdBy}
                        </span>

                        <span>
                          الإنشاء: {invitation.createdAt}
                        </span>

                        <span>
                          الانتهاء: {invitation.expiresAt}
                        </span>

                      </div>

                      <p className="mt-2 text-xs text-molim-muted">
                        {invitation.linkedVolunteer ===
                        "غير مرتبط"
                          ? "غير مرتبطة بمتطوع بعد"
                          : `مرتبطة بـ ${invitation.linkedVolunteer} — ${invitation.linkedMolimId}`}
                      </p>

                    </div>

                    <span className="shrink-0 text-[#ed542f]">
                      ←
                    </span>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-molim pt-5 text-center">
          <p className="text-[10px] text-molim-muted">
            مُلم — إدارة دعوات الانضمام
          </p>
        </footer>
      </div>

      {/* Create Invitation Modal */}
      {showCreateForm && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreateForm(false);
            }
          }}
        >

          <div className="w-full max-w-md border border-molim bg-molim-soft p-5 shadow-2xl">

            <div className="flex items-start justify-between gap-3">

              <div>
                <p className="text-xs text-molim-muted">
                  دعوات الانضمام
                </p>

                <h2 className="mt-1 text-xl font-black text-molim-foreground">
                  إنشاء دعوة جديدة
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(false)
                }
                className="cursor-pointer border border-molim bg-molim-surface px-3 py-2 hover:border-[#ed542f]"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              <div>
                <label className="mb-2 block text-xs font-black">
                  مدة صلاحية الدعوة
                </label>

                <select
                  value={expirationDays}
                  onChange={(event) =>
                    setExpirationDays(
                      event.target.value
                    )
                  }
                  className="h-12 w-full border border-molim bg-molim-surface px-4 text-sm outline-none focus:border-[#ed542f]"
                >
                  <option value="1">
                    يوم واحد
                  </option>

                  <option value="2">
                    يومان
                  </option>

                  <option value="3">
                    3 أيام
                  </option>

                  <option value="7">
                    7 أيام
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black">
                  ربط الدعوة بمتطوع
                </label>

                <select
                  value={linkedVolunteer}
                  onChange={(event) =>
                    setLinkedVolunteer(
                      event.target.value
                    )
                  }
                  className="h-12 w-full border border-molim bg-molim-surface px-4 text-sm outline-none focus:border-[#ed542f]"
                >
                  <option value="غير مرتبط">
                    غير مرتبط
                  </option>

                  <option value="محمد أحمد">
                    محمد أحمد
                  </option>

                  <option value="خالد علي">
                    خالد علي
                  </option>

                  <option value="سارة محمد">
                    سارة محمد
                  </option>
                </select>
              </div>

              <div className="border border-molim bg-molim-surface p-4">
                <p className="text-xs font-black">
                  قواعد الدعوة
                </p>

                <p className="mt-2 text-[11px] leading-6 text-molim-muted">
                  الدعوة تستخدم مرة واحدة فقط، وبعد استخدامها
                  ترتبط بالحساب الذي أكمل التسجيل.
                </p>
              </div>

              <button
                type="button"
                onClick={createInvitation}
                className="h-12 w-full cursor-pointer bg-[#ed542f] text-sm font-black text-white hover:bg-[#d94725]"
              >
                إنشاء الدعوة
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Invitation Details Modal */}
      {selectedInvitation && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInvitation(null);
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border border-molim bg-molim-soft p-5 shadow-2xl">

            <div className="flex items-start justify-between gap-3">

              <div>
                <p className="text-xs text-molim-muted">
                  تفاصيل الدعوة
                </p>

                <h2 className="mt-1 text-xl font-black tracking-wide text-molim-foreground">
                  {selectedInvitation.code}
                </h2>

                <span
                  className={`mt-2 inline-block border px-2 py-1 text-[10px] font-bold ${statusStyle(
                    selectedInvitation.status
                  )}`}
                >
                  {selectedInvitation.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedInvitation(null)
                }
                className="cursor-pointer border border-molim bg-molim-surface px-3 py-2 hover:border-[#ed542f]"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-2">

              {/* Code */}
              <div className="border border-molim bg-molim-surface p-4">

                <p className="text-[10px] text-molim-muted">
                  رمز الدعوة
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">

                  <p className="text-lg font-black tracking-wider">
                    {selectedInvitation.code}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        selectedInvitation.code
                      )
                    }
                    className="cursor-pointer border border-molim bg-molim-surface px-3 py-2 text-xs font-bold hover:border-[#ed542f]"
                  >
                    نسخ
                  </button>

                </div>

              </div>

              <InfoBox
                title="الحالة"
                value={selectedInvitation.status}
              />

              <InfoBox
                title="أنشأها"
                value={selectedInvitation.createdBy}
              />

              <InfoBox
                title="تاريخ الإنشاء"
                value={selectedInvitation.createdAt}
              />

              <InfoBox
                title="تاريخ الانتهاء"
                value={selectedInvitation.expiresAt}
              />

              <InfoBox
                title="المتطوع المرتبط"
                value={selectedInvitation.linkedVolunteer}
              />

              {selectedInvitation.linkedMolimId !== "-" && (
                <InfoBox
                  title="Molim ID"
                  value={selectedInvitation.linkedMolimId}
                />
              )}

              {selectedInvitation.usedAt && (
                <InfoBox
                  title="تاريخ الاستخدام"
                  value={selectedInvitation.usedAt}
                />
              )}

              {/* Cancel */}
              {selectedInvitation.status === "فعالة" && (
                <button
                  type="button"
                  onClick={cancelInvitation}
                  className="mt-3 h-12 w-full cursor-pointer border border-red-200 bg-red-50 text-sm font-black text-red-700 hover:bg-red-100"
                >
                  إلغاء الدعوة
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setSelectedInvitation(null)
                }
                className="mt-2 h-12 w-full cursor-pointer border border-molim bg-molim-surface text-sm font-bold text-molim-foreground hover:border-[#ed542f]"
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
  note,
  icon,
}: {
  title: string;
  value: number;
  note: string;
  icon: string;
}) {
  return (
    <div className="border border-molim bg-molim-soft p-4">

      <div className="flex items-start justify-between">

        <p className="text-[10px] font-bold text-molim-muted">
          {title}
        </p>

        <span className="text-lg font-black text-[#ed542f]">
          {icon}
        </span>

      </div>

      <p className="mt-3 text-3xl font-black text-molim-foreground">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-molim-muted">
        {note}
      </p>

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
    <div className="border border-molim bg-molim-surface p-4">

      <p className="text-[10px] text-molim-muted">
        {title}
      </p>

      <p className="mt-1 text-sm font-bold text-molim-foreground">
        {value}
      </p>

    </div>
  );
}