"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RoastResultView } from "@/components/roast-result";
import { ShareBar } from "@/components/share-bar";
import { isGithubPages, pagesSiteUrl, withBasePath } from "@/lib/hosting";
import { CATEGORIES, CATEGORY_LABELS, EXAMPLES, STAGES, STAGE_LABELS, parseCategory, parseStage, roast, type RoastResult } from "@/lib/roast";
import { PUBLIC_URL, resultPath } from "@/lib/site";

const MAX = 600;

export function RoastForm({ initial }: { initial?: { pitch?: string; stage?: string | null; category?: string | null } }) {
  const router = useRouter();
  const [pitch, setPitch] = useState(initial?.pitch ?? "");
  const [stage, setStage] = useState(initial?.stage ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const words = pitch.trim() ? pitch.trim().split(/\s+/).length : 0;

  const form = (
    <form
      action={isGithubPages ? withBasePath("/") : "/r"}
      method="get"
      onSubmit={(e) => {
        e.preventDefault();
        const text = pitch.trim();
        if (!text) return;
        if (isGithubPages) {
          setResult(roast(text, parseStage(stage), parseCategory(category)));
          return;
        }
        setBusy(true);
        router.push(resultPath(text, stage || null, category || null));
      }}
      className="rounded-3xl border border-line bg-panel/70 p-4 sm:p-6"
    >
      <label htmlFor="pitch" className="text-sm font-semibold text-foreground">
        Your pitch <span className="font-normal text-muted">(one to five sentences)</span>
      </label>
      <textarea
        id="pitch"
        name="p"
        required
        maxLength={MAX}
        rows={4}
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        placeholder="Who it's for, the pain, what you built, one number, how customers find you."
        className="mt-2 w-full resize-y rounded-2xl border border-line bg-black/40 px-4 py-3 text-base leading-relaxed text-foreground placeholder:text-muted/70 focus:border-flame/70 focus:outline-none"
      />
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
        <span>{words} words</span>
        <span>
          {pitch.length}/{MAX}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-muted">
          Stage <span className="text-muted/70">(optional)</span>
          <select
            name="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-foreground"
          >
            <option value="">Any</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-muted">
          Category <span className="text-muted/70">(optional)</span>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-foreground"
          >
            <option value="">Any</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-muted">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setPitch(ex.pitch);
                setStage(ex.stage);
                setCategory(ex.category);
              }}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-flame/60 hover:text-foreground"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={busy || !pitch.trim()}
          data-testid="roast-submit"
          className="inline-flex items-center justify-center rounded-full bg-flame px-6 py-3 text-sm font-bold text-black hover:bg-flame/90 disabled:opacity-50"
        >
          {busy ? "Roasting…" : "Roast my pitch"}
        </button>
      </div>
    </form>
  );

  if (!isGithubPages || !result) return form;

  const shareUrl = `${pagesSiteUrl(PUBLIC_URL)}/`;
  return (
    <div>
      {form}
      <div className="mt-6">
        <RoastResultView r={result} />
        <section className="mt-6 rounded-3xl border border-line bg-panel/50 p-5">
          <h2 className="text-sm font-semibold text-foreground">Share this roast</h2>
          <p className="mt-1 text-sm text-muted">Share the roast tool. A link to this exact result returns when hosting is back.</p>
          <div className="mt-3">
            <ShareBar url={shareUrl} text={`My startup pitch got ${result.total}/50 from five judges: ${result.verdict.label}. Roast yours:`} />
          </div>
        </section>
      </div>
    </div>
  );
}
