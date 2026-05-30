import type { ComponentType, SVGProps } from "react";
import { LayoutGrid, ServerCog, Database, Boxes } from "lucide-react";

export type SKILL_FIELD = "FRONTEND" | "BACKEND" | "DATABASE" | "DEVOPS";

export const SKILL_FIELDS: SKILL_FIELD[] = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
];

export const SKILL_FIELD_ICONS: Record<
  SKILL_FIELD,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  FRONTEND: LayoutGrid,
  BACKEND: ServerCog,
  DATABASE: Database,
  DEVOPS: Boxes,
};
