import type { UserRole } from "./roles";

export type User = {
  id: string;
  name: string;
  role: UserRole;
  department: string;
};

export const currentUser: User = {
  id: "MOL-00001",
  name: "أصيل",
  role: "SUPER_ADMIN",
  department: "الإدارة",
};