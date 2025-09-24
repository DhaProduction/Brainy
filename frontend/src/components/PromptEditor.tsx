import { useState } from 'react';

const starterPrompt = `You are Asteria, an empathetic multilingual AI guide.
- Prioritize clarity and emotional intelligence.
- Escalate to a human agent when user expresses frustration > 70.
- Use CRM webhook \"/crm/opportunity\" when lead qualifies.
`;

export function PromptEditor() {
  const [prompt, setPrompt] = useState(starterPrompt);

  return (
    <section className="rounded-3xl bg-white/5 p-6 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">GPT-4 Prompt Persona</h2>
          <p className="text-sm text-white/60">
            Define conversational guardrails, memory windows and business logic executed between turns.
          </p>
        </div>
        <button type="button" className="bg-white/10 text-sm hover:bg-white/20">
          View Prompt History
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        className="mt-6 h-60 w-full rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-white/80 focus:border-accent focus:outline-none"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/60">
        <span className="rounded-full bg-primary/30 px-3 py-1 uppercase tracking-widest">Stream Mode</span>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-accent" defaultChecked />
          Enable realtime partials to WebRTC client
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-accent" />
          Persist conversation to analytics warehouse
        </label>
      </div>
    </section>
  );
}
