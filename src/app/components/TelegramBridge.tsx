"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
          start_param?: string;
          query_id?: string;
        };
        ready: () => void;
        expand: () => void;
        colorScheme: "light" | "dark";
        headerColor: string;
        backgroundColor: string;
        close: () => void;
        themeParams: Record<string, unknown>;
      };
    };
  }
}

export type TelegramInitData = {
  initData: string;
  user: {
    id: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  startParam?: string;
};

export type TelegramState =
  | { status: "loading" }
  | { status: "ready"; telegram: TelegramInitData | null }
  | { status: "error"; error: string };

function readTelegram(): TelegramState {
  const w = typeof window === "undefined" ? undefined : window.Telegram?.WebApp;

  if (!w || !w.initData || !w.initDataUnsafe?.user) {
    return { status: "ready", telegram: null };
  }

  const raw = w.initDataUnsafe;
  const rawUser = raw.user;

  if (!rawUser) {
    return { status: "ready", telegram: null };
  }

  return {
    status: "ready",
    telegram: {
      initData: w.initData,
      user: {
        id: rawUser.id,
        firstName: rawUser.first_name,
        lastName: rawUser.last_name,
        username: rawUser.username,
      },
      startParam: raw.start_param,
    },
  };
}

export function useTelegram(): TelegramState {
  const [state, setState] = useState<TelegramState>(() => {
    if (typeof window === "undefined") {
      return { status: "loading" };
    }
    return window.Telegram?.WebApp
      ? { status: "loading" }
      : { status: "ready", telegram: null };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.Telegram?.WebApp) return;

    let cancelled = false;
    let attempts = 0;

    function check() {
      if (cancelled) return;

      const w = window.Telegram?.WebApp;

      if (!w || !w.initData || !w.initDataUnsafe?.user) {
        if (attempts < 20) {
          attempts += 1;
          setTimeout(check, 50);
          return;
        }
        setState({ status: "ready", telegram: null });
        return;
      }

      try {
        w.ready();
        w.expand();
        w.backgroundColor = "#ffffff";
        w.headerColor = "#ffffff";
      } catch {
        setState({ status: "error", error: "تعذر تحميل Telegram SDK" });
        return;
      }

      setState(readTelegram());
    }

    check();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}