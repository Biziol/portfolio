import { useEffect, useRef, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import SignaturePad from "./SignaturePad";
import { deleteCvSignature, getCvSignature, saveCvSignature, type CvSignature } from "../../../services/cvSignatureService";

function signatureError(error: unknown) {
  if (isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) {
    return "Accedi nuovamente come amministratore per modificare la firma.";
  }
  if (isAxiosError(error) && [400, 413].includes(error.response?.status ?? 0)) {
    return "Controlla la data e l’immagine: PNG o JPEG fino a 1 MB, massimo 4000 × 2000 pixel e 4 megapixel.";
  }
  return "Operazione non riuscita. Riprova tra poco.";
}

export default function CvSettings({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [saved, setSaved] = useState<CvSignature | null>(null);
  const [preview, setPreview] = useState("");
  const [signedOn, setSignedOn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempt, setAttempt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRead = useRef(0);
  const dirty = file !== null || signedOn !== (saved?.signedOn ?? "");

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => {
    if (!dirty) return;
    const preventClose = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", preventClose);
    return () => window.removeEventListener("beforeunload", preventClose);
  }, [dirty]);
  useEffect(() => {
    let active = true;
    getCvSignature().then((signature) => {
      if (!active) return;
      setSaved(signature); setPreview(signature?.imageDataUrl ?? ""); setSignedOn(signature?.signedOn ?? "");
      setLoading(false); setError("");
    }).catch((err: unknown) => { if (active) setError(signatureError(err)); });
    return () => { active = false; };
  }, [attempt]);

  function chooseFile(selected?: File) {
    const request = ++fileRead.current;
    if (!selected) return;
    setNotice("");
    if (!["image/png", "image/jpeg"].includes(selected.type) || selected.size > 1_048_576) {
      setError("Scegli un’immagine PNG o JPEG fino a 1 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (request !== fileRead.current) return;
      setPreview(String(reader.result)); setFile(selected); setError("");
    };
    reader.onerror = () => { if (request === fileRead.current) setError("Impossibile leggere l’immagine."); };
    reader.readAsDataURL(selected);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preview || !signedOn || busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const image = file ?? new File([await (await fetch(preview)).blob()], "firma.png", { type: "image/png" });
      const signature = await saveCvSignature(image, signedOn);
      setSaved(signature); setPreview(signature.imageDataUrl); setSignedOn(signature.signedOn); setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setNotice("Firma e data salvate. Compariranno nei prossimi CV scaricati.");
    } catch (err) { setError(signatureError(err)); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (busy || !window.confirm("Rimuovere la firma e la data dai prossimi CV?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await deleteCvSignature();
      ++fileRead.current;
      setSaved(null); setFile(null); setPreview(""); setSignedOn("");
      if (inputRef.current) inputRef.current.value = "";
      setNotice("Firma e data rimosse. Il testo di autorizzazione resta nel CV.");
    } catch (err) { setError(signatureError(err)); }
    finally { setBusy(false); }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <h2>Firma del CV</h2>
      <p className="text-foreground/60">Disegna la tua firma oppure carica un’immagine. La firma e la data saranno visibili nel CV pubblico, sotto l’autorizzazione al trattamento dei dati.</p>
      <p className="text-sm text-foreground/60">La firma viene inserita come immagine nel PDF. La data è quella che indichi qui, non la data del download.</p>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {loading ? (
        error ? <Button onClick={() => setAttempt((value) => value + 1)}>Riprova</Button> : <p role="status">Caricamento…</p>
      ) : (
        <form onSubmit={save} className="flex flex-col gap-5">
          <fieldset disabled={busy} className="flex flex-col gap-5 disabled:opacity-60">
            <SignaturePad key={saved?.imageDataUrl ?? "empty"} disabled={busy} onChange={(drawing) => {
              if (drawing) chooseFile(drawing);
              else {
                ++fileRead.current;
                setFile(null); setPreview(saved?.imageDataUrl ?? ""); setNotice("");
                if (inputRef.current) inputRef.current.value = "";
              }
            }} />
            <label className="flex flex-col gap-2">
              <span>Immagine della firma (PNG o JPEG, massimo 1 MB)</span>
              <input ref={inputRef} type="file" accept="image/png,image/jpeg" onChange={(event) => chooseFile(event.target.files?.[0])} />
            </label>
            {preview && <div className="rounded-xl border border-border bg-white p-4"><img src={preview} alt="Anteprima della firma" className="max-h-32 max-w-full object-contain" /></div>}
            <label className="flex flex-col gap-2">
              <span>Data della firma</span>
              <input type="date" required value={signedOn} onChange={(event) => setSignedOn(event.target.value)} className="rounded-xl bg-muted-foreground p-2 w-fit" />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={!preview || !signedOn || !dirty || busy}>{busy ? "Operazione in corso…" : "Salva firma e data"}</Button>
              {saved && <Button variant="secondary" disabled={busy} onClick={() => { void remove(); }}>Rimuovi firma</Button>}
            </div>
          </fieldset>
        </form>
      )}
    </Card>
  );
}
