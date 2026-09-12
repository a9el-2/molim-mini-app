"use client";

import { useState } from "react";

type WorkflowStatus = "مكتملة" | "جارية" | "لم تبدأ";

type WorkflowStep = {
  id: number;
  number: number;
  title: string;
  description: string;
  responsible: string;
  status: WorkflowStatus;
  nextAction: string;
};

const initialSteps: WorkflowStep[] = [
  {
    id: 1,
    number: 1,
    title: "دعوة الانضمام",
    description:
      "إنشاء دعوة انضمام وإرسال رمز الدعوة للمتقدم.",
    responsible: "الموارد البشرية",
    status: "مكتملة",
    nextAction: "بدء التسجيل",
  },
  {
    id: 2,
    number: 2,
    title: "التسجيل",
    description:
      "إكمال المتقدم بياناته الأساسية والمهارات والأدوات ورفع السيرة الذاتية.",
    responsible: "المتقدم",
    status: "مكتملة",
    nextAction: "مراجعة البيانات",
  },
  {
    id: 3,
    number: 3,
    title: "مراجعة البيانات",
    description:
      "مراجعة بيانات المتقدم والتأكد من اكتمال المعلومات.",
    responsible: "الموارد البشرية",
    status: "جارية",
    nextAction: "إرسال الاتفاقية",
  },
  {
    id: 4,
    number: 4,
    title: "اتفاقية التطوع",
    description:
      "اختيار مدة الاتفاقية وإتمام الموافقة الإلكترونية عليها.",
    responsible: "المتطوع",
    status: "لم تبدأ",
    nextAction: "اعتماد الانضمام",
  },
  {
    id: 5,
    number: 5,
    title: "اعتماد الانضمام",
    description:
      "اعتماد المتطوع وإصدار Molim ID وتحديد حالته كعضو في الفريق.",
    responsible: "الموارد البشرية",
    status: "لم تبدأ",
    nextAction: "تحديد القسم",
  },
  {
    id: 6,
    number: 6,
    title: "تحديد القسم",
    description:
      "تحديد القسم والرتبة المناسبة للمتطوع من خلال الإدارة المختصة.",
    responsible: "الموارد البشرية / الإدارة",
    status: "لم تبدأ",
    nextAction: "بدء العمل",
  },
  {
    id: 7,
    number: 7,
    title: "المهام",
    description:
      "إسناد المهام وتنفيذها وتسجيل الساعات المرتبطة بها.",
    responsible: "رئيس القسم / المتطوع",
    status: "لم تبدأ",
    nextAction: "مراجعة المهمة",
  },
  {
    id: 8,
    number: 8,
    title: "مراجعة المهام",
    description:
      "مراجعة المهمة والتأكد من إنجازها بالشكل المطلوب.",
    responsible: "رئيس القسم / الإدارة",
    status: "لم تبدأ",
    nextAction: "تسجيل الساعات",
  },
  {
    id: 9,
    number: 9,
    title: "الساعات التطوعية",
    description:
      "تسجيل الساعات الناتجة عن العمل التطوعي وإرسالها للمراجعة.",
    responsible: "المتطوع",
    status: "لم تبدأ",
    nextAction: "اعتماد الساعات",
  },
  {
    id: 10,
    number: 10,
    title: "اعتماد الساعات",
    description:
      "مراجعة الساعات واعتمادها أو رفضها مع تسجيل المراجع.",
    responsible: "المخول بالمراجعة",
    status: "لم تبدأ",
    nextAction: "استحقاق الشهادة",
  },
  {
    id: 11,
    number: 11,
    title: "الشهادات",
    description:
      "إتاحة طلب الشهادات وخطابات التوصية وفق الضوابط المعتمدة.",
    responsible: "الموارد البشرية",
    status: "لم تبدأ",
    nextAction: "إصدار الشهادة",
  },
];

