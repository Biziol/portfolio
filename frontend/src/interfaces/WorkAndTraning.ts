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
  graduation: number;
  graduationType: GraduationType;
  website: string;
  type: WorkType;
  arguments: Argument[] | null;
}
