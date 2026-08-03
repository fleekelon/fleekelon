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
      // CJK has no spaces: count characters; for spaced scripts, count words.
      const trimmed = message.trim();
      const segments = /\s/.test(trimmed)
        ? trimmed.split(/\s+/).filter(Boolean)
        : Array.from(trimmed);
      setOutput(
        segments.length === 0 ? "" : segments.map(() => "呱").join(" ") + "。",
      );
    } else {
      setOutput("[解密失败] 未找到密钥。密钥也是一只鸭子。");
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
          编码消息
        </button>
        <button
          type="button"
          className={mode === "decode" ? "btn-primary" : "btn-ghost"}
          onClick={() => {
            setMode("decode");
            setOutput("");
          }}
        >
          解码消息
        </button>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder={mode === "encode" ? "写点机密内容……" : "粘贴密文(呱)……"}
        className="w-full resize-none rounded-xl border border-cream/20 bg-transparent p-4 font-mono text-sm outline-none placeholder:text-cream-dim/60 focus:border-accent"
      />
      <button type="button" className="btn-primary mt-4" onClick={run}>
        {mode === "encode" ? "加密" : "解密"}
      </button>
      {output && (
        <p className="mt-5 rounded-xl border border-cream/10 bg-ink p-4 font-mono text-sm text-accent">
          {output}
        </p>
      )}
      <p className="mt-4 font-mono text-xs text-cream-dim">
        端到端。耳到耳。军用级有损压缩:100% 的语义已被丢弃。
      </p>
    </div>
  );
}
