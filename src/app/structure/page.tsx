import Link from "next/link";

const departments = [
  {
    name: "الإدارة",
    head: "أصيل",
    members: 4,
    description: "الإدارة العامة ومتابعة أعمال الفريق.",
  },
  {
    name: "الموارد البشرية",
    head: "غير محدد",
    members: 3,
    description: "شؤون المتطوعين والاتفاقيات والشهادات.",
  },
  {
    name: "الإعلام",
    head: "غير محدد",
    members: 5,
    description: "المحتوى والتصميم والنشر والإعلام.",
  },
];

export default function StructurePage() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-molim-soft text-molim-foreground"
    >
      {/* الخلفية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 top-16 h-48 w-48 rotate-12 border-2 border-[#ed542f]/10" />

        <div className="absolute left-[-30px] top-72 h-32 w-32 -rotate-12 border border-[#202124]/10" />

        <div
          className="absolute left-8 top-36 h-24 w-24 border border-[#ed542f]/10"
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-24 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-14 pt-7">
        {/* الهيدر */}
        <header className="flex items-center justify-between border-b border-[#202124]/10 pb-4">
          <Link href="/" className="flex items-center gap-3">
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
          <p className="text-sm font-bold text-[#ed542f]">
            الفريق
          </p>

          <h2 className="mt-2 text-3xl font-black text-molim-foreground">
            الهيكل الإداري
          </h2>

          <p className="mt-3 text-sm leading-7 text-molim-muted">
            تعرّف على الرتب والأقسام والمسؤوليات داخل فريق مُلم.
          </p>
        </section>

        {/* الرئيس العام */}
        <section className="mt-8">
          <p className="mb-3 text-xs font-bold text-molim-muted">
            الإدارة العليا
          </p>

          <div className="border-2 border-[#ed542f] bg-molim-soft p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center bg-[#ed542f] text-xl font-black text-white">
                أ
              </div>

              <div>
                <p className="text-lg font-black text-molim-foreground">
                  أصيل
                </p>

                <p className="mt-1 text-xs font-bold text-[#ed542f]">
                  الرئيس العام
                </p>
              </div>
            </div>

            <p className="mt-4 border-t border-molim pt-4 text-xs leading-6 text-molim-muted">
              المسؤول الأعلى عن إدارة كيان مُلم ومتابعة جميع
              الأقسام والعمليات والصلاحيات.
            </p>
          </div>
        </section>

        {/* الأقسام */}
        <section className="mt-8">
          <div className="mb-3">
            <h3 className="text-lg font-black text-molim-foreground">
              الأقسام
            </h3>

            <p className="mt-1 text-xs text-molim-muted">
              الأقسام التابعة لفريق مُلم ومسؤولوها.
            </p>
          </div>

          <div className="space-y-3">
            {departments.map((department) => (
              <article
                key={department.name}
                className="border border-molim bg-molim-soft p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-molim-foreground">
                      {department.name}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-molim-muted">
                      {department.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center bg-molim-soft text-lg">
                    □
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-[#f3f1ec] p-3">
                    <p className="text-[10px] text-molim-muted">
                      رئيس القسم
                    </p>

                    <p className="mt-1 text-xs font-black text-molim-foreground">
                      {department.head}
                    </p>
                  </div>

                  <div className="bg-[#f3f1ec] p-3">
                    <p className="text-[10px] text-molim-muted">
                      عدد الأعضاء
                    </p>

                    <p className="mt-1 text-xs font-black text-molim-foreground">
                      {department.members}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* الرتب */}
        <section className="mt-8">
          <div className="mb-3">
            <h3 className="text-lg font-black text-molim-foreground">
              رتب الفريق
            </h3>

            <p className="mt-1 text-xs text-molim-muted">
              مستويات المسؤولية والصلاحيات داخل مُلم.
            </p>
          </div>

          <div className="space-y-2">
            <Role
              title="الرئيس العام"
              description="الصلاحية الأعلى وإدارة النظام بالكامل."
              level="01"
            />

            <Role
              title="الإدارة العليا"
              description="إدارة ومتابعة أعمال الفريق والأقسام."
              level="02"
            />

            <Role
              title="الموارد البشرية"
              description="إدارة شؤون المتطوعين والاتفاقيات والشهادات."
              level="03"
            />

            <Role
              title="رئيس قسم"
              description="إدارة ومراجعة أعمال أعضاء القسم."
              level="04"
            />

            <Role
              title="متطوع"
              description="تنفيذ المهام والمشاركة في أعمال الفريق."
              level="05"
            />
          </div>
        </section>

        {/* ملاحظة */}
        <section className="mt-8 border-r-4 border-[#ed542f] bg-molim-soft px-5 py-4">
          <p className="text-xs font-black text-molim-foreground">
            🔐 الصلاحيات
          </p>

          <p className="mt-1 text-xs leading-6 text-molim-muted">
            ظهور الأقسام والمعلومات والإجراءات يختلف حسب صلاحية
            حسابك. لا تظهر البيانات الخاصة بالأعضاء إلا للجهات
            المخولة بذلك.
          </p>
        </section>

        <Link
          href="/"
          className="mt-7 flex h-14 w-full items-center justify-center bg-[#ed542f] text-sm font-black text-white"
        >
          العودة إلى المنصة
        </Link>

        <footer className="mt-10 border-t border-molim pt-6 text-center">
          <p className="text-[11px] text-molim-muted">
            مُلم — إدارة فريقك بشكل أبسط وآمن وسلس
          </p>
        </footer>
      </div>
    </main>
  );
}

function Role({
  title,
  description,
  level,
}: {
  title: string;
  description: string;
  level: string;
}) {
  return (
    <div className="flex items-center gap-3 border border-molim bg-molim-soft p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#ed542f]/10 text-xs font-black text-[#ed542f]">
        {level}
      </div>

      <div>
        <p className="text-sm font-black text-molim-foreground">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-molim-muted">
          {description}
        </p>
      </div>
    </div>
  );
}