export default function WorkflowPage() {
  const [steps, setSteps] =
    useState<WorkflowStep[]>(initialSteps);

  const [selectedStep, setSelectedStep] =
    useState<WorkflowStep | null>(null);

  const completedCount = steps.filter(
    (step) => step.status === "مكتملة"
  ).length;

  const activeCount = steps.filter(
    (step) => step.status === "جارية"
  ).length;

  const notStartedCount = steps.filter(
    (step) => step.status === "لم تبدأ"
  ).length;

  function openStep(step: WorkflowStep) {
    setSelectedStep(step);
  }

  function closeStep() {
    setSelectedStep(null);
  }

  function changeStatus(
    status: WorkflowStatus
  ) {
    if (!selectedStep) return;

    setSteps((current) =>
      current.map((step) =>
        step.id === selectedStep.id
          ? {
              ...step,
              status,
            }
          : step
      )
    );

    setSelectedStep((current) =>
      current
        ? {
            ...current,
            status,
          }
        : null
    );
  }

  function statusStyle(status: WorkflowStatus) {
    if (status === "مكتملة") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "جارية") {
      return "border-blue-200 bg-blue-50 text-blue-700";
    }

    return "border-molim bg-molim-soft text-molim-muted";
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
            سير العمل
          </span>
        </div>

        {/* Header */}
        <section className="mb-6">
          <h1 className="text-2xl font-bold">
            سير العمل
          </h1>

          <p className="mt-2 text-sm leading-6 text-molim-muted">
            توضيح مراحل العمل الأساسية داخل فريق مُلم
            والمسؤول عن كل مرحلة.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard
            title="مكتملة"
            value={completedCount}
            icon="✅"
          />

          <StatCard
            title="جارية"
            value={activeCount}
            icon="🔄"
          />

          <StatCard
            title="لم تبدأ"
            value={notStartedCount}
            icon="⏳"
          />
        </section>

        {/* Workflow */}
        <section className="mt-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              مراحل العمل
            </h2>

            <p className="mt-1 text-sm text-molim-muted">
              اضغط على أي مرحلة لعرض تفاصيلها.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id}>

                <button
                  type="button"
                  onClick={() => openStep(step)}
                  className="block w-full cursor-pointer border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">

                    {/* Number */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-molim bg-molim-soft font-bold">
                      {step.number}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-bold">
                          {step.title}
                        </h3>

                        <span
                          className={`border px-2 py-1 text-xs font-medium ${statusStyle(
                            step.status
                          )}`}
                        >
                          {step.status}
                        </span>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-molim-muted">
                        {step.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">
                        <span>
                          المسؤول: {step.responsible}
                        </span>

                        <span>
                          التالي: {step.nextAction}
                        </span>
                      </div>

                    </div>

                    <span className="shrink-0 text-[#ed542f]">
                      ←
                    </span>

                  </div>
                </button>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="mr-5 h-3 border-r border-molim" />
                )}

              </div>
            ))}
          </div>
        </section>

        {/* Important Rules */}
        <section className="mt-6 border border-molim bg-molim-soft p-4">
          <h2 className="font-semibold">
            قواعد أساسية
          </h2>

          <div className="mt-3 space-y-2 text-sm leading-6 text-molim-muted">
            <p>
              • لا توجد مهمة بدون مسؤول واضح.
            </p>

            <p>
              • الساعات لا تصبح معتمدة إلا بعد المراجعة.
            </p>

            <p>
              • تحديد القسم يتم من الإدارة أو الموارد البشرية
              وليس من المتطوع.
            </p>

            <p>
              • الإجراءات الإدارية الحساسة يجب أن تظهر في سجل
              العمليات.
            </p>
          </div>
        </section>
      </div>

      {/* Step Details Modal */}
      {selectedStep && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeStep();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm text-molim-muted">
                  المرحلة {selectedStep.number}
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {selectedStep.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeStep}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>

            </div>

            <div className="mt-5 space-y-4">

              <div className="border border-molim bg-molim-soft p-4">
                <p className="text-xs text-molim-muted">
                  وصف المرحلة
                </p>

                <p className="mt-2 text-sm leading-7 text-molim-foreground">
                  {selectedStep.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <InfoBox
                  title="المسؤول"
                  value={selectedStep.responsible}
                />

                <InfoBox
                  title="الخطوة التالية"
                  value={selectedStep.nextAction}
                />

              </div>

              <div className="border border-molim p-4">
                <p className="text-xs text-molim-muted">
                  الحالة الحالية
                </p>

                <p className="mt-1 font-semibold">
                  {selectedStep.status}
                </p>
              </div>

              {/* Demo Status Controls */}
              <div className="border border-molim bg-molim-soft p-4">

                <p className="mb-3 text-sm font-semibold">
                  تغيير حالة المرحلة
                </p>

                <div className="grid grid-cols-3 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus("لم تبدأ")
                    }
                    className="cursor-pointer border border-molim bg-molim-surface px-2 py-3 text-xs font-semibold hover:bg-molim-soft"
                  >
                    لم تبدأ
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus("جارية")
                    }
                    className="cursor-pointer border border-blue-200 bg-blue-50 px-2 py-3 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    جارية
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeStatus("مكتملة")
                    }
                    className="cursor-pointer border border-green-200 bg-green-50 px-2 py-3 text-xs font-semibold text-green-700 hover:bg-green-100"
                  >
                    مكتملة
                  </button>

                </div>
              </div>

              <button
                type="button"
                onClick={closeStep}
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