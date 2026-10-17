import type { profile } from "../data/profile";
import type { CvSignature } from "../services/cvSignatureService";

export interface CvEntry {
  id: number;
  title: string;
  organization: string;
  location: string;
  period: string;
  website?: string;
  details: string[];
  qualification?: string;
}

export interface CvData {
  profile: typeof profile;
  skills: { field: string; names: string[] }[];
  work: CvEntry[];
  training: CvEntry[];
  signature?: CvSignature | null;
}
