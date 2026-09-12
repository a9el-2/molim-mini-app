"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "../lib/auth-context";

type TaskStatus =
  | "قيد العمل"
  | "للمراجعة"
  | "مكتملة"
  | "متوقفة";

type Task = {
  id: number;
  title: string;
  description: string;
  department: string;
  assignedTo: string;
  createdBy: string;
  hours: number;
  dueDate: string;
  status: TaskStatus;
};

type TaskView = "my" | "department" | "all";

const tasks: Task[] = [
  {
    id: 1,
    title: "تصميم منشور عن المنح الدراسية",
    description: "إعداد تصميم مناسب للنشر في حسابات فريق مُلم.",
    department: "الإعلام",
    assignedTo: "محمد أحمد",
    createdBy: "أصيل",
    hours: 3,
    dueDate: "اليوم",
    status: "قيد العمل",
  },
  {
    id: 2,
    title: "تحديث قائمة المنح",
    description: "مراجعة البيانات وتحديث المعلومات الخاصة بالمنح.",
    department: "البحث",
    assignedTo: "خالد علي",
    createdBy: "أصيل",
    hours: 2,
    dueDate: "غدًا",
    status: "للمراجعة",
  },
  {
    id: 3,
    title: "إعداد تقرير أسبوعي",
    description: "تجهيز تقرير مختصر عن أعمال القسم خلال الأسبوع.",
    department: "الإدارة",
    assignedTo: "أصيل",
    createdBy: "أصيل",
    hours: 4,
    dueDate: "28 أغسطس",
    status: "مكتملة",
  },
  {
    id: 4,
    title: "مراجعة محتوى القناة",
    description: "مراجعة المنشورات والتأكد من سلامة المعلومات.",
    department: "الإعلام",
    assignedTo: "سارة محمد",
    createdBy: "خالد علي",
    hours: 2,
    dueDate: "موقوفة مؤقتًا",
    status: "متوقفة",
  },
  {
    id: 5,
    title: "جمع فرص دراسية جديدة",
    description: "البحث عن فرص ومنح جديدة مناسبة للطلاب.",
    department: "البحث",
    assignedTo: "أصيل",
    createdBy: "أصيل",
    hours: 3,
    dueDate: "بعد يومين",
    status: "قيد العمل",
  },
  {
    id: 6,
    title: "مراجعة بيانات المتطوعين",
    description: "التأكد من اكتمال بيانات المتطوعين المسجلين.",
    department: "الموارد البشرية",
    assignedTo: "أصيل",
    createdBy: "أصيل",
    hours: 2,
    dueDate: "غدًا",
    status: "للمراجعة",
  },
];

const statusFilters: (TaskStatus | "الكل")[] = [
  "الكل",
  "قيد العمل",
  "للمراجعة",
  "مكتملة",
  "متوقفة",
];

