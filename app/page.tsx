"use client";

import { useEffect, useState } from "react";

const NAMES = {
  me: "Sarah",
  partner: "Jalyn",
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

  function statusText() {
    if (!state) return "";
    if (bothDone) return "You both showed up today";
    if (state.meClicked) return `Waiting on ${NAMES.partner}`;
    if (state.partnerClicked) return `Waiting on ${NAMES.me}`;
    return "Waiting on you two";
  }

  return (
    <main className="screen">
      <section className="display">
        <div className="num">{state ? state.streak : " "}</div>
        <div className="label">Day Streak</div>
        <div className={`status ${bothDone ? "done" : ""}`}>
          <span className="dot" />
          {statusText()}
        </div>
      </section>

      <section className="buttons">
        <PersonButton
          name={NAMES.me}
          done={!!state?.meClicked}
          loading={pending === "me"}
          disabled={!state}
          onClick={() => click("me")}
        />
        <PersonButton
          name={NAMES.partner}
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
          color: var(--paper);
        }

        .status.done .dot {
          background: var(--paper);
          opacity: 1;
          box-shadow: 0 0 10px rgba(243, 239, 233, 0.7);
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 14px;
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
          padding: 0 24px calc(28px + env(safe-area-inset-bottom));
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
          .buttons {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}

function PersonButton({
  name,
  done,
  loading,
  disabled,
  onClick,
}: {
  name: string;
  done: boolean;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`pill ${done ? "done" : ""} ${loading ? "loading" : ""}`}
      onClick={onClick}
      disabled={disabled || done || loading}
    >
      <span className="name">{name}</span>
      {done && (
        <span className="mark">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M4 12.5L9.5 18L20 6"
              pathLength="1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}

      <style jsx>{`
        .pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 17px 20px;
          border-radius: 999px;
          border: 1.5px solid rgba(243, 239, 233, 0.3);
          background: transparent;
          color: var(--paper);
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          -webkit-user-select: none;
          user-select: none;
          transition: background 0.3s ease, border-color 0.3s ease,
            color 0.3s ease, transform 0.15s ease;
        }

        .pill:active:not(:disabled) {
          transform: scale(0.96);
        }

        .pill:disabled {
          cursor: default;
        }

        .pill.done {
          background: var(--paper);
          border-color: transparent;
          color: var(--ink);
        }

        .pill.loading {
          opacity: 0.6;
        }

        .mark {
          width: 15px;
          height: 15px;
          display: flex;
        }

        .mark svg {
          width: 100%;
          height: 100%;
        }

        .mark svg path {
          stroke: var(--ink);
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw 0.4s ease forwards;
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
