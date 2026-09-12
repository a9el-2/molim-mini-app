"use client";

import { useMemo, useState } from "react";
import RoleGuard from "../components/RoleGuard";

type DepartmentStatus = "نشط" | "متوقف";

type Department = {
  id: number;
  name: string;
  code: string;
  head: string;
  deputy: string;
  status: DepartmentStatus;
  description: string;
  members: number;
  tasks: number;
};

const initialDepartments: Department[] = [
  {
    id: 1,
    name: "الإدارة",
    code: "ADM",
    head: "أصيل",
    deputy: "محمد أحمد",
    status: "نشط",
    description:
      "الإشراف العام على أعمال الفريق ومتابعة سير العمل واتخاذ القرارات الإدارية.",
    members: 8,
    tasks: 14,
  },
  {
    id: 2,
    name: "الموارد البشرية",
    code: "HR",
    head: "خالد علي",
    deputy: "سارة محمد",
    status: "نشط",
    description:
      "إدارة شؤون المتطوعين والاتفاقيات والشهادات والمتابعة الإدارية.",
    members: 6,
    tasks: 11,
  },
  {
    id: 3,
    name: "الإعلام",
    code: "MED",
    head: "أحمد خالد",
    deputy: "محمد علي",
    status: "نشط",
    description:
      "إدارة المحتوى والتصميم والنشر والحسابات الإعلامية للفريق.",
    members: 10,
    tasks: 18,
  },
  {
    id: 4,
    name: "البحث",
    code: "RES",
    head: "سارة محمد",
    deputy: "عبدالله حسن",
    status: "متوقف",
    description:
      "البحث عن المنح والفرص التعليمية وتجميع المعلومات والتحقق منها.",
    members: 5,
    tasks: 7,
  },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "الكل" | DepartmentStatus
  >("الكل");

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [editMode, setEditMode] = useState(false);

  const [head, setHead] = useState("");
  const [deputy, setDeputy] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<DepartmentStatus>("نشط");

  const activeCount = departments.filter(
    (department) => department.status === "نشط"
  ).length;

  const stoppedCount = departments.filter(
    (department) => department.status === "متوقف"
  ).length;

  const membersCount = departments.reduce(
    (total, department) => total + department.members,
    0
  );

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return departments.filter((department) => {
      const matchesStatus =
        statusFilter === "الكل" ||
        department.status === statusFilter;

      const matchesSearch =
        !query ||
        department.name.toLowerCase().includes(query) ||
        department.code.toLowerCase().includes(query) ||
        department.head.toLowerCase().includes(query) ||
        department.deputy.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [departments, search, statusFilter]);

  function openDepartment(department: Department) {
    setSelectedDepartment(department);

    setHead(department.head);
    setDeputy(department.deputy);
    setDescription(department.description);
    setStatus(department.status);

    setEditMode(false);
  }

  function closeDepartment() {
    setSelectedDepartment(null);
    setEditMode(false);
  }

  function saveDepartment() {
    if (!selectedDepartment) return;

    setDepartments((current) =>
      current.map((department) =>
        department.id === selectedDepartment.id
          ? {
              ...department,
              head,
              deputy,
              description,
              status,
            }
          : department
      )
    );

    setSelectedDepartment((current) =>
      current
        ? {
            ...current,
            head,
            deputy,
            description,
            status,
          }
        : null
    );

    setEditMode(false);
  }

  function statusStyle(value: DepartmentStatus) {
    return value === "نشط"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-molim bg-molim-soft text-molim-muted";
  }

  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
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
            إدارة الأقسام
          </span>
        </div>

        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold">
            إدارة الأقسام
          </h1>

          <p className="mt-2 text-sm leading-6 text-molim-muted">
            إدارة أقسام الفريق ورؤساء الأقسام ونوابهم
            ومتابعة حالة كل قسم.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">

          <StatCard
            title="الأقسام النشطة"
            value={activeCount}
            icon="🏢"
          />

          <StatCard
            title="الأقسام المتوقفة"
            value={stoppedCount}
            icon="⏸️"
          />

          <StatCard
            title="إجمالي الأعضاء"
            value={membersCount}
            icon="👥"
          />

        </section>

        {/* Search + Filter */}
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
            placeholder="ابحث باسم القسم، الرمز أو رئيس القسم..."
            className="h-12 w-full border border-molim bg-molim-soft px-4 text-sm outline-none transition focus:border-[#ed542f]"
          />

          <div className="mt-4 flex flex-wrap gap-2">

            {(["الكل", "نشط", "متوقف"] as const).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`cursor-pointer border px-4 py-2.5 text-sm font-medium transition ${
                    statusFilter === filter
                      ? "border-[#ed542f] bg-[#ed542f] text-white"
                      : "border-molim bg-molim-surface text-molim-foreground hover:bg-molim-soft"
                  }`}
                >
                  {filter}
                </button>
              )
            )}

          </div>
        </section>

        {/* Departments */}
        <section className="mt-5">

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              الأقسام
            </h2>

            <span className="text-sm text-molim-muted">
              {filteredDepartments.length} قسم
            </span>
          </div>

          {filteredDepartments.length === 0 ? (

            <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">
              <p className="font-semibold">
                لا توجد أقسام
              </p>

              <p className="mt-2 text-sm text-molim-muted">
                لا توجد أقسام مطابقة للبحث أو الفلتر.
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              {filteredDepartments.map((department) => (

                <button
                  key={department.id}
                  type="button"
                  onClick={() =>
                    openDepartment(department)
                  }
                  className="block w-full cursor-pointer border border-molim bg-molim-surface p-5 text-right transition hover:border-[#ed542f] hover:shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {department.name}
                        </h3>

                        <span className="bg-molim-soft px-2 py-1 text-xs text-molim-muted">
                          {department.code}
                        </span>

                        <span
                          className={`border px-2 py-1 text-xs font-medium ${statusStyle(
                            department.status
                          )}`}
                        >
                          {department.status}
                        </span>

                      </div>

                      <p className="mt-3 text-sm text-molim-muted">
                        {department.description}
                      </p>
                    </div>

                    <span className="text-[#ed542f]">
                      ←
                    </span>

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="border border-molim p-3">
                      <p className="text-xs text-molim-muted">
                        رئيس القسم
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {department.head}
                      </p>
                    </div>

                    <div className="border border-molim p-3">
                      <p className="text-xs text-molim-muted">
                        نائب الرئيس
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {department.deputy}
                      </p>
                    </div>

                  </div>

                  <div className="mt-3 flex gap-4 text-xs text-molim-muted">

                    <span>
                      الأعضاء: {department.members}
                    </span>

                    <span>
                      المهام: {department.tasks}
                    </span>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>
      </div>

      {/* Department Modal */}
      {selectedDepartment && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDepartment();
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm text-molim-muted">
                  تفاصيل القسم
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedDepartment.name}
                </h2>

                <p className="mt-1 text-xs text-molim-muted">
                  رمز القسم: {selectedDepartment.code}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDepartment}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              {/* Members / Tasks */}
              <div className="grid grid-cols-2 gap-3">

                <InfoBox
                  title="عدد الأعضاء"
                  value={String(
                    selectedDepartment.members
                  )}
                />

                <InfoBox
                  title="عدد المهام"
                  value={String(
                    selectedDepartment.tasks
                  )}
                />

              </div>

              {/* Edit */}
              {editMode ? (

                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      رئيس القسم
                    </label>

                    <input
                      value={head}
                      onChange={(event) =>
                        setHead(event.target.value)
                      }
                      className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      نائب رئيس القسم
                    </label>

                    <input
                      value={deputy}
                      onChange={(event) =>
                        setDeputy(event.target.value)
                      }
                      className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      حالة القسم
                    </label>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as DepartmentStatus
                        )
                      }
                      className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                    >
                      <option value="نشط">نشط</option>
                      <option value="متوقف">متوقف</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      وصف القسم
                    </label>

                    <textarea
                      rows={4}
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      className="w-full resize-none border border-molim bg-molim-soft p-4 text-sm outline-none focus:border-[#ed542f]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      type="button"
                      onClick={saveDepartment}
                      className="h-12 cursor-pointer bg-[#ed542f] font-semibold text-white hover:bg-[#d94725]"
                    >
                      حفظ التغييرات
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="h-12 cursor-pointer border border-molim bg-molim-surface font-semibold hover:bg-molim-soft"
                    >
                      إلغاء
                    </button>

                  </div>
                </>

              ) : (

                <>
                  <InfoBox
                    title="رئيس القسم"
                    value={selectedDepartment.head}
                  />

                  <InfoBox
                    title="نائب رئيس القسم"
                    value={selectedDepartment.deputy}
                  />

                  <div className="border border-molim bg-molim-soft p-4">
                    <p className="text-xs text-molim-muted">
                      حالة القسم
                    </p>

                    <p className="mt-1 font-semibold">
                      {selectedDepartment.status}
                    </p>
                  </div>

                  <div className="border border-molim bg-molim-soft p-4">
                    <p className="text-xs text-molim-muted">
                      وصف القسم
                    </p>

                    <p className="mt-2 text-sm leading-6 text-molim-foreground">
                      {selectedDepartment.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="h-12 w-full cursor-pointer bg-[#ed542f] font-semibold text-white hover:bg-[#d94725]"
                  >
                    تعديل بيانات القسم
                  </button>
                </>

              )}

              {!editMode && (
                <button
                  type="button"
                  onClick={closeDepartment}
                  className="h-12 w-full cursor-pointer border border-molim bg-molim-surface font-semibold text-molim-foreground hover:bg-molim-soft"
                >
                  إغلاق
                </button>
              )}

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
          <p className="text-xs text-molim-muted">
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