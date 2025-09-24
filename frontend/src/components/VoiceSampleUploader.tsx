import { useState } from 'react';

export function VoiceSampleUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('default');

  return (
    <section className="rounded-3xl bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Voice Library</h2>
          <p className="text-sm text-white/60">
            Upload 5–20 second samples for zero-shot cloning. Supported formats: WAV, MP3, FLAC.
          </p>
        </div>
        <select
          value={selectedVoice}
          onChange={(event) => setSelectedVoice(event.target.value)}
          className="rounded-lg bg-black/40 px-4 py-2 text-sm focus:outline-none"
        >
          <option value="default">Default Voice</option>
          <option value="empathic">Empathic Support</option>
          <option value="sales">Sales Coach</option>
          <option value="assistant">Executive Assistant</option>
        </select>
      </div>

      <label
        htmlFor="voice-upload"
        className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/20 p-10 text-center text-white/60 transition hover:border-accent/50 hover:bg-black/40"
      >
        <input
          id="voice-upload"
          type="file"
          multiple
          accept="audio/*"
          className="hidden"
          onChange={(event) => {
            const selected = Array.from(event.target.files ?? []);
            setFiles(selected);
          }}
        />
        <span className="text-lg font-semibold text-white">Drop or browse audio</span>
        <span className="mt-2 text-sm">We automatically trim silence and normalise loudness.</span>
      </label>

      {files.length > 0 && (
        <ul className="mt-6 space-y-2 text-sm text-white/80">
          {files.map((file) => (
            <li key={file.name} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span>{file.name}</span>
              <span className="text-xs text-white/50">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="bg-accent text-slate-900 hover:bg-amber-400">
          Analyse Samples
        </button>
        <button type="button" className="bg-white/10 hover:bg-white/20">
          Generate Preview TTS
        </button>
      </div>
    </section>
  );
}
