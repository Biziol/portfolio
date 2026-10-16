import { profile } from "../data/profile";
import type { CvData, CvEntry } from "../interfaces/CvData";
import type { Skill } from "../interfaces/Skill";
import type { WorkAndTraning } from "../interfaces/WorkAndTraning";

const skillFields = ["FRONTEND", "BACKEND", "DATABASE", "DEVOPS"];
const monthFormat = new Intl.DateTimeFormat("it-IT", {
  month: "short",
  year: "numeric",
  timeZone: "Europe/Rome",
});

function formatMonth(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : monthFormat.format(date);
}

function qualification(entry: WorkAndTraning) {
  if (entry.graduation == null) return undefined;
  switch (entry.graduationType) {
    case "EQF": return `Livello EQF: ${entry.graduation}`;
    case "TEN_BASE": return `Voto: ${entry.graduation}/10`;
    case "HUNDRED_BASE": return `Voto: ${entry.graduation}/100`;
    default: return undefined;
  }
}

function toEntry(entry: WorkAndTraning, today: string): CvEntry {
  const ongoing = !entry.endDate || entry.endDate.slice(0, 10) >= today;
  return {
    id: entry.id,
    title: entry.title,
    organization: entry.instituteOrCompany,
    location: entry.location,
    period: `${formatMonth(entry.startDate)} – ${ongoing ? "In corso" : formatMonth(entry.endDate!)}`,
    website: /^https?:\/\//i.test(entry.website ?? "") ? entry.website : undefined,
    details: (entry.arguments ?? []).map((argument) => argument.text).filter(Boolean),
    qualification: entry.type === "TRAINING" ? qualification(entry) : undefined,
  };
}

export function createCvData(skills: Skill[], entries: WorkAndTraning[], now = new Date()): CvData {
  if (!Array.isArray(skills) || !Array.isArray(entries)) {
    throw new Error("Dati del CV non disponibili");
  }
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  const sorted = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate));
  return {
    profile,
    skills: skillFields.map((field) => ({
      field,
      names: [...new Set(skills.filter((skill) => skill.skillField === field)
        .map((skill) => skill.name.trim()).filter(Boolean))],
    })).filter((group) => group.names.length > 0),
    work: sorted.filter((entry) => entry.type === "WORK").map((entry) => toEntry(entry, today)),
    training: sorted.filter((entry) => entry.type === "TRAINING").map((entry) => toEntry(entry, today)),
  };
}
