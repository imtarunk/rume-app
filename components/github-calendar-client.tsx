"use client";
import GitHubCalendar from "react-github-calendar";
import { useEffect, useState } from "react";

const GithubCalendarClient = ({ username }: { username: string }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  const colorTheme = isDark
    ? ["#161b22", "#6b21a8", "#9333ea", "#a855f7", "#c084fc"]
    : ["#ebedf0", "#c084fc", "#a855f7", "#9333ea", "#6b21a8"];

  if (!mounted) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {" "}
        GitHub Contributions
      </h2>
      <div className="flex flex-wrap gap-2 justify-center">
        <GitHubCalendar
          username={username}
          blockSize={10}
          blockMargin={3}
          fontSize={14}
          colorScheme={isDark ? "dark" : "light"}
          theme={{
            light: colorTheme,
            dark: colorTheme,
          }}
        />
      </div>
    </section>
  );
};

export default GithubCalendarClient;
