import Head from 'next/head';
import { DragDropCanvas } from '../src/components/DragDropCanvas';
import { VoiceSampleUploader } from '../src/components/VoiceSampleUploader';
import { EmotionControlPanel } from '../src/components/EmotionControlPanel';
import { PromptEditor } from '../src/components/PromptEditor';

export default function Home() {
  return (
    <>
      <Head>
        <title>Brainy Voice Studio</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-10 lg:py-16">
        <header className="rounded-3xl bg-gradient-to-br from-primary/30 via-slate-900 to-black p-10 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-white/50">Brainy Platform</p>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">
                Compose bespoke voice agents in minutes
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/70">
                Upload samples, orchestrate GPT-4 logic, and deploy omnichannel voice experiences with a
                drag-and-drop studio.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl bg-black/40 p-6 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Minutes this month</span>
                <span className="text-2xl font-bold text-white">72 / 100</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-2 w-[72%] rounded-full bg-accent" />
              </div>
              <p>Upgrade to unlock unlimited streaming, dedicated clusters and premium cloning.</p>
              <button type="button" className="bg-accent text-black hover:bg-amber-400">View Pricing</button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <VoiceSampleUploader />
          <EmotionControlPanel />
        </section>

        <PromptEditor />

        <DragDropCanvas />
      </main>
    </>
  );
}
