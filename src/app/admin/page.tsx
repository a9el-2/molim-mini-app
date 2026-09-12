"use client";

import Link from "next/link";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../lib/auth-context";
import { ROLE_NAMES } from "../lib/roles";
import { requireRole } from "../lib/access";

const stats = [
  {
    title: "المتطوعون",
    value: "127",
  },
  {
    title: "الأقسام",
    value: "8",
  },
  {
    title: "إجمالي الساعات",
    value: "1,842",
  },
  {
    title: "إجمالي المهام",
    value: "356",
  },
];

const departments = [
  {
    name: "التصميم",
    volunteers: 18,
    hours: 320,
    pending: 4,
  },
  {
    name: "التسويق",
    volunteers: 24,
    hours: 410,
    pending: 7,
  },
  {
    name: "التقنية",
    volunteers: 16,
    hours: 285,
    pending: 3,
  },
  {
    name: "المحتوى",
    volunteers: 21,
    hours: 350,
    pending: 5,
  },
];

const pendingTasks = [
  {
    title: "تصميم منشور",
    volunteer: "أحمد محمد",
    hours: 3,
    reviewer: "رئيس قسم التصميم",
  },
  {
    title: "كتابة محتوى",
    volunteer: "سارة علي",
    hours: 4,
    reviewer: "رئيس قسم المحتوى",
  },
  {
    title: "تحديث صفحة المنصة",
    volunteer: "محمد خالد",
    hours: 2,
    reviewer: "رئيس قسم التقنية",
  },
];

export default function AdminPage() {
  const { user: currentUser } = useAuth();

  // حماية الصفحة:
  // الإدارة العليا والرئيس العام فقط
  requireRole(["ADMIN", "SUPER_ADMIN"], currentUser);

  const roleName = ROLE_NAMES[currentUser.role];

  return (
    <PageShell>
      {/* العنوان */}
      <section className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold text-molim-muted">
              لوحة الإدارة
            </p>

            <h1 className="mt-1 text-3xl font-black">
              مرحبًا، {currentUser.name}
            </h1>

            <p className="mt-2 text-sm font-bold text-molim-orange">
              {roleName}
            </p>
          </div>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
            >
              الرئيسية
            </Button>
          </Link>
        </div>
      </section>

      {/* الإحصائيات */}
      <section>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="p-5"
            >
              <p className="text-xs font-bold text-molim-muted">
                {stat.title}
              </p>

              <p className="mt-3 text-2xl font-black">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* المهام بانتظار المراجعة */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">
              المهام بانتظار المراجعة
            </h2>

            <p className="mt-1 text-xs text-molim-muted">
              المهام التي تحتاج إلى مراجعة واعتماد.
            </p>
          </div>

          <span className="border border-molim-orange bg-molim-soft px-3 py-2 text-xs font-black text-molim-orange">
            16 مهمة
          </span>
        </div>

        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <Card
              key={task.title}
              className="p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-black">
                    {task.title}
                  </h3>

                  <p className="mt-2 text-sm text-molim-muted">
                    المتطوع: {task.volunteer}
                  </p>

                  <p className="mt-1 text-sm text-molim-muted">
                    الساعات المطلوبة: {task.hours} ساعات
                  </p>
                </div>

                <div className="bg-molim-soft p-3">
                  <p className="text-[11px] text-molim-muted">
                    المسؤول عن المراجعة
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {task.reviewer}
                  </p>
                </div>

                <Link href="/task-review">
                  <Button
                    variant="primary"
                    className="w-full lg:w-auto"
                  >
                    مراجعة المهمة
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* أداء الأقسام */}
      <section className="mt-8">
        <div className="mb-3">
          <h2 className="text-lg font-black">
            أداء الأقسام
          </h2>

          <p className="mt-1 text-xs text-molim-muted">
            ملخص أداء الأقسام داخل الفريق.
          </p>
        </div>

        <Card className="overflow-hidden">
          {/* رأس الجدول */}
          <div className="hidden grid-cols-4 border-b border-molim bg-molim-soft p-4 text-xs font-black md:grid">
            <span>القسم</span>
            <span>المتطوعون</span>
            <span>الساعات</span>
            <span>بانتظار المراجعة</span>
          </div>

          {departments.map((department) => (
            <div
              key={department.name}
              className="grid gap-3 border-b border-molim p-4 last:border-b-0 md:grid-cols-4 md:items-center"
            >
              <div>
                <p className="text-sm font-black">
                  {department.name}
                </p>
              </div>

              <div className="flex justify-between md:block">
                <span className="text-xs text-molim-muted md:hidden">
                  المتطوعون
                </span>

                <span className="text-sm font-bold">
                  {department.volunteers}
                </span>
              </div>

              <div className="flex justify-between md:block">
                <span className="text-xs text-molim-muted md:hidden">
                  الساعات
                </span>

                <span className="text-sm font-bold">
                  {department.hours}
                </span>
              </div>

              <div className="flex justify-between md:block">
                <span className="text-xs text-molim-muted md:hidden">
                  بانتظار المراجعة
                </span>

                <span className="text-sm font-black text-molim-orange">
                  {department.pending}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* ملاحظة */}
      <Card
        soft
        className="mt-8 border-r-4 border-r-molim-orange p-5"
      >
        <p className="text-sm font-black">
          ملاحظة
        </p>

        <p className="mt-2 text-xs leading-6 text-molim-muted">
          هذه البيانات تجريبية حاليًا. عند ربط النظام بـ
          Notion ستظهر البيانات الحقيقية للمتطوعين والمهام
          والساعات.
        </p>
      </Card>
    </PageShell>
  );
}