import { useRef, useState, type PointerEvent } from "react";
import Button from "../../../components/ui/Button";

export default function SignaturePad({ disabled, onChange }: {
  disabled: boolean;
  onChange: (file: File | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<number | null>(null);
  const [empty, setEmpty] = useState(true);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * canvas.width / bounds.width,
      y: (event.clientY - bounds.top) * canvas.height / bounds.height };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (disabled || pointer.current !== null || event.button !== 0) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    event.preventDefault();
    pointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.strokeStyle = "#16181d";
    context.fillStyle = "#16181d";
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.arc(x, y, 1.25, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(x, y);
    setEmpty(false);
  }

  function draw(event: PointerEvent<HTMLCanvasElement>) {
    if (disabled || pointer.current !== event.pointerId) return;
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  }

  function finish(event: PointerEvent<HTMLCanvasElement>) {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    const base64 = event.currentTarget.toDataURL("image/png").split(",")[1];
    const pixels = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    onChange(new File([pixels], "firma.png", { type: "image/png" }));
  }

  function clear() {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    pointer.current = null;
    setEmpty(true);
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <p id="signature-pad-help" className="text-sm text-foreground/60">Firma nel riquadro con la tavoletta grafica, il mouse o il dito. Per inserire una firma già pronta puoi caricare un’immagine qui sotto.</p>
      <canvas ref={canvasRef} width={900} height={240} aria-label="Area per disegnare la firma"
        aria-describedby="signature-pad-help" aria-disabled={disabled}
        className="w-full aspect-[15/4] rounded-xl border border-border bg-white touch-none select-none"
        style={{ cursor: disabled ? "default" : "crosshair" }}
        onPointerDown={start} onPointerMove={draw} onPointerUp={finish}
        onPointerCancel={finish} onLostPointerCapture={finish} />
      <Button variant="secondary" disabled={disabled || empty} onClick={clear}>Cancella disegno</Button>
    </div>
  );
}
