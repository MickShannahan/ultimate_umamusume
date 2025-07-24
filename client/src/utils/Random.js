import { RaceState } from "@/AppState.js";

// --- PRNG: Mulberry32 ---
function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- Hash a 9-digit seed + time to make a 32-bit number ---
function hashSeedAndTime(seed, time) {
  const str = `${seed}_${time}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// --- Create PRNG from seed and time ---
function createRNG(seed, timeMs) {
  const hashed = hashSeedAndTime(seed, timeMs);
  return mulberry32(hashed);
}

// --- Random Int: inclusive ---
export function randomInt(min = 0, max = 1, timeMs = 1) {
  const seed = RaceState.seed
  const rng = createRNG(seed, timeMs);
  return Math.floor(rng() * (max - min + 1)) + min;
}

// --- Random Float: inclusive ---
export function randomFloat(min = 0, max = 1, timeMs = 1) {
  const seed = RaceState.seed
  const rng = createRNG(seed, timeMs);
  return rng() * (max - min) + min;
}

// --- Random from Array ---
export function randomFromArray(array = [0, 1], timeMs = 1) {
  const seed = RaceState.seed
  const rng = createRNG(seed, timeMs);
  const index = Math.floor(rng() * array.length);
  return array[index];
}
