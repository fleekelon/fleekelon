import { useState } from "react";

interface Turn {
  role: "user" | "duck";
  text: string;
}

/**
 * "Chat with QUACK-1". The model is famously deterministic:
 * every prompt resolves to the single ground-truth token.
 */
export default function AskQuack() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "duck",
      text: "Quack. (Ask me anything. I already know the answer.)",
    },
  ]);
  const [thinking, setThinking] = useState(false);

  function send() {
    const prompt = input.trim();
    if (!prompt || thinking) return;
    setInput("");
    setTurns((t) => [...t, { role: "user", text: prompt }]);
    setThinking(true);
    window.setTimeout(() => {
      setTurns((t) => [...t, { role: "duck", text: "Quack." }]);
      setThinking(false);
    }, 900);
  }

  return (
    <div className="card flex h-full flex-col p-6">
      <p className="eyebrow mb-4">quack-1 · live inference · 0 tokens/s</p>
      <div
        className="flex-1 space-y-3 overflow-y-auto font-mono text-sm"
        style={{ minHeight: "10rem" }}
      >
        {turns.map((turn, i) => (
          <p
            key={i}
            className={turn.role === "duck" ? "text-accent" : "text-cream-dim"}
          >
            <span className="mr-2 select-none">
              {turn.role === "duck" ? ">" : "$"}
            </span>
            {turn.text}
          </p>
        ))}
        {thinking && (
          <p className="text-accent animate-pulse">&gt; reasoning…</p>
        )}
      </div>
      <div className="mt-5 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Hey @quack, can you fix my segfault?"
          className="w-full rounded-full border border-cream/20 bg-transparent px-5 py-3 font-mono text-sm outline-none placeholder:text-cream-dim/60 focus:border-accent"
        />
        <button className="btn-primary" onClick={send} type="button">
          Send
        </button>
      </div>
    </div>
  );
}
