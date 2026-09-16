"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";
import { CLINIC } from "@/lib/clinic";
import type { PublicUser } from "@/lib/types";

export function SiteHeader({ user }: { user: PublicUser | null }) {
  const [open, setOpen] = useState(false);

  const links = user
    ? user.role === "admin"
      ? [{ href: "/admin", label: "Paneli admin" }]
      : user.role === "doctor"
        ? [{ href: "/doctor", label: "Orari im" }]
        : [
            { href: "/dashboard", label: "Paneli" },
            { href: "/book", label: "Rezervo" },
            { href: "/appointments", label: "Terminet" },
          ]
    : [
        { href: "/mjeket", label: "Mjekët" },
        { href: "/#sherbimet", label: "Shërbimet" },
        { href: "/#kontakti", label: "Kontakti" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-teal-100/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-700 text-lg text-white shadow-lg shadow-teal-700/20">
            +
          </span>
          <span>
            <span className="block font-display text-lg leading-none text-teal-900">
              {CLINIC.name}
            </span>
            <span className="text-xs text-teal-700/70">Rezervim terminesh</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-teal-800"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <form action={logoutAction}>
              <button className="btn btn-ghost h-10 px-4 text-sm" type="submit">
                Dil, {user.name.split(" ")[0]}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-teal-800">
                Hyrje
              </Link>
              <Link href="/register" className="btn btn-primary h-10 px-4 text-sm">
                Regjistrohu
              </Link>
            </div>
          )}
        </nav>

        <button
          className="rounded-xl border border-teal-100 p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
          aria-label="Hap menunë"
        >
          <span className="block h-0.5 w-5 bg-teal-900" />
          <span className="mt-1 block h-0.5 w-5 bg-teal-900" />
          <span className="mt-1 block h-0.5 w-5 bg-teal-900" />
        </button>
      </div>

      {open ? (
        <div className="border-t border-teal-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <form action={logoutAction}>
                <button className="text-left text-teal-800" type="submit">
                  Dil
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Hyrje
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  Regjistrohu
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
