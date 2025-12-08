"use client";

import Link from "next/link";
import { useActiveRoute } from "../utils/use-active-route";

export default function SettingsNav() {
  const { getTextClasses } = useActiveRoute();

  return (
    <div className="flex items-center space-x-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      <Link
        href="/dashboard/settings"
        className={`${getTextClasses("/dashboard/settings")}`}
      >
        General
      </Link>
      <Link
        href="/dashboard/settings/about"
        className={`${getTextClasses("/dashboard/settings/about")}`}
      >
        Información
      </Link>
      <Link
        href="/dashboard/settings/invitations"
        className={`${getTextClasses("/dashboard/settings/invitations")}`}
      >
        Invitaciones
      </Link>
      <Link
        href="/dashboard/settings/subscription"
        className={`${getTextClasses("/dashboard/settings/subscription")}`}
      >
        Plan
      </Link>
    </div>
  );
}
