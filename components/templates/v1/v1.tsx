import React from "react";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import type { WorkExperience, Education } from "./data";
import dynamic from "next/dynamic";
import GithubCalendarClient from "@/components/github-calendar-client";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function V1Portfolio({ data }: { data: any }) {
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

  let githubUrl = data.contact?.github || "https://github.com/imtarunk";
  const githubUsername = githubUrl
    .replace(/https?:\/\/(www\.)?github.com\//, "")
    .replace(/\/$/, "");

  return (
    <div className={`${inter.className} min-h-screen bg-white`}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{name}</h1>
            <p className="text-gray-700 text-base leading-relaxed max-w-2xl mb-4">
              {summary.split(" ").slice(0, 20).join(" ")}
            </p>
            <div className="flex items-center text-gray-600 mb-6">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{contact.location}</span>
            </div>

            {/* Contact Icons */}
            <div className="flex space-x-4">
              <a
                href={`mailto:${contact.email}`}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Mail size={16} className="text-gray-600" />
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Phone size={16} className="text-gray-600" />
              </a>
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-600"
                >
                  <path
                    d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 3.681-2.123 5.159-.598.719-1.329 1.296-2.155 1.713-.617.312-1.288.484-1.998.484-.932 0-1.8-.209-2.555-.613-.755-.403-1.38-.98-1.832-1.696-.065-.103-.13-.206-.193-.311-.126-.21-.242-.425-.348-.645-.212-.44-.378-.902-.49-1.379-.224-.954-.224-1.946.002-2.897.113-.476.278-.938.49-1.378.106-.22.222-.435.348-.645.063-.105.128-.208.193-.311.452-.716 1.077-1.293 1.832-1.696.755-.404 1.623-.613 2.555-.613.71 0 1.381.172 1.998.484.826.417 1.557.994 2.155 1.713 1.227 1.478 1.954 3.301 2.123 5.159z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                <Linkedin size={16} className="text-gray-600" />
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="ml-8">
            <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden">
              <img
                src={data.image}
                alt="Profile"
                className="w-full h-full  rounded-full"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Work Experience
          </h2>

          {mappedWorkExperience.map((job: WorkExperience, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {job.company}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {job.title} · {job.type}
                  </p>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {job.duration}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">{job.location}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {job.description}
              </p>
            </div>
          ))}
        </section>

        {/* Education Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Education
          </h2>

          {mappedEducation.map((edu: Education, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {edu.institution}
                </h3>
                <span className="text-sm text-gray-600">{edu.duration}</span>
              </div>
              <p className="text-gray-600 text-sm">{edu.degree}</p>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-800 text-white text-sm rounded"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* GitHub Contribution Calendar */}
        {githubUrl && <GithubCalendarClient username={githubUsername} />}
      </div>
      {/* Footer */}
      <footer className="text-center p-8 border-t border-gray-200">
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
  );
}
