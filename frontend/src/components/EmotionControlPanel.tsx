import { useState } from 'react';

const ranges = [
  { key: 'warmth', label: 'Emotional Warmth' },
  { key: 'energy', label: 'Vocal Energy' },
  { key: 'pace', label: 'Speaking Pace' }
];

export function EmotionControlPanel() {
  const [values, setValues] = useState({ warmth: 60, energy: 40, pace: 90 });

  return (
    <section className="rounded-3xl bg-white/5 p-6 shadow-xl backdrop-blur">
      <h2 className="text-2xl font-semibold">Emotional Controls</h2>
      <p className="text-sm text-white/60">
        Fine-tune TTS output with frame-level prosody tags pushed to Chatterbox for expressive voices.
      </p>
      <div className="mt-6 space-y-6">
        {ranges.map((range) => (
          <label key={range.key} className="block text-sm">
            <div className="mb-2 flex items-center justify-between text-white/70">
              <span>{range.label}</span>
              <span className="text-xs text-accent">{values[range.key as keyof typeof values]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={values[range.key as keyof typeof values]}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  [range.key]: Number(event.target.value)
                }))
              }
              className="w-full accent-accent"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 text-xs text-white/60">
        <span className="rounded-full bg-primary/30 px-3 py-1 uppercase tracking-widest">Preset</span>
        <button type="button" className="bg-white/10 hover:bg-white/20">
          Save as Template
        </button>
        <button type="button" className="bg-white/10 hover:bg-white/20">
          Reset
        </button>
      </div>
    </section>
  );
}
