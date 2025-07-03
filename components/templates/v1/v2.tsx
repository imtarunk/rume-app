"use client";

import React from "react";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import type { WorkExperience, Education } from "./data";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import GithubCalendarClient from "@/components/github-calendar-client";
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiNextdotjs,
  SiTailwindcss,
  SiDjango,
  // SiJava,
  SiCplusplus,
  // SiCsharp,
  SiGo,
  SiPhp,
  SiRuby,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiAngular,
  // SiVueDotJs,
} from "react-icons/si";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const skillIconMap: Record<string, JSX.Element> = {
  React: <SiReact />,
  "Node.js": <SiNodedotjs />,
  Python: <SiPython />,
  JavaScript: <SiJavascript />,
  TypeScript: <SiTypescript />,
  HTML: <SiHtml5 />,
  CSS: <SiCss3 />,
  MongoDB: <SiMongodb />,
  MySQL: <SiMysql />,
  PostgreSQL: <SiPostgresql />,
  "Next.js": <SiNextdotjs />,
  "Tailwind CSS": <SiTailwindcss />,
  Django: <SiDjango />,
  // Java: <SiJava />,
  "C++": <SiCplusplus />,
  // "C#": <SiCsharp />,
  Go: <SiGo />,
  PHP: <SiPhp />,
  Ruby: <SiRuby />,
  Flutter: <SiFlutter />,
  Swift: <SiSwift />,
  Kotlin: <SiKotlin />,
  Angular: <SiAngular />,
  // Add more as needed
};

export default function V2Portfolio({ data }: { data: any }) {
  const { name, contact = {}, skills = [], summary = "" } = data;

  const mappedWorkExperience = (data.work_experience || []).map((exp: any) => ({
    title: exp.role,
    company: exp.company,
    duration: exp.duration,
    description: exp.description || "",
    type: exp.type || "",
    location: exp.location || "",
  }));

  const mappedEducation = (data.education || []).map((edu: any) => ({
    institution: edu.university,
    degree: edu.degree,
    duration: edu.graduation_year,
  }));

  let githubUrl = contact.github || "https://github.com/imtarunk";
  const githubUsername = githubUrl
    .replace(/https?:\/\/(www\.)?github.com\//, "")
    .replace(/\/$/, "");

  return (
    <div
      className={`${inter.className} min-h-screen bg-gradient-to-tr from-[#fdfbfb] to-[#ebedee] text-gray-800`}
    >
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {name}
            </h1>
            <p className="text-gray-700 mt-3 text-base max-w-xl">
              {summary.split(" ").slice(0, 20).join(" ")}...
            </p>
            <div className="flex items-center text-gray-600 mt-4">
              <MapPin size={16} className="mr-2" />
              <span className="text-sm">{contact.location}</span>
            </div>
            <div className="flex space-x-4 mt-6">
              {[
                { href: `mailto:${contact.email}`, icon: <Mail size={16} /> },
                { href: `tel:${contact.phone}`, icon: <Phone size={16} /> },
                {
                  href: contact.github,
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37...Z" />
                    </svg>
                  ),
                },
                { href: contact.linkedin, icon: <Linkedin size={16} /> },
              ].map(({ href, icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <motion.div
            className="w-36 h-36 bg-white/30 backdrop-blur-md rounded-full shadow-lg overflow-hidden border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={data.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* About */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 border-b border-gray-300 pb-1">
            About
          </h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-1">
            Work Experience
          </h2>
          {mappedWorkExperience.map((job: WorkExperience, index: number) => (
            <motion.div
              key={index}
              className="mb-6 bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow-md"
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-medium">{job.company}</h3>
                <span className="text-sm text-gray-500">{job.duration}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {job.title} · {job.type}
              </p>
              <p className="text-xs text-gray-500 italic mb-2">
                {job.location}
              </p>
              <p className="text-sm text-gray-700">{job.description}</p>
            </motion.div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-1">
            Education
          </h2>
          {mappedEducation.map((edu: Education, i: number) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-medium text-lg">{edu.institution}</h3>
                <span className="text-sm text-gray-500">{edu.duration}</span>
              </div>
              <p className="text-sm text-gray-600">{edu.degree}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm hover:scale-105 transition"
              >
                {skillIconMap[skill] && (
                  <span className="text-lg">{skillIconMap[skill]}</span>
                )}
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* GitHub Calendar */}
        {githubUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <GithubCalendarClient username={githubUsername} />
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-gray-200">
        Made with ❤️ by{" "}
        <a
          href="https://codextarun.xyz"
          className="text-blue-600 hover:underline"
          target="_blank"
        >
          codextarun.xyz
        </a>
      </footer>
    </div>
  );
}
