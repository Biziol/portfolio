import { pdf } from "@react-pdf/renderer";
import { Buffer } from "buffer";
import createCvDocument from "../components/cv/CvDocument";
import { createCvData } from "../utils/createCvData";
import { getAllSkills } from "./skillService";
import { getWorkAndTrainings } from "./workAndTrainingService";
import { getCvSignature } from "./cvSignatureService";

async function preparePhoto(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  const scale = Math.min(1, 320 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Impossibile preparare la foto del CV");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

export async function downloadCv() {
  // The PDF image layout uses the Node Buffer API even in its browser build.
  if (!("Buffer" in globalThis)) {
    Object.defineProperty(globalThis, "Buffer", { value: Buffer, configurable: true, writable: true });
  }
  const [skills, entries, signature] = await Promise.all([getAllSkills(), getWorkAndTrainings(), getCvSignature()]);
  const data = createCvData(skills, entries);
  data.signature = signature;
  const { hostname, origin } = window.location;
  const isLocal = import.meta.env.DEV || hostname === "localhost" ||
    hostname.endsWith(".localhost") || hostname.startsWith("127.") || hostname === "[::1]";
  data.profile = {
    ...data.profile,
    portfolioUrl: isLocal ? data.profile.portfolioUrl : origin,
    photo: await preparePhoto(data.profile.photo),
  };
  const blob = await pdf(createCvDocument(data)).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Fabrizio_Lombardi_CV.pdf";
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    // Leave time for browsers to consume the URL before releasing the PDF.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
}
