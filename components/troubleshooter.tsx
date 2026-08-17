"use client";

import { useEffect, useRef, useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";
import type { Locale } from "@/lib/i18n/config";
import type { TroubleshooterNode } from "@/lib/types";

export function Troubleshooter({
  nodes,
  messages,
  categoryId,
  locale,
}: {
  nodes: TroubleshooterNode[];
  messages: Record<string, string>;
  categoryId: string;
  locale: Locale;
}) {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<string[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldMoveFocus = useRef(false);
  const hasStarted = useRef(false);
  const node = nodes.find((candidate) => candidate.id === currentId) ?? nodes[0];
  const progress = Math.min(100, 34 + history.length * 33);

  useEffect(() => {
    if (shouldMoveFocus.current) headingRef.current?.focus();
  }, [currentId]);

  function choose(nextNodeId: string) {
    const nextNode = nodes.find((candidate) => candidate.id === nextNodeId);
    if (!hasStarted.current) {
      hasStarted.current = true;
      trackAnalyticsEvent("troubleshooter_started", { category_id: categoryId, locale });
    }
    if (nextNode?.kind === "outcome") {
      trackAnalyticsEvent("troubleshooter_completed", {
        category_id: categoryId,
        locale,
        outcome_id: nextNode.id,
        safety_level: nextNode.safetyLevel,
        step_count: history.length + 1,
      });
    }
    shouldMoveFocus.current = true;
    setHistory((current) => [...current, currentId]);
    setCurrentId(nextNodeId);
  }
  function goBack() {
    const previousId = history.at(-1);
    if (!previousId) return;
    shouldMoveFocus.current = true;
    setHistory((current) => current.slice(0, -1));
    setCurrentId(previousId);
  }
  function reset() {
    shouldMoveFocus.current = true;
    hasStarted.current = false;
    setHistory([]);
    setCurrentId("start");
    if (currentId === "start") headingRef.current?.focus();
  }

  return (
    <div className="troubleshooter-card">
      <div className="troubleshooter-progress" role="progressbar" aria-label={messages.troubleshooterProgress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="troubleshooter-content" aria-live="polite">
        <span className="eyebrow">{node.eyebrow}</span>
        <h2 ref={headingRef} tabIndex={-1}>{node.title}</h2>
        <p>{node.body}</p>
        {node.kind === "question" ? (
          <div className="choice-list">
            {node.options.map((option) => (
              <button type="button" key={option.nextNodeId} onClick={() => choose(option.nextNodeId)}>
                <span>{option.label}</span><span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        ) : null}
        {node.kind === "outcome" ? (
          <div className={`outcome-note outcome-${node.safetyLevel}`}>{messages.troubleshooterBoundary}</div>
        ) : null}
      </div>
      <div className="troubleshooter-controls">
        <button type="button" className="button-secondary" onClick={goBack} disabled={!history.length}>{messages.back}</button>
        <button type="button" className="button-quiet" onClick={reset}>{messages.startOver}</button>
      </div>
    </div>
  );
}
