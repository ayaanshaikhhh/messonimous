"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";

import { Button } from "@/components/ui/button";
import ShinyText from "./ui/ShinyText";

const Navbar = () => {
  const { data: session } = useSession();
  const user : User = session?.user as User ;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}

        <Link
          href="/"
          className="text-2xl font-black tracking-tight transition-opacity hover:opacity-90"
        >
          <span className="bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            <ShinyText
              text="Messonimous"
              className="inline-block"
              speed={2}
              delay={0}
              color="#6366F1"
              shineColor="#06B6D4"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
            />
          </span>
        </Link>

        {/* Right Side */}

        {session ? (
          <div className="flex items-center gap-4">
            <div className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 md:block">
              Welcome,&nbsp;
              <span className="font-semibold text-slate-900">
                {user?.username || user?.email}
              </span>
            </div>

            <Button
              onClick={() => signOut()}
              variant="outline"
              className="h-8 w-20 rounded-xl bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 text-white cursor-pointer font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="
                cursor-pointer
                rounded-xl
                bg-linear-to-r
                from-violet-600
                via-indigo-600
                to-blue-600
                px-6
                text-white
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-lg
                hover:shadow-violet-500/20
                active:scale-[0.98]
              "
            >
              Login
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;