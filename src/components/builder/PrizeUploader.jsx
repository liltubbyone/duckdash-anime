import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Upload, Loader2, RefreshCw, Trash2, Trophy } from "lucide-react";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export default function PrizeUploader({ value, onChange }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setStatus("error");
      setError("Unsupported format. Use PNG, JPG, WEBP, or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus("error");
      setError("File too large. Max 8MB.");
      return;
    }
    setStatus("uploading");
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError("Upload failed. Please try again.");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  if (value) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-[12px] overflow-hidden border border-white/15 bg-white/[0.03] shrink-0">
          <Image src={value} fittingType="fit" className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[9px] bg-white/[0.06] border border-white/10 text-[12px] font-semibold text-slate-200 hover:bg-white/[0.1] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Replace
          </button>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[9px] bg-brand-red/10 border border-brand-red/20 text-[12px] font-semibold text-brand-red hover:bg-brand-red/20 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div>
      <label
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 h-32 rounded-[14px] border border-dashed cursor-pointer transition-all ${
          status === "error"
            ? "border-brand-red/40 bg-brand-red/[0.04]"
            : "border-white/15 bg-white/[0.02] hover:border-brand-cyan/50 hover:bg-white/[0.04]"
        }`}
      >
        {status === "uploading" ? (
          <>
            <Loader2 className="w-5 h-5 text-brand-cyan animate-spin" />
            <span className="text-[12px] text-slate-400">Uploading…</span>
          </>
        ) : status === "error" ? (
          <>
            <span className="text-brand-red text-[12px] font-semibold text-center px-3">{error}</span>
            <span className="text-[11px] text-slate-500">Tap to try again</span>
          </>
        ) : (
          <>
            <span className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-brand-yellow" />
            </span>
            <span className="text-[13px] font-semibold text-slate-200">Upload prize photo</span>
            <span className="text-[11px] text-slate-500">Drag & drop or tap · PNG/JPG/WEBP · max 8MB</span>
          </>
        )}
        <input ref={inputRef} type="file" accept={ACCEPTED.join(",")} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </label>
    </div>
  );
}