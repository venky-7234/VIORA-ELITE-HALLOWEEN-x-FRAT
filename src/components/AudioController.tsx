import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioSession {
  context: AudioContext;
  master: GainNode;
  nodes: AudioNode[];
  thunderTimer: number;
}

/** Opt-in, locally synthesized ambience. No recordings, remote requests, or autoplay. */
export function AudioController() {
  const sessionRef = useRef<AudioSession | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const dispose = () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
    if (sessionRef.current) {
      window.clearInterval(sessionRef.current.thunderTimer);
      sessionRef.current.nodes.forEach((node) => { try { node.disconnect(); } catch { /* already disconnected */ } });
      void sessionRef.current.context.close();
      sessionRef.current = null;
    }
  };

  useEffect(() => {
    const onVisibility = () => {
      const session = sessionRef.current;
      if (!session) return;
      if (document.visibilityState === "hidden" && session.context.state === "running") void session.context.suspend();
      if (document.visibilityState === "visible" && enabled && session.context.state === "suspended") void session.context.resume();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [enabled]);

  useEffect(() => dispose, []);

  const createSession = async () => {
    const AudioContextConstructor = window.AudioContext;
    if (!AudioContextConstructor) { setUnavailable(true); return; }
    const context = new AudioContextConstructor();
    await context.resume();
    const master = context.createGain(); master.gain.setValueAtTime(.0001, context.currentTime); master.connect(context.destination);
    const noiseBuffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < noise.length; index++) {
      previous = (previous + .018 * (Math.random() * 2 - 1)) / 1.018;
      noise[index] = previous * 3.5;
    }

    const windFilter = context.createBiquadFilter(); windFilter.type = "lowpass"; windFilter.frequency.value = 340; windFilter.connect(master);
    const wind = context.createBufferSource(); wind.buffer = noiseBuffer; wind.loop = true; wind.connect(windFilter); wind.start();

    const whisperFilter = context.createBiquadFilter(); whisperFilter.type = "bandpass"; whisperFilter.frequency.value = 720; whisperFilter.Q.value = .7;
    const whisperGain = context.createGain(); whisperGain.gain.value = .06; whisperFilter.connect(whisperGain); whisperGain.connect(master);
    const whisper = context.createBufferSource(); whisper.buffer = noiseBuffer; whisper.loop = true; whisper.connect(whisperFilter); whisper.start();
    const whisperLfo = context.createOscillator(); whisperLfo.frequency.value = .045;
    const whisperSweep = context.createGain(); whisperSweep.gain.value = 360; whisperLfo.connect(whisperSweep); whisperSweep.connect(whisperFilter.frequency); whisperLfo.start();

    const drone = context.createOscillator(); drone.type = "sine"; drone.frequency.value = 52;
    const droneGain = context.createGain(); droneGain.gain.value = .17; drone.connect(droneGain); droneGain.connect(master); drone.start();

    const creak = context.createOscillator(); creak.type = "triangle"; creak.frequency.value = 91;
    const creakGain = context.createGain(); creakGain.gain.value = .025; creak.connect(creakGain); creakGain.connect(master); creak.start();
    const creakLfo = context.createOscillator(); creakLfo.frequency.value = .031;
    const creakSweep = context.createGain(); creakSweep.gain.value = 16; creakLfo.connect(creakSweep); creakSweep.connect(creak.frequency); creakLfo.start();

    const thunderFilter = context.createBiquadFilter(); thunderFilter.type = "lowpass"; thunderFilter.frequency.value = 120;
    const thunderGain = context.createGain(); thunderGain.gain.value = .0001; thunderFilter.connect(thunderGain); thunderGain.connect(master);
    const thunder = context.createBufferSource(); thunder.buffer = noiseBuffer; thunder.loop = true; thunder.connect(thunderFilter); thunder.start();
    const thunderTimer = window.setInterval(() => {
      const now = context.currentTime;
      thunderGain.gain.cancelScheduledValues(now);
      thunderGain.gain.setValueAtTime(.0001, now);
      thunderGain.gain.linearRampToValueAtTime(.1, now + 1.4);
      thunderGain.gain.exponentialRampToValueAtTime(.0001, now + 6.5);
    }, 30000 + Math.random() * 15000);

    const droneLfo = context.createOscillator(); droneLfo.frequency.value = .08;
    const droneSweep = context.createGain(); droneSweep.gain.value = 5; droneLfo.connect(droneSweep); droneSweep.connect(drone.frequency); droneLfo.start();

    sessionRef.current = { context, master, thunderTimer, nodes: [master, windFilter, wind, whisperFilter, whisperGain, whisper, whisperLfo, whisperSweep, drone, droneGain, creak, creakGain, creakLfo, creakSweep, thunderFilter, thunderGain, thunder, droneLfo, droneSweep] };
    master.gain.linearRampToValueAtTime(.045, context.currentTime + 1.25);
    setEnabled(true);
  };

  const toggle = async () => {
    const session = sessionRef.current;
    if (!session) { await createSession(); return; }
    if (closeTimerRef.current !== null) { window.clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    if (enabled) {
      const now = session.context.currentTime;
      session.master.gain.cancelScheduledValues(now);
      session.master.gain.setValueAtTime(session.master.gain.value, now);
      session.master.gain.linearRampToValueAtTime(.0001, now + .45);
      setEnabled(false);
      closeTimerRef.current = window.setTimeout(dispose, 500);
    } else {
      await session.context.resume();
      const now = session.context.currentTime;
      session.master.gain.cancelScheduledValues(now);
      session.master.gain.setValueAtTime(session.master.gain.value, now);
      session.master.gain.linearRampToValueAtTime(.045, now + .8);
      setEnabled(true);
    }
  };

  return <button className="sound-toggle" type="button" onClick={toggle} aria-pressed={enabled} aria-label={unavailable ? "Sound unavailable in this browser" : enabled ? "Turn sound off" : "Turn sound on"} title={unavailable ? "Sound unavailable in this browser" : "Ambient sound is off until enabled"}>
    {enabled ? <Volume2 size={15}/> : <VolumeX size={15}/>}<span>SOUND {enabled ? "ON" : "OFF"}</span>
  </button>;
}
