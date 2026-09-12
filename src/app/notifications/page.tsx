"use client";

import Link from "next/link";
import { useState } from "react";

type Notification = {
  id: number;
  type: "task" | "hours" | "certificate" | "agreement" | "department" | "reminder";
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "task",
    title: "تم إسناد مهمة جديدة لك",
    description:
      "لديك مهمة جديدة تحتاج إلى إنجازها ومراجعتها بعد الانتهاء منها.",
    time: "منذ 10 دقائق",
    unread: true,
  },
  {
    id: 2,
    type: "hours",
    title: "تم اعتماد مهمة",
    description:
      "تمت مراجعة المهمة واعتماد الساعات المسجلة لها.",
    time: "منذ ساعة",
    unread: true,
  },
  {
    id: 3,
    type: "certificate",
    title: "أصبحت مؤهلًا لشهادة التطوع 🎓",
    description:
      "وصلت إلى الحد المطلوب للحصول على شهادة التطوع ويمكنك تقديم طلبك الآن.",
    time: "منذ 3 ساعات",
    unread: true,
  },
  {
    id: 4,
    type: "department",
    title: "تم اعتماد قسمك",
    description:
      "تم تحديد قسمك واعتماد بيانات انضمامك إلى الفريق.",
    time: "أمس",
    unread: false,
  },
  {
    id: 5,
    type: "reminder",
    title: "تذكير بالمهام",
    description:
      "لم تسجل أي مهمة جديدة منذ فترة. تأكد من تسجيل الأعمال التي أنجزتها.",
    time: "أمس",
    unread: false,
  },
  {
    id: 6,
    type: "agreement",
    title: "اتفاقية التطوع",
    description:
      "اقترب موعد انتهاء اتفاقية التطوع الخاصة بك. يمكنك تجديدها من المنصة.",
    time: "قبل يومين",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task":
        return "✓";
      case "hours":
        return "⏱";
      case "certificate":
        return "★";
      case "agreement":
        return "□";
      case "department":
        return "⌂";
      case "reminder":
        return "!";
      default:
        return "•";
    }
  };

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
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div className="absolute right-0 bottom-24 h-px w-52 rotate-[20deg] bg-[#ed542f]/10" />
      </div>

      <div className="relative mx-auto max-w-md px-5 pb-12 pt-7">
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
            href="/"
            className="flex h-10 w-10 items-center justify-center border border-molim bg-molim-soft text-lg text-molim-muted"
            aria-label="العودة"
          >
            ←
          </Link>
        </header>

        {/* العنوان */}
        <section className="mt-9">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-bold text-[#ed542f]">
                مركز التنبيهات
              </p>

              <h2 className="mt-2 text-3xl font-black text-molim-foreground">
                الإشعارات
              </h2>
            </div>

            {unreadCount > 0 && (
              <span className="bg-[#ed542f] px-3 py-1 text-[11px] font-bold text-white">
                {unreadCount} جديدة
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-molim-muted">
            هنا تظهر جميع التحديثات والتنبيهات الخاصة بحسابك داخل
            فريق مُلم.
          </p>
        </section>

        {/* التحكم */}
        <div className="mt-7 flex items-center justify-between border border-molim bg-molim-soft px-4 py-3">
          <div>
            <p className="text-sm font-black text-molim-foreground">
              إشعاراتك
            </p>

            <p className="mt-1 text-[11px] text-molim-muted">
              {unreadCount === 0
                ? "لا توجد إشعارات جديدة"
                : `${unreadCount} إشعارات تحتاج إلى مراجعة`}
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`text-xs font-bold ${
              unreadCount === 0
                ? "text-molim-muted/50"
                : "text-[#ed542f]"
            }`}
          >
            قراءة الكل
          </button>
        </div>

        {/* القائمة */}
        <section className="mt-3">
          <div className="space-y-2">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`relative flex w-full items-start gap-3 border p-4 text-right transition ${
                  notification.unread
                    ? "border-[#ed542f]/30 bg-[#fffaf7]"
                    : "border-molim bg-molim-soft"
                }`}
              >
                {/* نقطة الإشعار */}
                {notification.unread && (
                  <span className="absolute right-2 top-2 h-2 w-2 bg-[#ed542f]" />
                )}

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center text-lg font-black ${
                    notification.unread
                      ? "bg-[#ed542f]/10 text-[#ed542f]"
                      : "bg-molim-soft text-molim-muted"
                  }`}
                >
                  {getIcon(notification.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-sm text-molim-foreground ${
                        notification.unread
                          ? "font-black"
                          : "font-bold"
                      }`}
                    >
                      {notification.title}
                    </h3>

                    <span className="shrink-0 text-[10px] text-molim-muted">
                      {notification.time}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-6 text-molim-muted">
                    {notification.description}
                  </p>

                  {notification.unread && (
                    <p className="mt-2 text-[10px] font-bold text-[#ed542f]">
                      اضغط لتحديده كمقروء
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* لا يوجد المزيد */}
        <div className="mt-7 border border-dashed border-molim bg-transparent p-5 text-center">
          <p className="text-xs font-bold text-molim-muted">
            نهاية الإشعارات الحالية
          </p>

          <p className="mt-1 text-[11px] leading-5 text-molim-muted">
            ستظهر هنا التنبيهات الجديدة تلقائيًا عند ربط النظام
            بالـBackend وTelegram.
          </p>
        </div>

        <footer className="mt-10 border-t border-molim pt-6 text-center">
          <p className="text-[11px] text-molim-muted">
            مُلم — إدارة فريقك بشكل أبسط وآمن وسلس
          </p>
        </footer>
      </div>
    </main>
  );
}
