import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

type BlockType = 'voice' | 'emotion' | 'prompt' | 'webhook';

const blockConfig: Record<BlockType, { label: string; description: string }> = {
  voice: {
    label: 'Voice Sample',
    description: 'Attach zero-shot cloning samples and configure metadata.'
  },
  emotion: {
    label: 'Emotion Control',
    description: 'Tweak emotional intensity, tone and speed per flow node.'
  },
  prompt: {
    label: 'Prompt',
    description: 'Define GPT-4 personality instructions and fallback messages.'
  },
  webhook: {
    label: 'Webhook',
    description: 'Trigger CRM / PSTN integrations with JSON payloads.'
  }
};

function DraggableBlock({ id }: { id: BlockType }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-xl border border-white/10 bg-white/5 p-4 text-sm shadow-lg"
      style={style}
    >
      <h3 className="text-lg font-semibold">{blockConfig[id].label}</h3>
      <p className="text-xs text-white/70">{blockConfig[id].description}</p>
    </div>
  );
}

function FlowDropZone({ title }: { title: string }) {
  const { isOver, setNodeRef } = useDroppable({ id: title });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] rounded-3xl border-2 border-dashed ${
        isOver ? 'border-accent/80 bg-accent/10' : 'border-white/10'
      } p-6 transition-all`}
    >
      <h4 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
        {title}
      </h4>
      <div className="grid gap-4 text-white/70">Drop blocks here to craft journeys.</div>
    </div>
  );
}

export function DragDropCanvas() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4 rounded-3xl bg-white/5 p-6 shadow-xl backdrop-blur">
        <h2 className="text-xl font-semibold">Building Blocks</h2>
        <p className="text-sm text-white/60">
          Drag components to the orchestration canvas to create conditional flows,
          multi-turn prompts and integration hooks.
        </p>
        <div className="grid gap-4">
          {(Object.keys(blockConfig) as BlockType[]).map((block) => (
            <DraggableBlock key={block} id={block} />
          ))}
        </div>
      </aside>
      <DndContext onDragEnd={(event) => setActiveZone(event.over ? String(event.over.id) : null)}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Conversation Journey</h2>
              <p className="text-sm text-white/60">
                Build a personalised pipeline mapping STT &rarr; GPT-4 logic &rarr; Chatterbox TTS.
              </p>
            </div>
            <div className="rounded-full bg-primary/20 px-5 py-2 text-sm uppercase tracking-wide text-primary/90">
              {activeZone ? `Last drop: ${activeZone}` : 'Drag blocks to begin'}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {['Greeting', 'Qualification', 'Knowledge Base', 'Escalation'].map((stage) => (
              <FlowDropZone key={stage} title={stage} />
            ))}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
