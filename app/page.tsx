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
    <main className="wrap">
      <div className="flame">🔥</div>
      <div className="count">{state ? state.streak : " "}</div>
      <div className="label">day streak</div>

      <div className="buttons">
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
      </div>

      <div className={`status ${bothDone ? "done" : ""}`}>
        {bothDone ? "Streak extended for today ✨" : "Waiting for both of you…"}
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          text-align: center;
        }
        .flame {
          font-size: 48px;
          line-height: 1;
          filter: drop-shadow(0 0 20px rgba(255, 140, 60, 0.5));
        }
        .count {
          font-size: 96px;
          font-weight: 800;
          line-height: 1.1;
          margin-top: 4px;
          background: linear-gradient(135deg, #ffd7a8, #ff8fb1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .label {
          font-size: 15px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9b6d6;
          margin-bottom: 48px;
        }
        .buttons {
          display: flex;
          gap: 16px;
          width: 100%;
          max-width: 380px;
        }
        .status {
          margin-top: 32px;
          font-size: 14px;
          color: #a892b8;
          transition: color 0.3s ease;
        }
        .status.done {
          color: #ffb3d1;
          font-weight: 600;
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
      className={`btn ${done ? "done" : ""}`}
      onClick={onClick}
      disabled={disabled || done || loading}
    >
      <span className="check">{done ? "✓" : ""}</span>
      <span className="name">{name}</span>

      <style jsx>{`
        .btn {
          flex: 1;
          aspect-ratio: 1;
          border-radius: 28px;
          border: 2px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: #f5eef7;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.25s ease,
            border-color 0.25s ease, opacity 0.25s ease;
          -webkit-user-select: none;
          user-select: none;
        }
        .btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        .btn:disabled {
          cursor: default;
        }
        .btn.done {
          background: linear-gradient(135deg, #ff8fb1, #ff6b8b);
          border-color: transparent;
          color: #2a0f1c;
        }
        .check {
          font-size: 28px;
          height: 32px;
        }
      `}</style>
    </button>
  );
}
