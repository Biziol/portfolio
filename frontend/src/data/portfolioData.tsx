import type { ReactNode } from "react";
import { MailIcon, PhoneIcon, MapPinHouseIcon } from "lucide-react";
import Linkedin from "../assets/icons/Linkedin.svg?react";
import GitHub from "../assets/icons/Github.svg?react";
import { profile } from "./profile";

export interface ContactItem {
  id: string;
  field: string;
  value: string;
  href: string;
  icon: ReactNode;
}

const contactIcons: Record<string, ReactNode> = {
  email: <MailIcon className="w-6 h-6" />,
  phone: <PhoneIcon className="w-6 h-6" />,
  address: <MapPinHouseIcon className="w-6 h-6" />,
  github: <GitHub className="w-6 h-6" />,
  linkedin: <Linkedin className="w-6 h-6" />,
};

export const profileData = {
  ...profile,
  contacts: profile.contacts.map((contact): ContactItem => ({
    ...contact,
    icon: contactIcons[contact.id],
  })),
};
