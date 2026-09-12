"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import MolimHeader from "./MolimHeader";

const PUBLIC_PAGES = [
  "/join",
  "/register",
  "/welcome",
  "/workflow",
  "/structure",
  "/suggestions",
];

function FullScreenLoader({ message }: { message: string }) {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-molim text-molim-foreground"
    >
      <div className="flex flex-col items-center gap-3 text-molim-muted">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-molim-orange border-t-transparent" />
        <span className="text-sm font-bold">{message}</span>
      </div>
    </div>
  );
}

export default function AppGate({ children }: { children: React.ReactNode }) {
  const { status, isReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PAGES.includes(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && !isPublic) {
      router.replace("/join");
    }
  }, [status, isPublic, router]);

  if (!isReady) {
    return <FullScreenLoader message="جاري التحقق من حسابك..." />;
  }

  if (status === "unauthenticated") {
    if (!isPublic) {
      return <FullScreenLoader message="جاري تجهيز صفحتك..." />;
    }

    return <>{children}</>;
  }

  return (
    <>
      <MolimHeader />
      {children}
    </>
  );
}