export default function TasksPage() {
  const { user: currentUser } = useAuth();

  const [activeView, setActiveView] = useState<TaskView>("my");
  const [activeStatus, setActiveStatus] =
    useState<TaskStatus | "الكل">("الكل");

  const isVolunteer = currentUser.role === "VOLUNTEER";
  const isDepartmentHead =
    currentUser.role === "DEPARTMENT_HEAD";
  const isUpperManagement =
    currentUser.role === "ADMIN" ||
    currentUser.role === "SUPER_ADMIN";

  const canAddTask =
    isVolunteer || isDepartmentHead || isUpperManagement;

  const availableViews: {
    id: TaskView;
    label: string;
  }[] = [
    {
      id: "my",
      label: "مهامي",
    },

    ...(isDepartmentHead
      ? [
          {
            id: "department" as TaskView,
            label: "مهام القسم",
          },
        ]
      : []),

    ...(isUpperManagement
      ? [
          {
            id: "department" as TaskView,
            label: "مهام القسم",
          },
          {
            id: "all" as TaskView,
            label: "جميع المهام",
          },
        ]
      : []),
  ];

  const uniqueViews = availableViews.filter(
    (view, index, array) =>
      array.findIndex(
        (item) => item.id === view.id
      ) === index
  );

  const visibleTasks = useMemo(() => {
    let result = tasks;

    if (activeView === "my") {
      result = result.filter(
        (task) =>
          task.assignedTo === currentUser.name
      );
    }

    if (activeView === "department") {
      result = result.filter(
        (task) =>
          task.department === currentUser.department
      );
    }

    if (activeView === "all") {
      result = result;
    }

    if (activeStatus !== "الكل") {
      result = result.filter(
        (task) =>
          task.status === activeStatus
      );
    }

    return result;
  }, [
    activeView,
    activeStatus,
    currentUser.name,
    currentUser.department,
  ]);

  const totalHours = visibleTasks.reduce(
    (total, task) => total + task.hours,
    0
  );

  const pendingCount = visibleTasks.filter(
    (task) =>
      task.status === "قيد العمل" ||
      task.status === "للمراجعة"
  ).length;

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
            clipPath:
              "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-24 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-14 pt-7">
        {/* الهيدر */}
        <header className="flex items-center justify-between border-b border-[#202124]/10 pb-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
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
            className="flex h-10 w-10 items-center justify-center border border-molim bg-molim-soft text-lg"
            aria-label="الإشعارات"
          >
            🔔
          </Link>
        </header>

        {/* العنوان */}
        <section className="mt-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#ed542f]">
                إدارة العمل
              </p>

              <h2 className="mt-2 text-3xl font-black text-molim-foreground">
                المهام
              </h2>
            </div>

            {canAddTask && (
              <Link
                href="/add-task"
                className="flex h-11 shrink-0 items-center justify-center bg-[#ed542f] px-4 text-sm font-black text-white transition hover:opacity-90"
              >
                + إضافة مهمة
              </Link>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-molim-muted">
            {isVolunteer
              ? "شاهد المهام المسندة إليك فقط وسجّل المهمة التي أنجزتها."
              : isDepartmentHead
              ? "تابع مهامك ومهام أعضاء قسمك، وأضف المهام التي تحتاجها."
              : "تابع جميع مهام الفريق ومهام الأقسام وأضف المهام حسب الحاجة."}
          </p>
        </section>

        {/* تبويبات المهام */}
        {uniqueViews.length > 1 && (
          <section className="mt-7">
            <p className="mb-3 text-xs font-bold text-molim-muted">
              قسم المهام
            </p>

            <div
              className={`grid gap-2 ${
                uniqueViews.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {uniqueViews.map((view) => {
                const selected =
                  activeView === view.id;

                return (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => {
                      setActiveView(view.id);
                      setActiveStatus("الكل");
                    }}
                    className={`border px-3 py-3 text-xs font-black transition ${
                      selected
                        ? "border-[#ed542f] bg-[#ed542f] text-white"
                        : "border-molim bg-molim-soft text-molim-muted hover:border-[#ed542f]"
                    }`}
                  >
                    {view.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* العرض الحالي */}
        <section className="mt-4 border-r-4 border-[#ed542f] bg-molim-soft px-4 py-3">
          <p className="text-[11px] text-molim-muted">
            العرض الحالي
          </p>

          <p className="mt-1 text-sm font-black text-molim-foreground">
            {activeView === "my"
              ? "مهامي"
              : activeView === "department"
              ? `مهام قسم ${currentUser.department}`
              : "جميع مهام الفريق"}
          </p>
        </section>

        {/* الإحصائيات */}
        <section className="mt-7 grid grid-cols-3 gap-px border border-molim bg-molim-soft">
          <div className="bg-molim-soft p-4">
            <p className="text-[11px] text-molim-muted">
              المهام
            </p>

            <p className="mt-2 text-2xl font-black text-molim-foreground">
              {visibleTasks.length}
            </p>
          </div>

          <div className="bg-molim-soft p-4">
            <p className="text-[11px] text-molim-muted">
              تحتاج متابعة
            </p>

            <p className="mt-2 text-2xl font-black text-[#ed542f]">
              {pendingCount}
            </p>
          </div>

          <div className="bg-molim-soft p-4">
            <p className="text-[11px] text-molim-muted">
              الساعات
            </p>

            <p className="mt-2 text-2xl font-black text-molim-foreground">
              {totalHours}
            </p>
          </div>
        </section>

        {/* الفلاتر */}
        <section className="mt-7">
          <p className="mb-3 text-xs font-bold text-molim-muted">
            حالة المهام
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusFilters.map((filter) => {
              const selected =
                activeStatus === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveStatus(filter)
                  }
                  className={`shrink-0 border px-4 py-2 text-xs font-bold transition ${
                    selected
                      ? "border-[#ed542f] bg-[#ed542f] text-white"
                      : "border-molim bg-molim-soft text-molim-muted hover:border-[#ed542f]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* قائمة المهام */}
        <section className="mt-5">
          {visibleTasks.length > 0 ? (
            <div className="space-y-3">
              {visibleTasks.map((task) => {
                const canEditThisTask =
                  task.createdBy ===
                  currentUser.name;

                return (
                  <article
                    key={task.id}
                    className="border border-molim bg-molim-soft p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-molim-foreground">
                          {task.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-molim-muted">
                          {task.description}
                        </p>
                      </div>

                      <StatusBadge
                        status={task.status}
                      />
                    </div>

                    {/* بيانات المهمة */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <TaskMeta
                        label="المسؤول"
                        value={task.assignedTo}
                      />

                      <TaskMeta
                        label="القسم"
                        value={task.department}
                      />

                      <TaskMeta
                        label="الساعات"
                        value={`${task.hours} ساعات`}
                      />

                      <TaskMeta
                        label="الاستحقاق"
                        value={task.dueDate}
                      />
                    </div>

                    {/* منشئ المهمة */}
                    <div className="mt-3 border-t border-molim pt-3">
                      <p className="text-[10px] text-molim-muted">
                        أنشأ المهمة
                      </p>

                      <p className="mt-1 text-xs font-bold text-molim-foreground">
                        {task.createdBy}
                      </p>
                    </div>

                    {/* حالة المهمة */}
                    <div className="mt-3">
                      {task.status === "قيد العمل" && (
                        <p className="text-[11px] font-bold text-[#ed542f]">
                          المهمة قيد التنفيذ.
                        </p>
                      )}

                      {task.status === "للمراجعة" && (
                        <p className="text-[11px] font-bold text-blue-600">
                          المهمة بانتظار المراجعة.
                        </p>
                      )}

                      {task.status === "مكتملة" && (
                        <p className="text-[11px] font-bold text-green-700">
                          تم إنجاز المهمة واعتمادها.
                        </p>
                      )}

                      {task.status === "متوقفة" && (
                        <p className="text-[11px] font-bold text-red-600">
                          المهمة متوقفة حاليًا.
                        </p>
                      )}
                    </div>

                    {/* تعديل المهمة */}
                    {canEditThisTask && (
                      <div className="mt-4">
                        <Link
                          href={`/add-task?edit=${task.id}`}
                          className="block border border-molim bg-molim-surface py-3 text-center text-xs font-black text-molim-foreground transition hover:border-[#ed542f]"
                        >
                          تعديل المهمة
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-molim bg-molim-soft p-8 text-center">
              <div className="text-3xl">
                📋
              </div>

              <p className="mt-3 text-sm font-black text-molim-foreground">
                لا توجد مهام هنا
              </p>

              <p className="mt-1 text-xs leading-5 text-molim-muted">
                لا توجد مهام مطابقة للعرض أو التصفية الحالية.
              </p>

              {canAddTask && (
                <Link
                  href="/add-task"
                  className="mt-5 inline-flex bg-[#ed542f] px-5 py-3 text-xs font-black text-white"
                >
                  + إضافة مهمة
                </Link>
              )}
            </div>
          )}
        </section>

        {/* شرح الصلاحيات */}
        <section className="mt-8 border-r-4 border-[#ed542f] bg-molim-soft px-5 py-4">
          <p className="text-xs font-black text-molim-foreground">
            📌 صلاحيات المهام
          </p>

          {isVolunteer && (
            <p className="mt-1 text-xs leading-6 text-molim-muted">
              ترى المهام المسندة إليك فقط. يمكنك إضافة مهمة،
              ولا يمكنك تعديل مهام أنشأها شخص آخر.
            </p>
          )}

          {isDepartmentHead && (
            <p className="mt-1 text-xs leading-6 text-molim-muted">
              لديك قسم «مهامي» وقسم «مهام القسم». يمكنك إضافة
              مهام لأعضاء قسمك، وتعديل المهام التي أنشأتها أنت فقط.
            </p>
          )}

          {isUpperManagement && (
            <p className="mt-1 text-xs leading-6 text-molim-muted">
              لديك «مهامي» و«مهام القسم» و«جميع المهام».
              ويمكنك إضافة المهام ومتابعتها على مستوى الفريق.
            </p>
          )}
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

function StatusBadge({
  status,
}: {
  status: TaskStatus;
}) {
  const styles: Record<TaskStatus, string> = {
    "قيد العمل":
      "bg-yellow-50 text-yellow-700 border-yellow-200",
    "للمراجعة":
      "bg-blue-50 text-blue-700 border-blue-200",
    مكتملة:
      "bg-green-50 text-green-700 border-green-200",
    متوقفة:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`shrink-0 border px-2 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function TaskMeta({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f3f1ec] p-3">
      <p className="text-[10px] text-molim-muted">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] font-bold text-molim-foreground">
        {value}
      </p>
    </div>
  );
}