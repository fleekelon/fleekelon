import { useState } from "react";

/**
 * Squeak-to-squeak encryption. Lossy by design: encoding maps every word
 * to the same ciphertext token, which makes decryption pleasingly impossible.
 */
export default function SqueakCipher() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState("");

  function run() {
    if (mode === "encode") {
      const words = message.trim().split(/\s+/).filter(Boolean);
      setOutput(
        words.length === 0 ? "" : words.map(() => "quack").join(" ") + ".",
      );
    } else {
      setOutput("[DECRYPTION FAILED] Key not found. The key is also a duck.");
    }
  }

  return (
    <div className="card p-6">
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          className={mode === "encode" ? "btn-primary" : "btn-ghost"}
          onClick={() => {
            setMode("encode");
            setOutput("");
          }}
        >
          Encode message
        </button>
        <button
          type="button"
          className={mode === "decode" ? "btn-primary" : "btn-ghost"}
          onClick={() => {
            setMode("decode");
            setOutput("");
          }}
        >
          Decode message
        </button>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder={
          mode === "encode"
            ? "Write something confidential…"
            : "Paste ciphertext (quacks)…"
        }
        className="w-full resize-none rounded-xl border border-cream/20 bg-transparent p-4 font-mono text-sm outline-none placeholder:text-cream-dim/60 focus:border-accent"
      />
      <button type="button" className="btn-primary mt-4" onClick={run}>
        {mode === "encode" ? "Encrypt" : "Decrypt"}
      </button>
      {output && (
        <p className="mt-5 rounded-xl border border-cream/10 bg-ink p-4 font-mono text-sm text-accent">
          {output}
        </p>
      )}
      <p className="mt-4 font-mono text-xs text-cream-dim">
        End-to-end. Ears-to-ears. Military-grade lossy compression: 100% of
        semantics discarded.
      </p>
    </div>
  );
}
