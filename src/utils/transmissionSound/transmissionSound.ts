/**
 * Sounds for the subscribe transmission.
 *
 * Three files, three gains, all in `public/sounds/` and decoded into Web
 * Audio buffers. `type-in.mp3` is cut so the end meets the start, and one
 * buffer source with `loop` plays it for as long as the terminal is typing.
 * That source runs at half speed, so the same seam still meets and the
 * beeps land about half as often.
 *
 * Hovering or focusing the subscribe button only decodes. Nothing is audible
 * until the click, which is what resumes the audio context. A missing file,
 * a decode error, or a browser with no Web Audio does nothing, and never
 * gets in the way of subscribing.
 */

/**
 * 0 is silent, 1 is the file at its own level. This is the only place the
 * three levels are set. The type-in loop sits under the other two so the
 * rounder mini-beeps stay in the background while the line is printing.
 */
export const TRANSMISSION_SOUND_GAINS = {
  beamUp: 0.5,
  terminalOpen: 0.45,
  typeIn: 0.16,
} as const;

/** Half speed on the looping buffer. The seam is in the samples, so it holds. */
const TYPE_IN_PLAYBACK_RATE = 0.5;

const FILES = {
  beamUp: "/sounds/beam-up.mp3",
  terminalOpen: "/sounds/terminal-open.mp3",
  typeIn: "/sounds/type-in.mp3",
} as const;

type SoundName = keyof typeof FILES;
type AudioContextCtor = typeof AudioContext;

let context: AudioContext | null = null;
/** Set from the subscribe click. Playback before that stays silent. */
let unlocked = false;
/** Bumped when the takeover goes away, so a load that finishes late stays quiet. */
let session = 0;
const buffers = new Map<SoundName, AudioBuffer>();
const loading = new Map<SoundName, Promise<AudioBuffer | null>>();

let beamToken = 0;
let beamSource: AudioBufferSourceNode | null = null;
let openToken = 0;
let openSource: AudioBufferSourceNode | null = null;
let typeInToken = 0;
let typeInSource: AudioBufferSourceNode | null = null;
let typeInGain: GainNode | null = null;

function audioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  const legacy = (window as Window & { webkitAudioContext?: AudioContextCtor })
    .webkitAudioContext;
  return window.AudioContext ?? legacy ?? null;
}

function getContext(): AudioContext | null {
  if (context) return context;
  const Ctor = audioContextCtor();
  if (!Ctor) return null;
  try {
    context = new Ctor();
    return context;
  } catch {
    return null;
  }
}

async function load(name: SoundName): Promise<AudioBuffer | null> {
  const cached = buffers.get(name);
  if (cached) return cached;

  const pending = loading.get(name);
  if (pending) return pending;

  const job = (async () => {
    try {
      const ctx = getContext();
      if (!ctx) return null;
      const response = await fetch(FILES[name]);
      if (!response.ok) return null;
      const bytes = await response.arrayBuffer();
      // decodeAudioData detaches its input in some browsers.
      const audio = await ctx.decodeAudioData(bytes.slice(0));
      buffers.set(name, audio);
      return audio;
    } catch {
      return null;
    } finally {
      loading.delete(name);
    }
  })();

  loading.set(name, job);
  return job;
}

function stopNode(node: AudioBufferSourceNode | null) {
  if (!node) return;
  try {
    node.stop();
  } catch {
    // Already stopped.
  }
}

/**
 * Decode the clips. Safe to call from hover or focus: it does not resume
 * the context and does not start a source.
 */
export function preloadTransmissionSounds() {
  try {
    void load("beamUp");
    void load("terminalOpen");
    void load("typeIn");
  } catch {
    // Silent.
  }
}

/**
 * Call from the subscribe click, before the request leaves. Browsers only
 * resume audio from a user gesture, and the transmission itself arrives
 * after the network round trip.
 */
export function unlockTransmissionSound() {
  unlocked = true;
  try {
    const ctx = getContext();
    if (!ctx) return;
    void ctx.resume().catch(() => undefined);
    void load("beamUp");
    void load("terminalOpen");
    void load("typeIn");
  } catch {
    // Silent.
  }
}

async function playOnce(
  name: "beamUp" | "terminalOpen",
  isCurrent: () => boolean,
  remember: (source: AudioBufferSourceNode) => void,
) {
  const ticket = session;
  try {
    const ctx = getContext();
    if (!ctx || !unlocked || ticket !== session || !isCurrent()) return;
    if (ctx.state === "suspended") await ctx.resume();
    const buffer = await load(name);
    if (!buffer || !unlocked || ticket !== session || !isCurrent()) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = TRANSMISSION_SOUND_GAINS[name];
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    remember(source);
  } catch {
    // Silent. The picture does not depend on the speaker.
  }
}

/** Once, as the beam takes the page. No-op until the subscribe click. */
export function playBeamUp() {
  if (!unlocked) return;
  const token = ++beamToken;
  void playOnce(
    "beamUp",
    () => token === beamToken,
    (source) => {
      stopNode(beamSource);
      beamSource = source;
      source.onended = () => {
        if (beamSource === source) beamSource = null;
      };
    },
  );
}

/** Once, as the terminal appears. No-op until the subscribe click. */
export function playTerminalOpen() {
  if (!unlocked) return;
  const token = ++openToken;
  void playOnce(
    "terminalOpen",
    () => token === openToken,
    (source) => {
      openSource = source;
      source.onended = () => {
        if (openSource === source) openSource = null;
      };
    },
  );
}

/**
 * The chirps under the typing. One looping source — calling this again
 * while it is already running does not add another voice.
 */
export function startTypeInLoop() {
  if (!unlocked || typeInSource) return;
  const ticket = session;
  const token = ++typeInToken;

  void (async () => {
    try {
      const ctx = getContext();
      if (!ctx || !unlocked || ticket !== session || token !== typeInToken)
        return;
      if (ctx.state === "suspended") await ctx.resume();
      const buffer = await load("typeIn");
      if (
        !buffer ||
        !unlocked ||
        ticket !== session ||
        token !== typeInToken ||
        typeInSource
      )
        return;

      const gain = ctx.createGain();
      gain.gain.value = TRANSMISSION_SOUND_GAINS.typeIn;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.playbackRate.value = TYPE_IN_PLAYBACK_RATE;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      typeInSource = source;
      typeInGain = gain;
    } catch {
      // Silent.
    }
  })();
}

/** Fades the chirps out. The beam and the open beep are left to finish. */
export function stopTypeInLoop() {
  typeInToken++;
  const source = typeInSource;
  const gain = typeInGain;
  typeInSource = null;
  typeInGain = null;
  if (!source) return;

  try {
    const ctx = getContext();
    if (ctx && gain) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.04);
    }
  } catch {
    // Fall through and stop the source anyway.
  }

  window.setTimeout(() => {
    stopNode(source);
    try {
      gain?.disconnect();
    } catch {
      // Already disconnected.
    }
  }, 60);
}

/** Unmount. Stops the loop and anything still ringing. */
export function stopTransmissionSounds() {
  session++;
  stopTypeInLoop();
  stopNode(beamSource);
  beamSource = null;
  stopNode(openSource);
  openSource = null;
}
