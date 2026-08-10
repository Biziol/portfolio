import type { Argument } from "./Argument";
import type { GraduationType } from "./enums/GraduationType";
import type { WorkType } from "./enums/WorkType";


export interface WorkAndTraning {
  id: number;
  title: string;
  instituteOrCompany: string;
  location: string;
  startDate: string;
  endDate: string | null;
  graduation: number | null;
  graduationType: GraduationType;
  website: string;
  type: WorkType;
  arguments: Argument[] | null;
}

export const emptyWorkAndTraining: WorkAndTraning = {
  id: 0,
  title: "",
  instituteOrCompany: "",
  location: "",
  startDate: "",
  endDate: null,
  graduation: null,
  graduationType: null as unknown as GraduationType,
  website: "",
  type: null as unknown as WorkType,
  arguments: null,
};