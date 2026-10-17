import { apiClient } from "./apiClient";

export interface CvSignature {
  imageDataUrl: string;
  signedOn: string;
}

export async function getCvSignature(): Promise<CvSignature | null> {
  const response = await apiClient.get<CvSignature>("/cv/signature");
  return response.status === 204 ? null : response.data;
}

export async function saveCvSignature(image: File, signedOn: string): Promise<CvSignature> {
  const body = new FormData();
  body.append("image", image);
  body.append("signedOn", signedOn);
  const response = await apiClient.put<CvSignature>("/cv/signature", body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function deleteCvSignature(): Promise<void> {
  await apiClient.delete("/cv/signature");
}
