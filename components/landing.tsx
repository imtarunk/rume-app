"use client";

import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function HeroSectionOne() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative min-h-screen bg-white dark:bg-black">
        <Navbar />

        {/* Decorative Borders */}
        <div className="absolute inset-y-0 left-0 w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 w-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-neutral-200/80 dark:bg-neutral-800/80">
          <div className="absolute left-1/2 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>

        {/* Main Content */}
        <main className="relative z-10 px-4 py-20 md:py-32 text-center">
          <motion.h1 className="mx-auto max-w-4xl text-3xl font-bold text-slate-700 dark:text-slate-200 md:text-5xl lg:text-7xl">
            {"Transform Your Resume Into a Stunning Portfolio"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mx-auto mt-6 max-w-xl text-lg text-neutral-600 dark:text-neutral-400"
          >
            Upload your resume and watch as AI creates a beautiful, professional
            portfolio website in minutes. Choose from stunning templates and get
            your own custom domain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a href="/dashboard">
              <button className="w-60 rounded-lg bg-black px-6 py-2 font-medium text-white transition hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                Explore Now
              </button>
            </a>
            <a href="mailto:codextarun@gmail.com">
              <button className="w-60 rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
                Contact Support
              </button>
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-20 mx-auto max-w-6xl overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-[0_0_25px_#00FFFF] dark:border-neutral-800 dark:bg-neutral-900"
          >
            <img
              src="https://cdn.dribbble.com/userupload/15724364/file/original-87c08a991dac0b591cb152374e6b92b1.jpg?resize=1200x780&vertical=center"
              alt="Landing preview"
              className="aspect-video w-full object-cover"
            />
          </motion.div>
        </main>
        <footer className="text-center p-8  border-gray-200">
          <p className="text-sm text-gray-500 mb-1">
            Made with ❤️ by{" "}
            <a
              href="https://codextarun.xyz"
              className="underline hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              codextarun.xyz
            </a>
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-y border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-semibold">Rume</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <a href="/auth/signin">
          <button className="w-24 rounded-lg bg-black px-6 py-2 font-medium text-white transition hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button>
        </a>
      </div>
    </nav>
  );
};
