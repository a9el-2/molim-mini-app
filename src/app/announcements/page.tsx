"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RoleGuard from "../components/RoleGuard";

/* =========================================================
   أنواع الإعلانات
   ========================================================= */
type AnnouncementStatus = "منشور" | "مجدول" | "مسودة" | "منتهي";

type AnnouncementAudience = "الجميع" | "قسم محدد" | "رتبة محددة";

type Announcement = {
  id: number;
  title: string;
  content: string;
  status: AnnouncementStatus;
  audience: AnnouncementAudience;
  target: string;
  publishDate: string;
  publishTime: string;
  createdBy: string;
  createdAt: string;
};

type AnnouncementFilter = "الكل" | AnnouncementStatus;

/* =========================================================
   أنواع الإشعارات
   ========================================================= */
type NotificationStatus = "جديد" | "مرسل" | "مجدول" | "منتهي" | "مسودة";

type NotificationAudience =
  | "الجميع"
  | "المتطوعون"
  | "رؤساء الأقسام"
  | "الموارد البشرية"
  | "قسم محدد";

type AdminNotification = {
  id: number;
  title: string;
  message: string;
  audience: NotificationAudience;
  target: string;
  status: NotificationStatus;
  date: string;
  time: string;
  createdBy: string;
  createdAt: string;
};

type NotificationFilter = "الكل" | NotificationStatus;

type TabKey = "announcements" | "notifications";

/* =========================================================
   بيانات الإعلانات
   ========================================================= */
const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "فتح التسجيل في فرصة قيادية تطوعية",
    content:
      "تم فتح التسجيل في الفرصة القيادية التطوعية الجديدة داخل فريق مُلم.",
    status: "منشور",
    audience: "الجميع",
    target: "جميع أعضاء الفريق",
    publishDate: "2026/09/03",
    publishTime: "08:00",
    createdBy: "أصيل",
    createdAt: "2026/09/02",
  },
  {
    id: 2,
    title: "اجتماع رؤساء الأقسام",
    content: "سيُعقد اجتماع لمناقشة سير العمل ومتابعة أداء الأقسام.",
    status: "مجدول",
    audience: "رتبة محددة",
    target: "رؤساء الأقسام",
    publishDate: "2026/09/05",
    publishTime: "18:00",
    createdBy: "أصيل",
    createdAt: "2026/09/03",
  },
  {
    id: 3,
    title: "تذكير بتحديث بيانات المتطوعين",
    content: "يرجى التأكد من أن بيانات الحساب والمهارات والأدوات محدثة.",
    status: "مسودة",
    audience: "الجميع",
    target: "جميع أعضاء الفريق",
    publishDate: "",
    publishTime: "",
    createdBy: "خالد علي",
    createdAt: "2026/09/02",
  },
  {
    id: 4,
    title: "إغلاق التسجيل في البرنامج السابق",
    content:
      "تم إغلاق التسجيل في البرنامج السابق، ويمكن متابعة الفرص الجديدة من المنصة.",
    status: "منتهي",
    audience: "الجميع",
    target: "جميع أعضاء الفريق",
    publishDate: "2026/08/15",
    publishTime: "10:00",
    createdBy: "أصيل",
    createdAt: "2026/08/10",
  },
];

const announcementFilters: AnnouncementFilter[] = [
  "الكل",
  "منشور",
  "مجدول",
  "مسودة",
  "منتهي",
];

/* =========================================================
   بيانات الإشعارات
   ========================================================= */
