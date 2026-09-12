"use client";

import { useMemo, useState } from "react";
import RoleGuard from "../components/RoleGuard";

type Period = "اليوم" | "هذا الأسبوع" | "هذا الشهر" | "مخصص";

type ReportType =
  | "المتطوعون"
  | "الأقسام"
  | "المهام"
  | "الساعات"
  | "الشهادات";

type VolunteerReport = {
  name: string;
  department: string;
  hours: number;
  tasks: number;
  certificates: number;
};

type DepartmentReport = {
  name: string;
  members: number;
  tasks: number;
  completedTasks: number;
  hours: number;
};

type TaskReport = {
  name: string;
  volunteer: string;
  department: string;
  hours: number;
  status: string;
};

const volunteerReports: VolunteerReport[] = [
  {
    name: "محمد أحمد",
    department: "الإدارة",
    hours: 52,
    tasks: 14,
    certificates: 1,
  },
  {
    name: "خالد علي",
    department: "الموارد البشرية",
    hours: 320,
    tasks: 28,
    certificates: 3,
  },
  {
    name: "أحمد خالد",
    department: "الإعلام",
    hours: 180,
    tasks: 21,
    certificates: 2,
  },
  {
    name: "سارة محمد",
    department: "البحث",
    hours: 185,
    tasks: 19,
    certificates: 0,
  },
];

const departmentReports: DepartmentReport[] = [
  {
    name: "الإدارة",
    members: 8,
    tasks: 14,
    completedTasks: 11,
    hours: 98,
  },
  {
    name: "الموارد البشرية",
    members: 6,
    tasks: 11,
    completedTasks: 9,
    hours: 76,
  },
  {
    name: "الإعلام",
    members: 10,
    tasks: 18,
    completedTasks: 15,
    hours: 124,
  },
  {
    name: "البحث",
    members: 5,
    tasks: 12,
    completedTasks: 8,
    hours: 92,
  },
];

const taskReports: TaskReport[] = [
  {
    name: "تنظيم ملفات الفريق",
    volunteer: "محمد أحمد",
    department: "الإدارة",
    hours: 4,
    status: "مكتملة",
  },
  {
    name: "تصميم منشورات المنصة",
    volunteer: "خالد علي",
    department: "الإدارة",
    hours: 6,
    status: "مكتملة",
  },
  {
    name: "البحث عن المنح",
    volunteer: "سارة محمد",
    department: "البحث",
    hours: 3,
    status: "قيد المراجعة",
  },
  {
    name: "إدارة محتوى القناة",
    volunteer: "محمد علي",
    department: "الإعلام",
    hours: 5,
    status: "مكتملة",
  },
];

const periods: Period[] = [
  "اليوم",
  "هذا الأسبوع",
  "هذا الشهر",
  "مخصص",
];

