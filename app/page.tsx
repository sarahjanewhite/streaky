"use client";

import { useEffect, useState } from "react";

// Edit these before you deploy.
const NAMES = {
  me: "Me",
  partner: "Bae",
};

interface StreakState {
  streak: number;
  meClicked: boolean;
  partnerClicked: boolean;
}

export default function Home() {
  const [state, setState] = useState<StreakState | null>(null);
  const [pending, setPending] = useState<"me" | "partner" | null>(null);

  useEffect(() => {
    fetch("/api/streak")
      .then((res) => res.json())
      .then(setState);
  }, []);

  async function click(person: "me" | "partner") {
    const alreadyClicked =
      person === "me" ? state?.meClicked : state?.partnerClicked;
    if (pending || !state || alreadyClicked) return;
    setPending(person);
    try {
      const res = await fetch("/api/streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ person }),
      });
      setState(await res.json());
    } finally {
      setPending(null);
    }
  }

  const bothDone = !!state?.meClicked && !!state?.partnerClicked;

  return (
    <main className="screen">
      <section className="display">
        <div className="num">{state ? state.streak : " "}</div>
        <div className="label">Day Streak</div>
        <div className={`status ${bothDone ? "done" : ""}`}>
          <span className="dot" />
          {bothDone ? "Locked in for today" : "Waiting on both of you"}
        </div>
      </section>

      <section className="actions">
        <PersonSlot
          name={NAMES.me}
          accent="var(--accent-me)"
          done={!!state?.meClicked}
          loading={pending === "me"}
          disabled={!state}
          onClick={() => click("me")}
        />
        <PersonSlot
          name={NAMES.partner}
          accent="var(--accent-partner)"
          done={!!state?.partnerClicked}
          loading={pending === "partner"}
          disabled={!state}
          onClick={() => click("partner")}
        />
      </section>

      <style jsx>{`
        .screen {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
        }

        .display {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
        }

        .num {
          font-weight: 800;
          font-size: clamp(96px, 32vw, 208px);
          line-height: 0.85;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 4px 32px rgba(0, 0, 0, 0.4);
          opacity: 0;
          animation: rise 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.05s forwards;
        }

        .label {
          margin-top: 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: rgba(243, 239, 233, 0.55);
          opacity: 0;
          animation: rise 0.6s ease 0.2s forwards;
        }

        .status {
          margin-top: 30px;
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(243, 239, 233, 0.62);
          opacity: 0;
          animation: rise 0.6s ease 0.32s forwards;
          transition: color 0.4s ease;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.6;
        }

        .status.done {
          color: var(--amber);
        }

        .status.done .dot {
          background: var(--amber);
          opacity: 1;
          box-shadow: 0 0 10px var(--amber);
        }

        .actions {
          display: flex;
          border-top: 1px solid rgba(243, 239, 233, 0.14);
          opacity: 0;
          animation: rise 0.6s ease 0.44s forwards;
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .num,
          .label,
          .status,
          .actions {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}

function PersonSlot({
  name,
  accent,
  done,
  loading,
  disabled,
  onClick,
}: {
  name: string;
  accent: string;
  done: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`slot ${done ? "done" : ""} ${loading ? "loading" : ""}`}
      style={{ "--accent": accent } as React.CSSProperties}
      onClick={onClick}
      disabled={disabled || done || loading}
    >
      <span className="name">{name}</span>
      <span className="mark">
        {done && (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12.5L9.5 18L20 6"
              pathLength="1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <style jsx>{`
        .slot {
          flex: 1;
          min-height: clamp(180px, 28vh, 260px);
          padding: 20px 12px calc(20px + env(safe-area-inset-bottom));
          border: none;
          background: transparent;
          color: inherit;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          cursor: pointer;
          -webkit-user-select: none;
          user-select: none;
          transition: background 0.35s ease, color 0.35s ease;
        }

        .slot + .slot {
          border-left: 1px solid rgba(243, 239, 233, 0.14);
        }

        .slot:active:not(:disabled) {
          background: rgba(243, 239, 233, 0.08);
        }

        .slot:disabled {
          cursor: default;
        }

        .name {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .mark {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mark svg {
          width: 100%;
          height: 100%;
        }

        .mark svg path {
          stroke: var(--accent);
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw 0.4s ease forwards;
        }

        .slot.done {
          background: var(--accent);
          color: #0b0b0c;
        }

        .slot.done .mark svg path {
          stroke: #0b0b0c;
        }

        .slot.loading {
          opacity: 0.6;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .mark svg path {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </button>
  );
}
