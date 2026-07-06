import { kv } from "@vercel/kv";

const KEY = "streak:state";
const STARTING_STREAK = 186;

export type Person = "me" | "partner";

export interface StreakState {
  streak: number;
  currentDate: string | null;
  lastCompletedDate: string | null;
  meClicked: boolean;
  partnerClicked: boolean;
}

const initialState: StreakState = {
  streak: STARTING_STREAK,
  currentDate: null,
  lastCompletedDate: null,
  meClicked: false,
  partnerClicked: false,
};

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

// Rolls the state forward to "today", resetting the streak to 0 if a day was
// skipped (neither day fully completed, or a gap of more than one day passed).
function rollForward(state: StreakState, today: string): StreakState {
  if (state.currentDate === null) {
    return { ...state, currentDate: today };
  }

  if (state.currentDate === today) {
    return state;
  }

  const dayWasCompleted = state.lastCompletedDate === state.currentDate;
  const isConsecutiveDay = daysBetween(state.currentDate, today) === 1;

  if (dayWasCompleted && isConsecutiveDay) {
    return {
      ...state,
      currentDate: today,
      meClicked: false,
      partnerClicked: false,
    };
  }

  return {
    ...state,
    streak: 0,
    currentDate: today,
    meClicked: false,
    partnerClicked: false,
  };
}

export async function getState(): Promise<StreakState> {
  const stored = (await kv.get<StreakState>(KEY)) ?? initialState;
  const today = todayUTC();
  const rolled = rollForward(stored, today);
  if (rolled !== stored) {
    await kv.set(KEY, rolled);
  }
  return rolled;
}

export async function registerClick(person: Person): Promise<StreakState> {
  const stored = (await kv.get<StreakState>(KEY)) ?? initialState;
  const today = todayUTC();
  let state = rollForward(stored, today);

  state = {
    ...state,
    meClicked: person === "me" ? true : state.meClicked,
    partnerClicked: person === "partner" ? true : state.partnerClicked,
  };

  if (state.meClicked && state.partnerClicked && state.lastCompletedDate !== today) {
    state = { ...state, streak: state.streak + 1, lastCompletedDate: today };
  }

  await kv.set(KEY, state);
  return state;
}