const reportTypes: ReportType[] = [
  "المتطوعون",
  "الأقسام",
  "المهام",
  "الساعات",
  "الشهادات",
];

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] =
    useState<Period>("هذا الشهر");

  const [selectedReport, setSelectedReport] =
    useState<ReportType>("المتطوعون");

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  const totalVolunteers = volunteerReports.length;

  const totalHours = volunteerReports.reduce(
    (total, item) => total + item.hours,
    0
  );

  const totalTasks = taskReports.length;

  const completedTasks = taskReports.filter(
    (item) => item.status === "مكتملة"
  ).length;

  const totalCertificates = volunteerReports.reduce(
    (total, item) => total + item.certificates,
    0
  );

  const filteredVolunteers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return volunteerReports.filter(
      (item) =>
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
    );
  }, [search]);

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return departmentReports.filter(
      (item) =>
        !query ||
        item.name.toLowerCase().includes(query)
    );
  }, [search]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return taskReports.filter(
      (item) =>
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.volunteer.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
    );
  }, [search]);

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
          <span>الإدارة</span>
          <span className="mx-2">←</span>
          <span className="font-semibold text-molim-foreground">
            التقارير
          </span>
        </div>

        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold">
            التقارير
          </h1>

          <p className="mt-2 text-sm leading-6 text-molim-muted">
            متابعة أداء الفريق وتحليل المتطوعين والمهام
            والساعات والشهادات.
          </p>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard
            title="المتطوعون"
            value={totalVolunteers}
            icon="👥"
          />

          <StatCard
            title="الساعات المعتمدة"
            value={totalHours}
            icon="⏱️"
          />

          <StatCard
            title="المهام"
            value={totalTasks}
            icon="📋"
          />

          <StatCard
            title="المهام المكتملة"
            value={completedTasks}
            icon="✅"
          />

          <StatCard
            title="الشهادات"
            value={totalCertificates}
            icon="🎓"
          />
        </section>

        {/* Period */}
        <section className="mt-5 border border-molim bg-molim-surface p-4">
          <label className="mb-2 block text-sm font-semibold">
            الفترة الزمنية
          </label>

          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() =>
                  setSelectedPeriod(period)
                }
                className={`cursor-pointer border px-4 py-2.5 text-sm font-medium transition ${
                  selectedPeriod === period
                    ? "border-[#ed542f] bg-[#ed542f] text-white"
                    : "border-molim bg-molim-surface text-molim-foreground hover:bg-molim-soft"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {selectedPeriod === "مخصص" && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  من
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) =>
                    setFromDate(event.target.value)
                  }
                  className="h-11 w-full border border-molim bg-molim-soft px-3 outline-none focus:border-[#ed542f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  إلى
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(event) =>
                    setToDate(event.target.value)
                  }
                  className="h-11 w-full border border-molim bg-molim-soft px-3 outline-none focus:border-[#ed542f]"
                />
              </div>
            </div>
          )}
        </section>

        {/* Report Type */}
        <section className="mt-5 border border-molim bg-molim-surface p-4">
          <p className="mb-3 text-sm font-semibold">
            نوع التقرير
          </p>

          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedReport(type)}
                className={`cursor-pointer border px-4 py-2.5 text-sm font-medium transition ${
                  selectedReport === type
                    ? "border-[#ed542f] bg-[#ed542f] text-white"
                    : "border-molim bg-molim-surface text-molim-foreground hover:bg-molim-soft"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Search */}
        <section className="mt-5 border border-molim bg-molim-surface p-4">
          <label className="mb-2 block text-sm font-semibold">
            البحث داخل التقرير
          </label>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="ابحث في البيانات..."
            className="h-12 w-full border border-molim bg-molim-soft px-4 text-sm outline-none focus:border-[#ed542f]"
          />
        </section>

        {/* Report Content */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              تقرير {selectedReport}
            </h2>

            <span className="text-sm text-molim-muted">
              {selectedPeriod}
            </span>
          </div>

          {/* Volunteers Report */}
          {selectedReport === "المتطوعون" && (
            <div className="space-y-3">
              {filteredVolunteers.map((volunteer) => (
                <div
                  key={volunteer.name}
                  className="border border-molim bg-molim-surface p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold">
                        {volunteer.name}
                      </h3>

                      <p className="mt-1 text-sm text-molim-muted">
                        {volunteer.department}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <MiniStat
                        title="الساعات"
                        value={volunteer.hours}
                      />

                      <MiniStat
                        title="المهام"
                        value={volunteer.tasks}
                      />

                      <MiniStat
                        title="الشهادات"
                        value={volunteer.certificates}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Departments Report */}
          {selectedReport === "الأقسام" && (
            <div className="space-y-3">
              {filteredDepartments.map((department) => (
                <div
                  key={department.name}
                  className="border border-molim bg-molim-surface p-4"
                >
                  <h3 className="font-bold">
                    {department.name}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <MiniStat
                      title="الأعضاء"
                      value={department.members}
                    />

                    <MiniStat
                      title="المهام"
                      value={department.tasks}
                    />

                    <MiniStat
                      title="المكتملة"
                      value={department.completedTasks}
                    />

                    <MiniStat
                      title="الساعات"
                      value={department.hours}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Report */}
          {selectedReport === "المهام" && (
            <div className="space-y-3">
              {filteredTasks.map((task, index) => (
                <div
                  key={`${task.name}-${index}`}
                  className="border border-molim bg-molim-surface p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-bold">
                        {task.name}
                      </h3>

                      <div className="mt-1 text-sm text-molim-muted">
                        {task.volunteer} —{" "}
                        {task.department}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span>
                        الساعات: {task.hours}
                      </span>

                      <span className="border border-molim bg-molim-soft px-2 py-1">
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hours Report */}
          {selectedReport === "الساعات" && (
            <div className="space-y-3">
              {volunteerReports.map((volunteer) => (
                <div
                  key={volunteer.name}
                  className="border border-molim bg-molim-surface p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold">
                        {volunteer.name}
                      </h3>

                      <p className="mt-1 text-xs text-molim-muted">
                        {volunteer.department}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="text-2xl font-bold">
                        {volunteer.hours}
                      </p>

                      <p className="text-xs text-molim-muted">
                        ساعة معتمدة
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certificates Report */}
          {selectedReport === "الشهادات" && (
            <div className="space-y-3">
              {volunteerReports.map((volunteer) => (
                <div
                  key={volunteer.name}
                  className="border border-molim bg-molim-surface p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold">
                        {volunteer.name}
                      </h3>

                      <p className="mt-1 text-xs text-molim-muted">
                        {volunteer.department}
                      </p>
                    </div>

                    <div className="text-left">
                      <p className="text-2xl font-bold">
                        {volunteer.certificates}
                      </p>

                      <p className="text-xs text-molim-muted">
                        شهادات
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedReport === "المتطوعون" &&
            filteredVolunteers.length === 0 && (
              <EmptyState />
            )}

          {selectedReport === "الأقسام" &&
            filteredDepartments.length === 0 && (
              <EmptyState />
            )}

          {selectedReport === "المهام" &&
            filteredTasks.length === 0 && (
              <EmptyState />
            )}
        </section>
      </div>
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

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="border border-molim bg-molim-soft px-3 py-2">
      <p className="text-xs text-molim-muted">
        {title}
      </p>

      <p className="mt-1 font-bold">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">
      <p className="font-semibold">
        لا توجد نتائج
      </p>

      <p className="mt-2 text-sm text-molim-muted">
        لا توجد بيانات مطابقة للبحث الحالي.
      </p>
    </div>
  );
}
