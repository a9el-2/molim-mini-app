import { redirect } from "next/navigation";
import type { UserRole } from "./roles";
import type { User } from "./user";

export function requireRole(allowedRoles: UserRole[], user?: User) {
  if (!user || !allowedRoles.includes(user.role)) {
    redirect("/");
  }
}

export function requireAnyRole(user?: User) {
  return user;
}
