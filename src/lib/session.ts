import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { todayInTimeZone } from "@/lib/dates";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  currency: string;
  timezone: string;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const u = session.user;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    currency: u.currency ?? "BDT",
    timezone: u.timezone ?? "Asia/Dhaka",
  };
});

/** Use in every protected page and server action: never trust the client. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export function userToday(user: CurrentUser): string {
  return todayInTimeZone(user.timezone);
}