const initialNotifications: AdminNotification[] = [
  {
    id: 1,
    title: "تم اعتماد الساعات التطوعية",
    message:
      "تم اعتماد الساعات التطوعية المسجلة. يمكنك مراجعة حالتك من صفحة الساعات.",
    audience: "الجميع",
    target: "جميع أعضاء الفريق",
    status: "مرسل",
    date: "2026/09/03",
    time: "08:30",
    createdBy: "أصيل",
    createdAt: "2026/09/03",
  },
  {
    id: 2,
    title: "تذكير بمراجعة المهام",
    message:
      "يرجى من رؤساء الأقسام مراجعة المهام المرسلة من أعضاء أقسامهم.",
    audience: "رؤساء الأقسام",
    target: "رؤساء الأقسام",
    status: "مجدول",
    date: "2026/09/04",
    time: "18:00",
    createdBy: "أصيل",
    createdAt: "2026/09/03",
  },
  {
    id: 3,
    title: "تحديث بيانات المتطوعين",
    message: "يرجى التأكد من اكتمال وتحديث بيانات الملف الشخصي.",
    audience: "المتطوعون",
    target: "المتطوعون",
    status: "جديد",
    date: "2026/09/03",
    time: "10:00",
    createdBy: "خالد علي",
    createdAt: "2026/09/03",
  },
  {
    id: 4,
    title: "اجتماع الموارد البشرية",
    message:
      "تذكير باجتماع الموارد البشرية لمتابعة ملفات المتطوعين والاتفاقيات.",
    audience: "الموارد البشرية",
    target: "الموارد البشرية",
    status: "مسودة",
    date: "",
    time: "",
    createdBy: "أصيل",
    createdAt: "2026/09/02",
  },
];

const notificationFilters: NotificationFilter[] = [
  "الكل",
  "جديد",
  "مرسل",
  "مجدول",
  "منتهي",
  "مسودة",
];

function announcementStatusStyle(status: AnnouncementStatus) {
  if (status === "منشور") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "مجدول") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "مسودة") {
    return "border-molim bg-molim-soft text-molim-foreground";
  }

  return "border-molim bg-molim-soft text-molim-muted";
}

function notificationStatusStyle(status: NotificationStatus) {
  if (status === "جديد") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700";
  }

  if (status === "مرسل") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "مجدول") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "منتهي") {
    return "border-molim bg-molim-soft text-molim-foreground";
  }

  return "border-orange-200 bg-orange-50 text-orange-700";
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
          <p className="text-xs leading-5 text-molim-muted">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>

        <div className="bg-molim-soft px-2.5 py-2">{icon}</div>
      </div>
    </div>
  );
}

function InfoBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-molim p-4">
      <p className="text-xs text-molim-muted">{title}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [activeFilter, setActiveFilter] = useState<AnnouncementFilter>("الكل");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("الجميع");
  const [target, setTarget] = useState("الجميع");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");

  const publishedCount = announcements.filter((i) => i.status === "منشور").length;
  const scheduledCount = announcements.filter((i) => i.status === "مجدول").length;
  const draftCount = announcements.filter((i) => i.status === "مسودة").length;
  const endedCount = announcements.filter((i) => i.status === "منتهي").length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements.filter((item) => {
      const matchesFilter = activeFilter === "الكل" || item.status === activeFilter;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.target.toLowerCase().includes(query) ||
        item.createdBy.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [announcements, activeFilter, search]);

  function resetForm() {
    setTitle("");
    setContent("");
    setAudience("الجميع");
    setTarget("الجميع");
    setPublishDate("");
    setPublishTime("");
  }

  function createItem(status: "منشور" | "مجدول" | "مسودة") {
    if (!title.trim() || !content.trim()) {
      return;
    }

    const item: Announcement = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      status,
      audience,
      target,
      publishDate,
      publishTime,
      createdBy: "أصيل",
      createdAt: new Date().toLocaleDateString("ar-SA"),
    };

    setAnnouncements((current) => [item, ...current]);
    setShowForm(false);
    resetForm();
    setActiveFilter(status);
  }

  function deleteItem(id: number) {
    setAnnouncements((current) => current.filter((item) => item.id !== id));
    setSelected(null);
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">قائمة الإعلانات</h2>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="h-12 cursor-pointer bg-[#ed542f] px-5 font-semibold text-white hover:bg-[#d94725]"
        >
          + إنشاء إعلان
        </button>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="منشورة" value={publishedCount} icon="📢" />
        <StatCard title="مجدولة" value={scheduledCount} icon="🕐" />
        <StatCard title="مسودات" value={draftCount} icon="📝" />
        <StatCard title="منتهية" value={endedCount} icon="✓" />
      </section>

      <section className="mt-5 border border-molim bg-molim-surface p-4">
        <label className="mb-2 block text-sm font-semibold">البحث</label>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث بعنوان الإعلان أو المحتوى..."
          className="h-12 w-full border border-molim bg-molim-soft px-4 text-sm outline-none focus:border-[#ed542f]"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {announcementFilters.map((filter) => (
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

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">الإعلانات</h2>
          <span className="text-sm text-molim-muted">
            {filtered.length} إعلان
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">
            <p className="font-semibold">لا توجد إعلانات</p>
            <p className="mt-2 text-sm text-molim-muted">
              لا توجد إعلانات مطابقة للبحث أو الحالة.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="block w-full cursor-pointer border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{item.title}</h3>
                      <span
                        className={`border px-2 py-1 text-xs font-medium ${announcementStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-molim-muted">
                      {item.content}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">
                      <span>الجمهور: {item.target}</span>
                      <span>المنشئ: {item.createdBy}</span>
                      <span>تاريخ الإنشاء: {item.createdAt}</span>

                      {item.publishDate && (
                        <span>
                          النشر: {item.publishDate}
                          {item.publishTime ? ` — ${item.publishTime}` : ""}
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

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-molim-muted">إدارة الإعلانات</p>
                <h2 className="mt-1 text-xl font-bold">إنشاء إعلان جديد</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  عنوان الإعلان
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="اكتب عنوان الإعلان..."
                  className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  محتوى الإعلان
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="اكتب محتوى الإعلان..."
                  className="w-full resize-none border border-molim bg-molim-soft p-4 text-sm outline-none focus:border-[#ed542f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">الجمهور</label>
                <select
                  value={audience}
                  onChange={(event) => {
                    const value = event.target.value as AnnouncementAudience;
                    setAudience(value);

                    if (value === "الجميع") {
                      setTarget("الجميع");
                    } else if (value === "قسم محدد") {
                      setTarget("الإدارة");
                    } else {
                      setTarget("المتطوعون");
                    }
                  }}
                  className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                >
                  <option value="الجميع">الجميع</option>
                  <option value="قسم محدد">قسم محدد</option>
                  <option value="رتبة محددة">رتبة محددة</option>
                </select>
              </div>

              {audience !== "الجميع" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    تحديد الجمهور
                  </label>
                  <select
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                  >
                    {audience === "قسم محدد" ? (
                      <>
                        <option value="الإدارة">الإدارة</option>
                        <option value="الموارد البشرية">الموارد البشرية</option>
                        <option value="الإعلام">الإعلام</option>
                      </>
                    ) : (
                      <>
                        <option value="المتطوعون">المتطوعون</option>
                        <option value="رؤساء الأقسام">رؤساء الأقسام</option>
                        <option value="الموارد البشرية">الموارد البشرية</option>
                        <option value="الإدارة العليا">الإدارة العليا</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    تاريخ النشر
                  </label>
                  <input
                    type="date"
                    value={publishDate}
                    onChange={(event) => setPublishDate(event.target.value)}
                    className="h-12 w-full border border-molim bg-molim-soft px-3 outline-none focus:border-[#ed542f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    وقت النشر
                  </label>
                  <input
                    type="time"
                    value={publishTime}
                    onChange={(event) => setPublishTime(event.target.value)}
                    className="h-12 w-full border border-molim bg-molim-soft px-3 outline-none focus:border-[#ed542f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => createItem("منشور")}
                  className="h-12 cursor-pointer bg-green-600 font-semibold text-white hover:bg-green-700"
                >
                  📢 نشر الآن
                </button>
                <button
                  type="button"
                  onClick={() => createItem("مجدول")}
                  className="h-12 cursor-pointer bg-blue-600 font-semibold text-white hover:bg-blue-700"
                >
                  🕐 جدولة
                </button>
                <button
                  type="button"
                  onClick={() => createItem("مسودة")}
                  className="h-12 cursor-pointer border border-molim bg-molim-surface font-semibold hover:bg-molim-soft"
                >
                  📝 حفظ مسودة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-molim-muted">تفاصيل الإعلان</p>
                <h2 className="mt-1 text-xl font-bold">{selected.title}</h2>
                <span
                  className={`mt-2 inline-block border px-2 py-1 text-xs font-medium ${announcementStatusStyle(
                    selected.status
                  )}`}
                >
                  {selected.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="border border-molim bg-molim-soft p-4">
                <p className="text-xs text-molim-muted">محتوى الإعلان</p>
                <p className="mt-2 text-sm leading-7 text-molim-foreground">
                  {selected.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox title="الجمهور" value={selected.target} />
                <InfoBox title="طريقة الاستهداف" value={selected.audience} />
                <InfoBox title="أنشأه" value={selected.createdBy} />
                <InfoBox title="تاريخ الإنشاء" value={selected.createdAt} />
              </div>

              {selected.publishDate && (
                <div className="border border-molim p-4">
                  <p className="text-xs text-molim-muted">موعد النشر</p>
                  <p className="mt-1 font-semibold">
                    {selected.publishDate}
                    {selected.publishTime ? ` — ${selected.publishTime}` : ""}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border border-molim bg-molim-soft p-4">
                <div>
                  <p className="text-sm font-semibold">حالة الإعلان</p>
                  <p className="mt-1 text-xs text-molim-muted">
                    يتم التحكم بالإعلان من خلال الإدارة.
                  </p>
                </div>
                <span
                  className={`border px-3 py-2 text-xs font-medium ${announcementStatusStyle(
                    selected.status
                  )}`}
                >
                  {selected.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => deleteItem(selected.id)}
                className="h-12 w-full cursor-pointer border border-red-200 bg-red-50 font-semibold text-red-700 hover:bg-red-100"
              >
                حذف الإعلان
              </button>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="h-12 w-full cursor-pointer border border-molim bg-molim-surface font-semibold text-molim-foreground hover:bg-molim-soft"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("الكل");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminNotification | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<NotificationAudience>("الجميع");
  const [target, setTarget] = useState("جميع أعضاء الفريق");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const newCount = notifications.filter((i) => i.status === "جديد").length;
  const sentCount = notifications.filter((i) => i.status === "مرسل").length;
  const scheduledCount = notifications.filter((i) => i.status === "مجدول").length;
  const endedCount = notifications.filter((i) => i.status === "منتهي").length;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesFilter = activeFilter === "الكل" || item.status === activeFilter;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        item.target.toLowerCase().includes(query) ||
        item.createdBy.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [notifications, activeFilter, search]);

  function resetForm() {
    setTitle("");
    setMessage("");
    setAudience("الجميع");
    setTarget("جميع أعضاء الفريق");
    setDate("");
    setTime("");
  }

  function createItem(status: "مرسل" | "مجدول" | "مسودة") {
    if (!title.trim() || !message.trim()) {
      return;
    }

    const item: AdminNotification = {
      id: Date.now(),
      title: title.trim(),
      message: message.trim(),
      audience,
      target,
      status,
      date,
      time,
      createdBy: "أصيل",
      createdAt: new Date().toLocaleDateString("ar-SA"),
    };

    setNotifications((current) => [item, ...current]);
    setShowForm(false);
    resetForm();
    setActiveFilter(status);
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">قائمة الإشعارات</h2>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="h-12 cursor-pointer bg-[#ed542f] px-5 font-semibold text-white hover:bg-[#d94725]"
        >
          + إنشاء إشعار
        </button>
      </div>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard title="جديدة" value={newCount} icon="🔔" />
        <StatCard title="مرسلة" value={sentCount} icon="📤" />
        <StatCard title="مجدولة" value={scheduledCount} icon="🕐" />
        <StatCard title="منتهية" value={endedCount} icon="✓" />
      </section>

      <section className="mt-5 border border-molim bg-molim-surface p-4">
        <label className="mb-2 block text-sm font-semibold">البحث</label>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث بعنوان الإشعار، المحتوى أو الجمهور..."
          className="h-12 w-full border border-molim bg-molim-soft px-4 text-sm outline-none focus:border-[#ed542f]"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {notificationFilters.map((filter) => (
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

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">الإشعارات</h2>
          <span className="text-sm text-molim-muted">
            {filtered.length} إشعار
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-molim bg-molim-surface p-10 text-center">
            <p className="font-semibold">لا توجد إشعارات</p>
            <p className="mt-2 text-sm text-molim-muted">
              لا توجد إشعارات مطابقة للبحث أو الحالة.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="block w-full cursor-pointer border border-molim bg-molim-surface p-4 text-right transition hover:border-[#ed542f] hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold">{item.title}</h3>
                      <span
                        className={`border px-2 py-1 text-xs font-medium ${notificationStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-molim-muted">
                      {item.message}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-molim-muted">
                      <span>الجمهور: {item.target}</span>
                      <span>المنشئ: {item.createdBy}</span>
                      <span>تاريخ الإنشاء: {item.createdAt}</span>

                      {item.date && (
                        <span>
                          موعد الإرسال: {item.date}
                          {item.time ? ` — ${item.time}` : ""}
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

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-molim-muted">مركز الإشعارات</p>
                <h2 className="mt-1 text-xl font-bold">إنشاء إشعار جديد</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  عنوان الإشعار
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="اكتب عنوان الإشعار..."
                  className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  محتوى الإشعار
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="اكتب محتوى الإشعار..."
                  className="w-full resize-none border border-molim bg-molim-soft p-4 text-sm outline-none focus:border-[#ed542f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">الجمهور</label>
                <select
                  value={audience}
                  onChange={(event) => {
                    const value = event.target.value as NotificationAudience;
                    setAudience(value);

                    if (value === "الجميع") {
                      setTarget("جميع أعضاء الفريق");
                    } else if (value === "المتطوعون") {
                      setTarget("المتطوعون");
                    } else if (value === "رؤساء الأقسام") {
                      setTarget("رؤساء الأقسام");
                    } else if (value === "الموارد البشرية") {
                      setTarget("الموارد البشرية");
                    } else {
                      setTarget("الإدارة");
                    }
                  }}
                  className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                >
                  <option value="الجميع">الجميع</option>
                  <option value="المتطوعون">المتطوعون</option>
                  <option value="رؤساء الأقسام">رؤساء الأقسام</option>
                  <option value="الموارد البشرية">الموارد البشرية</option>
                  <option value="قسم محدد">قسم محدد</option>
                </select>
              </div>

              {audience === "قسم محدد" && (
                <div>
                  <label className="mb-2 block text-sm font-semibold">القسم</label>
                  <select
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                    className="h-12 w-full border border-molim bg-molim-soft px-4 outline-none focus:border-[#ed542f]"
                  >
                    <option value="الإدارة">الإدارة</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                    <option value="الإعلام">الإعلام</option>
                    <option value="البحث">البحث</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    تاريخ الإرسال
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-12 w-full border border-molim bg-molim-soft px-3 outline-none focus:border-[#ed542f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    وقت الإرسال
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="h-12 w-full border border-molim bg-molim-soft px-3 outline-none focus:border-[#ed542f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => createItem("مرسل")}
                  className="h-12 cursor-pointer bg-green-600 font-semibold text-white hover:bg-green-700"
                >
                  📤 إرسال الآن
                </button>
                <button
                  type="button"
                  onClick={() => createItem("مجدول")}
                  className="h-12 cursor-pointer bg-blue-600 font-semibold text-white hover:bg-blue-700"
                >
                  🕐 جدولة
                </button>
                <button
                  type="button"
                  onClick={() => createItem("مسودة")}
                  className="h-12 cursor-pointer border border-molim bg-molim-surface font-semibold hover:bg-molim-soft"
                >
                  📝 حفظ مسودة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-molim bg-molim-surface p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-molim-muted">تفاصيل الإشعار</p>
                <h2 className="mt-1 text-xl font-bold">{selected.title}</h2>
                <span
                  className={`mt-2 inline-block border px-2 py-1 text-xs font-medium ${notificationStatusStyle(
                    selected.status
                  )}`}
                >
                  {selected.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cursor-pointer bg-molim-soft px-3 py-2 hover:bg-molim-soft"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="border border-molim bg-molim-soft p-4">
                <p className="text-xs text-molim-muted">محتوى الإشعار</p>
                <p className="mt-2 text-sm leading-7 text-molim-foreground">
                  {selected.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox title="الجمهور" value={selected.target} />
                <InfoBox title="طريقة الاستهداف" value={selected.audience} />
                <InfoBox title="أنشأه" value={selected.createdBy} />
                <InfoBox title="تاريخ الإنشاء" value={selected.createdAt} />
              </div>

              {selected.date && (
                <div className="border border-molim p-4">
                  <p className="text-xs text-molim-muted">موعد الإرسال</p>
                  <p className="mt-1 font-semibold">
                    {selected.date}
                    {selected.time ? ` — ${selected.time}` : ""}
                  </p>
                </div>
              )}

              <div className="border border-molim bg-molim-soft p-4">
                <p className="text-sm font-semibold">📌 ملاحظة</p>
                <p className="mt-1 text-xs leading-6 text-molim-muted">
                  في النسخة النهائية سيتم إرسال الإشعار من الخادم، وتحديد
                  المستلمين اعتمادًا على صلاحياتهم وبياناتهم المرتبطة بحساباتهم.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="h-12 w-full cursor-pointer border border-molim bg-molim-surface font-semibold text-molim-foreground hover:bg-molim-soft"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("announcements");

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
              الإعلانات والتنبيهات
            </span>
          </div>

          {/* Header */}
          <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">مركز الإعلانات والتنبيهات</h1>
              <p className="mt-2 text-sm leading-6 text-molim-muted">
                إنشاء وإدارة الإعلانات والتنبيهات الموجهة لأعضاء فريق مُلم.
              </p>
            </div>

            <Link
              href="/agreements"
              className="shrink-0 border border-molim bg-molim-surface px-5 py-3 text-sm font-semibold text-molim-foreground transition hover:bg-molim-soft"
            >
              📄 اتفاقيات التطوع ←
            </Link>
          </section>

          {/* Tabs */}
          <section className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("announcements")}
              className={`cursor-pointer border px-5 py-3 text-sm font-semibold transition ${
                activeTab === "announcements"
                  ? "border-[#ed542f] bg-[#ed542f] text-white"
                  : "border-molim bg-molim-surface text-molim-foreground hover:bg-molim-soft"
              }`}
            >
              📢 الإعلانات
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`cursor-pointer border px-5 py-3 text-sm font-semibold transition ${
                activeTab === "notifications"
                  ? "border-[#ed542f] bg-[#ed542f] text-white"
                  : "border-molim bg-molim-surface text-molim-foreground hover:bg-molim-soft"
              }`}
            >
              🔔 الإشعارات
            </button>
          </section>

          {activeTab === "announcements" ? (
            <AnnouncementsSection />
          ) : (
            <NotificationsSection />
          )}
        </div>
      </main>
    </RoleGuard>
  );
}