import { useRef, useState } from "react";
import { DownloadIcon, Loader2Icon } from "lucide-react";
import Button from "../ui/Button";

export default function CvDownloadButton() {
  const busy = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError(false);
    try {
      const { downloadCv } = await import("../../services/cvService");
      await downloadCv();
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2" aria-busy={loading}>
      <Button className="w-full" onClick={handleDownload} disabled={loading}>
        {loading ? <Loader2Icon className="animate-spin" aria-hidden="true" /> : <DownloadIcon aria-hidden="true" />}
        <span aria-live="polite">{loading ? "Generazione CV…" : "Scarica CV (PDF)"}</span>
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          Non è stato possibile generare il CV. Riprova tra poco.
        </p>
      )}
    </div>
  );
}
