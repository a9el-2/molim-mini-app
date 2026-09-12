"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { UserRole, ROLE_NAMES, canAccessRoute, ROUTE_ACCESS_RULES } from "../lib/roles";

type RoleGuardProps = {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, roleName, switchRole, isReady } = useAuth();
  const pathname = usePathname();

  if (!isReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="flex items-center gap-3 text-molim-muted">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-molim-orange border-t-transparent" />
          <span className="text-sm font-bold">جاري التحقق من الصلاحيات...</span>
        </div>
      </div>
    );
  }

  // Determine allowed roles either from props or from ROUTE_ACCESS_RULES
  const effectiveAllowedRoles =
    allowedRoles || ROUTE_ACCESS_RULES[pathname] || undefined;

  const isAllowed = effectiveAllowedRoles
    ? effectiveAllowedRoles.includes(role)
    : canAccessRoute(role, pathname);

  if (!isAllowed) {
    const requiredRoleNames = effectiveAllowedRoles
      ? effectiveAllowedRoles.map((r) => ROLE_NAMES[r]).join(" أو ")
      : "إدارة النظام";

    const recommendedRoleToSwitch = effectiveAllowedRoles?.[0];

    return (
      <div
        dir="rtl"
        className="mx-auto my-12 max-w-xl px-4 text-center"
      >
        <div className="molim-card border-r-4 border-r-red-500 p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
            🔒
          </div>

          <h2 className="mt-4 text-2xl font-black">
            غير مصرح بالدخول (403)
          </h2>

          <p className="mt-2 text-sm leading-7 text-molim-muted">
            عفوًا، حسابك الحالي مسجل برتبة{" "}
            <span className="font-bold text-molim-orange">«{roleName}»</span>{" "}
            ولا يملك الصلاحية اللازمة لفتح هذه الصفحة.
          </p>

          <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            الصلاحيات المطلوبة لهذه الصفحة: {requiredRoleNames}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="molim-button-primary flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span>العودة للرئيسية</span>
            </Link>

            {recommendedRoleToSwitch && process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={() => switchRole(recommendedRoleToSwitch)}
                className="molim-button-secondary flex items-center justify-center gap-2"
              >
                <span>تبديل الرتبة إلى «{ROLE_NAMES[recommendedRoleToSwitch]}» للمعاينة</span>
              </button>
            )}
          </div>

          <p className="mt-6 text-[11px] text-molim-muted">
            منصة فريق مُلم — نظام حماية الصلاحيات والخصوصية
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
