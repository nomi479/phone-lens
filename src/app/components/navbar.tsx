"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuthenticated = status === "authenticated" && !!user;

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div style={{ position: "relative", width: "80px", height: "120px" }}>
              <Image
                src="/phonelenz_logo.svg"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="text-xl font-semibold">PhoneLenz</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/market/detectphone" className="hover:text-blue-600">Detect Phone</Link>
            <Link href="/market/sellphone" className="hover:text-blue-600">Sell Phone</Link>
            <Link href="/market/buyphone" className="hover:text-blue-600">Buy Phone</Link>
            <Link href="/market/repairephone" className="hover:text-blue-600">Repair Phone</Link>
          </div>

          {/* Auth Buttons + Mobile Toggle */}
          <div className="flex items-center gap-3 relative">
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((open) => !open)}
                    className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-600 hover:text-blue-700"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      {userInitials}
                    </span>
                    <span>{user?.name ?? user?.email ?? "Dashboard"}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 z-20 mt-3 w-44 overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-lg">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Dashboard
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-2xl"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-80 py-4" : "max-h-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            <Link href="/">Home</Link>
            <Link href="/market/detectphone">Detect Phone</Link>
            <Link href="/market/sellphone">Sell Phone</Link>
            <Link href="/market/buyphone">Buy Phone</Link>
            <Link href="/market/repairephone">Repair Phone</Link>
            <hr className="border-gray-200" />
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-center py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}