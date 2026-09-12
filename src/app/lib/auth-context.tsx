"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserRole, ROLE_NAMES } from "./roles";
import { User } from "./user";
import { fetchUser, telegramAuth } from "./supabase/dto";
import { useTelegram } from "../components/TelegramBridge";

export type UserProfile = User & {
  avatar?: string;
  badge: string;
  email?: string;
  phone?: string;
};

export const MOCK_PROFILES: Record<UserRole, UserProfile> = {
  VOLUNTEER: {
    id: "MOL-00015",
    name: "سارة محمد",
    role: "VOLUNTEER",
    department: "البحث",
    badge: "متطوعة",
    email: "sara.m@molim.org",
  },
  DEPARTMENT_HEAD: {
    id: "MOL-00010",
    name: "أحمد خالد",
    role: "DEPARTMENT_HEAD",
    department: "الإعلام",
    badge: "رئيس قسم الإعلام",
    email: "ahmed.k@molim.org",
  },
  HR: {
    id: "MOL-00008",
    name: "خالد علي",
    role: "HR",
    department: "الموارد البشرية",
    badge: "مسؤول الموارد البشرية",
    email: "khaled.a@molim.org",
  },
  ADMIN: {
    id: "MOL-00003",
    name: "محمد أحمد",
    role: "ADMIN",
    department: "الإدارة",
    badge: "الإدارة العليا",
    email: "mohammed.a@molim.org",
  },
  SUPER_ADMIN: {
    id: "MOL-00001",
    name: "أصيل",
    role: "SUPER_ADMIN",
    department: "الإدارة العامة",
    badge: "الرئيس العام",
    email: "aseel@molim.org",
  },
};

type AuthContextType = {
  user: UserProfile;
  role: UserRole;
  roleName: string;
  switchRole: (role: UserRole) => void;
  switchUser: (profile: UserProfile) => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "molim_active_role";

function readSavedRole(): UserRole | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY) as UserRole | null;
    return saved && MOCK_PROFILES[saved] ? saved : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const savedRole = readSavedRole();

  const [user, setUser] = useState<UserProfile>(
    savedRole ? MOCK_PROFILES[savedRole] : MOCK_PROFILES.SUPER_ADMIN
  );

  const [isReady, setIsReady] = useState<boolean>(true);
  const telegramState = useTelegram();

  useEffect(() => {
    if (telegramState.status !== "ready") return;

    const tg = telegramState.telegram;
    if (!tg || !tg.initData) return;

    let cancelled = false;

    telegramAuth(tg.initData).then(async (result) => {
      if (cancelled) return;

      if (result.hasLinkedUser && result.userId) {
        const real = await fetchUser(result.userId);
        if (cancelled) return;

        if (real) {
          setUser({
            id: real.id,
            name: real.name,
            role: real.role as UserRole,
            department: real.department,
            badge: ROLE_NAMES[real.role as UserRole] || "عضو",
            email: real.email ?? undefined,
            phone: real.phone ?? undefined,
          });
        }
      }

      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [telegramState]);

  const switchRole = (newRole: UserRole) => {
    const profile = MOCK_PROFILES[newRole];
    if (profile) {
      setUser(profile);
      try {
        localStorage.setItem(STORAGE_KEY, newRole);
      } catch {
        // ignore
      }
    }
  };

  const switchUser = (newProfile: UserProfile) => {
    setUser(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, newProfile.role);
    } catch {
      // ignore
    }
  };

  const roleName = ROLE_NAMES[user.role] || user.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user.role,
        roleName,
        switchRole,
        switchUser,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: MOCK_PROFILES.SUPER_ADMIN,
      role: "SUPER_ADMIN" as UserRole,
      roleName: ROLE_NAMES.SUPER_ADMIN,
      switchRole: () => {},
      switchUser: () => {},
      isReady: true,
    };
  }
  return context;
}
