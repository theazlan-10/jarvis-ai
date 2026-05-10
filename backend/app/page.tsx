"use client";
import { useState, useRef, useEffect } from "react";

// ── SOUND ENGINE ──
const createSound = (ctx: AudioContext, type: string) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "beep") {
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } else if (type === "scan") {
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  } else if (type === "powerup") {
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc.start(); osc.stop(ctx.currentTime + 1.5);
  } else if (type === "send") {
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  } else if (type === "receive") {
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } else if (type === "error") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  }
};

const speak = (text: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9; u.pitch = 0.8; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const deep = voices.find(v => v.name.toLowerCase().includes("male") || v.name.includes("Google UK English Male") || v.name.includes("Daniel"));
  if (deep) u.voice = deep;
  window.speechSynthesis.speak(u);
};

// ── BOOT LINES ──
const BOOT_SEQUENCE = [
  { text: "AZLAN OS v1.0 — INITIALIZING...", delay: 0 },
  { text: "LOADING NEURAL CORE...", delay: 700 },
  { text: "CALIBRATING AI SYSTEMS...", delay: 1400 },
  { text: "ESTABLISHING SECURE LINK...", delay: 2100 },
  { text: "SCANNING ENVIRONMENT...", delay: 2800 },
  { text: "THREAT LEVEL: NONE DETECTED", delay: 3500 },
  { text: "MEMORY BANKS: ONLINE", delay: 4000 },
  { text: "ALL SYSTEMS OPERATIONAL", delay: 4500 },
  { text: "WELCOME, AZLAN.", delay: 5200 },
];

type Mode = "cinematic" | "interactive" | "hacker";

export default function JARVIS() {
  const [phase, setPhase] = useState<"select" | "booting" | "ready">("select");
  const [mode, setMode] = useState<Mode>("cinematic");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [tokens, setTokens] = useState(0);
  const [time, setTime] = useState("");
  const [energy, setEnergy] = useState(97.4);
  const [scanText, setScanText] = useState("");
  const [glitch, setGlitch] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const getAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playSound = (type: string) => {
    try { createSound(getAudio(), type); } catch {}
  };

  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setTime(n.toLocaleTimeString("en-US", { hour12: false }));
      setEnergy(e => Math.min(100, Math.max(88, e + (Math.random() > 0.5 ? 0.2 : -0.2))));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startBoot = (selectedMode: Mode) => {
    setMode(selectedMode);
    setPhase("booting");
    playSound("powerup");

    if (selectedMode === "interactive") {
      setTimeout(() => speak("Initializing JARVIS. Welcome back, Azlan."), 500);
    }

    BOOT_SEQUENCE.forEach((line, i) => {
      setTimeout(() => {
        setBootLines(p => [...p, line.text]);
        setBootProgress(Math.round(((i + 1) / BOOT_SEQUENCE.length) * 100));
        playSound("beep");
        if (selectedMode === "hacker") {
          setTimeout(() => playSound("scan"), 100);
        }
      }, line.delay);
    });

    setTimeout(() => {
      playSound("powerup");
      if (selectedMode === "interactive") {
        speak("All systems online. How can I assist you today, Azlan?");
      }
      setGlitch(true);
      setTimeout(() => {
        setGlitch(false);
        setPhase("ready");
        if (selectedMode === "interactive") {
          setMessages([{
            role: "assistant",
            content: "Good to see you, Azlan. All systems are fully operational. I am JARVIS — your personal AI system. What shall we work on today?",
          }]);
        }
      }, 800);
    }, 6200);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    playSound("send");
    setMessages(p => [...p, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversation_id: convId, mode: "chat" }),
      });
      const data = await res.json();
      if (!convId) setConvId(data.conversation_id);
      setTokens(t => t + (data.tokens_used || 0));
      playSound("receive");
      const reply = data.response;
      setMessages(p => [...p, { role: "assistant", content: reply }]);
      if (mode === "interactive") speak(reply.slice(0, 200));
    } catch {
      playSound("error");
      setMessages(p => [...p, { role: "assistant", content: "⚠ Signal lost. Reconnecting to core systems..." }]);
    }
    setLoading(false);
  };

  const handleKey = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Format bold text
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "#00ddff", fontWeight: 900 }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // ── MODE SELECT SCREEN ──
  if (phase === "select") return (
    <div style={{
      height: "100vh", background: "#000408",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,100,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}/>

      {/* Arc Reactor */}
      <div style={{ position: "relative", width: 100, height: 100, marginBottom: 30 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute", inset: i*12, borderRadius: "50%",
            border: i<3 ? `1px solid rgba(0,${150+i*30},255,${0.7-i*0.15})` : "none",
            borderTop: i<3 ? `2px solid rgba(0,${190+i*20},255,0.9)` : "none",
            background: i===3 ? "radial-gradient(circle,#00ffff,#0077ff,#001144)" : "transparent",
            boxShadow: i===3 ? "0 0 15px #00ccff,0 0 30px #0066ff" : "none",
            animation: i<3 ? `${i%2===0?"spin":"spinR"} ${2+i*2}s linear infinite` : "pulse 2s ease-in-out infinite",
          }}/>
        ))}
      </div>

      <div style={{
        fontSize: 22, fontWeight: 900, letterSpacing: "0.4em",
        background: "linear-gradient(90deg,#00ccff,#ffffff,#00ccff)",
        backgroundSize: "200%",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        animation: "shimmer 3s linear infinite",
        marginBottom: 6,
      }}>J.A.R.V.I.S</div>

      <div style={{
        fontSize: 9, color: "rgba(0,180,255,0.4)",
        letterSpacing: "0.3em", marginBottom: 40,
      }}>AZLAN OS v1.0 — SELECT BOOT MODE</div>

      {/* Mode cards */}
      {[
        {
          id: "cinematic" as Mode,
          title: "🎬 CINEMATIC",
          sub: "Silent dramatic boot",
          desc: "Visual boot sequence with sounds. Pure style.",
          color: "#00aaff",
        },
        {
          id: "interactive" as Mode,
          title: "🤖 INTERACTIVE",
          sub: "JARVIS speaks to you",
          desc: "Voice greeting + JARVIS reads responses aloud.",
          color: "#00ff88",
        },
        {
          id: "hacker" as Mode,
          title: "💀 HACKER",
          sub: "Terminal system scan",
          desc: "Full hacker-style boot with scan effects.",
          color: "#ff4444",
        },
      ].map(m => (
        <div key={m.id} onClick={() => startBoot(m.id)} style={{
          width: "85%", maxWidth: 320,
          padding: "14px 18px", marginBottom: 12,
          background: "rgba(0,10,25,0.8)",
          border: `1px solid ${m.color}33`,
          borderLeft: `3px solid ${m.color}`,
          borderRadius: 4, cursor: "pointer",
          transition: "all 0.2s",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 900,
                color: m.color, letterSpacing: "0.15em",
                textShadow: `0 0 10px ${m.color}88`,
              }}>{m.title}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", marginTop: 2 }}>
                {m.sub}
              </div>
            </div>
            <div style={{ fontSize: 18, color: m.color }}>⟶</div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 8, lineHeight: 1.5 }}>
            {m.desc}
          </div>
        </div>
      ))}

      <div style={{ fontSize: 8, color: "rgba(0,150,255,0.2)", letterSpacing: "0.2em", marginTop: 20 }}>
        AZLAN © 2026 · ALL RIGHTS RESERVED
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinR{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
        @keyframes pulse{0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
      `}</style>
    </div>
  );

  // ── BOOT SCREEN ──
  if (phase === "booting") return (
    <div style={{
      height: "100vh", background: "#000408",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      position: "relative", overflow: "hidden",
      filter: glitch ? "hue-rotate(90deg) brightness(2)" : "none",
      transition: "filter 0.1s",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,100,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,100,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}/>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.1) 3px,rgba(0,0,0,0.1) 4px)",
      }}/>

      {/* Reactor */}
      <div style={{ position: "relative", width: 120, height: 120, marginBottom: 30 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute", inset: i*11, borderRadius: "50%",
            border: i<4 ? `1px solid rgba(0,${130+i*30},255,${0.6-i*0.1})` : "none",
            borderTop: i<4 ? `2px solid rgba(0,${180+i*20},255,${0.85-i*0.15})` : "none",
            background: i===4 ? "radial-gradient(circle,#00ffff,#0077ff,#001144)" : "transparent",
            boxShadow: i===4 ? "0 0 20px #00ccff,0 0 40px #0066ff" : "none",
            animation: i<4 ? `${i%2===0?"spin":"spinR"} ${1.5+i*1.2}s linear infinite` : "pulse 1.5s ease-in-out infinite",
          }}/>
        ))}
        <div style={{
          position: "absolute", inset: -20,
          background: "radial-gradient(circle,rgba(0,150,255,0.2),transparent 70%)",
          borderRadius: "50%", animation: "pulse 1.5s ease-in-out infinite",
        }}/>
      </div>

      <div style={{
        fontSize: 18, fontWeight: 900, letterSpacing: "0.5em",
        background: "linear-gradient(90deg,#00ccff,#ffffff,#00ccff)",
        backgroundSize: "200%",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        animation: "shimmer 2s linear infinite",
        marginBottom: 4,
      }}>J.A.R.V.I.S</div>

      <div style={{ fontSize: 8, color: "rgba(0,150,255,0.35)", letterSpacing: "0.3em", marginBottom: 24 }}>
        DESIGNED & OWNED BY AZLAN
      </div>

      {/* Boot lines */}
      <div style={{
        width: "85%", maxWidth: 320,
        background: "rgba(0,10,20,0.8)",
        border: "1px solid rgba(0,100,255,0.15)",
        borderRadius: 4, padding: "12px 14px",
        marginBottom: 16, minHeight: 120,
      }}>
        {bootLines.map((line, i) => (
          <div key={i} style={{
            fontSize: 10, color: i === bootLines.length - 1 ? "#00ff88" : "rgba(0,180,255,0.5)",
            letterSpacing: "0.1em", marginBottom: 4,
            fontWeight: i === bootLines.length - 1 ? 700 : 400,
          }}>
            <span style={{ color: "rgba(0,150,255,0.3)" }}>{">"} </span>
            {line}
            {i === bootLines.length - 1 && (
              <span style={{ animation: "blink 1s infinite" }}>_</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: "85%", maxWidth: 320 }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 8, color: "rgba(0,150,255,0.4)",
          letterSpacing: "0.15em", marginBottom: 6,
        }}>
          <span>BOOTING JARVIS</span>
          <span>{bootProgress}%</span>
        </div>
        <div style={{
          height: 3, background: "rgba(0,100,255,0.1)",
          borderRadius: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${bootProgress}%`,
            background: "linear-gradient(90deg,#00aaff,#00ffcc)",
            boxShadow: "0 0 8px #00aaff",
            transition: "width 0.5s ease",
            borderRadius: 2,
          }}/>
        </div>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinR{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
        @keyframes pulse{0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      `}</style>
    </div>
  );

  // ── MAIN INTERFACE ──
  return (
    <div style={{
      height: "100vh", background: "#000408",
      display: "flex", flexDirection: "column",
      overflow: "hidden", position: "relative",
      fontFamily: "'Courier New', monospace",
    }}>
      {/* Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: `
          radial-gradient(ellipse at 50% -10%,rgba(0,80,255,0.12) 0%,transparent 55%),
          radial-gradient(ellipse at 20% 80%,rgba(0,40,150,0.08) 0%,transparent 40%)
        `,
      }}/>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,100,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,100,255,0.035) 1px,transparent 1px)`,
        backgroundSize: "28px 28px",
      }}/>
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)",
      }}/>

      {/* ── HEADER ── */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid rgba(0,140,255,0.1)",
        background: "rgba(0,3,10,0.96)",
        backdropFilter: "blur(30px)",
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {/* Reactor */}
        <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position: "absolute", inset: i*6, borderRadius: "50%",
              border: i<3 ? `1px solid rgba(0,${150+i*30},255,${0.7-i*0.15})` : "none",
              borderTop: i<3 ? `2px solid rgba(0,${190+i*20},255,0.9)` : "none",
              background: i===3 ? "radial-gradient(circle,#00ffff,#0077ff,#001144)" : "transparent",
              boxShadow: i===3 ? "0 0 10px #00ccff,0 0 20px #0066ff88" : "none",
              animation: i<3 ? `${i%2===0?"spin":"spinR"} ${2+i*2}s linear infinite` : "pulse 2s ease-in-out infinite",
            }}/>
          ))}
          <div style={{
            position: "absolute", inset: -8,
            background: "radial-gradient(circle,rgba(0,150,255,0.15),transparent 70%)",
            borderRadius: "50%", animation: "pulse 2s ease-in-out infinite",
          }}/>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 17, fontWeight: 900, letterSpacing: "0.35em",
            background: "linear-gradient(90deg,#00ccff,#ffffff,#00aaff)",
            backgroundSize: "200%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}>J.A.R.V.I.S</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
            <div style={{ fontSize: 7, color: "rgba(0,150,255,0.35)", letterSpacing: "0.2em" }}>BY</div>
            <div style={{
              fontSize: 8, fontWeight: 900, letterSpacing: "0.3em",
              background: "linear-gradient(90deg,#00ffcc,#00aaff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>AZLAN</div>
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: loading ? "#ffaa00" : "#00ff88",
              boxShadow: `0 0 6px ${loading ? "#ffaa00" : "#00ff88"}`,
              animation: "pulse 1.5s infinite",
            }}/>
            <div style={{
              fontSize: 7,
              color: loading ? "#ffaa00" : "#00ff88",
              letterSpacing: "0.15em",
            }}>
              {loading ? "THINKING..." : "ONLINE"}
            </div>
            {mode === "interactive" && (
              <div style={{
                fontSize: 7, color: "rgba(0,255,136,0.4)",
                letterSpacing: "0.1em", marginLeft: 4,
              }}>🔊 VOICE</div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: "#00ccff", fontWeight: 700 }}>{time}</div>
          <div style={{ fontSize: 8, color: "rgba(0,150,255,0.35)" }}>⚡ {energy.toFixed(1)}%</div>
          <div style={{ fontSize: 7, color: "rgba(0,150,255,0.25)", letterSpacing: "0.1em" }}>
            {mode.toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "14px 12px",
        display: "flex", flexDirection: "column", gap: 12,
        position: "relative", zIndex: 5,
      }}>

        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 10px" }}>
            <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  position: "absolute", inset: i*9, borderRadius: "50%",
                  border: i<4 ? `1px solid rgba(0,${130+i*30},255,${0.6-i*0.1})` : "none",
                  borderTop: i<4 ? `2px solid rgba(0,${180+i*20},255,0.85)` : "none",
                  background: i===4 ? "radial-gradient(circle,#00ffff,#0077ff,#001144)" : "transparent",
                  boxShadow: i===4 ? "0 0 12px #00ccff,0 0 25px #0066ff" : "none",
                  animation: i<4 ? `${i%2===0?"spin":"spinR"} ${2+i*1.5}s linear infinite` : "pulse 2s ease-in-out infinite",
                }}/>
              ))}
            </div>

            <div style={{
              fontSize: 10, fontWeight: 900, letterSpacing: "0.5em",
              background: "linear-gradient(90deg,#00ccff,#ffffff,#00ccff)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite", marginBottom: 4,
            }}>JARVIS ONLINE</div>

            <div style={{
              fontSize: 8, color: "rgba(0,150,255,0.4)",
              letterSpacing: "0.3em", marginBottom: 14,
            }}>AZLAN'S PERSONAL AI · MARK I</div>

            <div style={{
              fontSize: 13, color: "rgba(0,180,255,0.65)",
              lineHeight: 1.75, maxWidth: 280, margin: "0 auto 18px",
            }}>
              Good to see you, <strong style={{ color: "#00ddff" }}>Azlan</strong>. All systems operational. Ready to assist.
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
              {["What can you do?", "Write Python code", "Explain AI", "Build something", "Security analysis", "Surprise me"].map(q => (
                <button key={q} onClick={() => { setInput(q); setTimeout(() => send(), 50); }} style={{
                  padding: "6px 11px", fontSize: 10,
                  background: "rgba(0,80,200,0.07)",
                  border: "1px solid rgba(0,130,255,0.18)",
                  borderRadius: 3, color: "rgba(0,170,255,0.6)",
                  cursor: "pointer",
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            gap: 8, alignItems: "flex-start",
            animation: "msgIn 0.25s ease-out",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: msg.role === "assistant" ? "radial-gradient(circle,#001830,#000510)" : "radial-gradient(circle,#001a10,#000508)",
              border: `1px solid ${msg.role==="assistant"?"rgba(0,140,255,0.3)":"rgba(0,255,120,0.3)"}`,
              fontSize: 11, fontWeight: 700,
              color: msg.role==="assistant" ? "#00aaff" : "#00ff88",
            }}>
              {msg.role==="assistant" ? "J" : "A"}
            </div>

            <div style={{ maxWidth: "82%" }}>
              <div style={{
                fontSize: 8, letterSpacing: "0.2em",
                color: "rgba(0,140,255,0.3)", marginBottom: 4,
                textAlign: msg.role==="user" ? "right" : "left",
              }}>
                {msg.role==="assistant" ? "JARVIS" : "AZLAN"}
              </div>
              <div style={{
                padding: "10px 14px",
                background: msg.role==="assistant" ? "rgba(0,12,30,0.88)" : "rgba(0,22,12,0.88)",
                border: `1px solid ${msg.role==="assistant"?"rgba(0,110,255,0.1)":"rgba(0,190,90,0.1)"}`,
                borderLeft: msg.role==="assistant" ? "2px solid rgba(0,140,255,0.45)" : "1px solid rgba(0,190,90,0.1)",
                borderRight: msg.role==="user" ? "2px solid rgba(0,255,110,0.45)" : "1px solid rgba(0,110,255,0.1)",
                borderRadius: 3,
                fontSize: 13, lineHeight: 1.7,
                color: msg.role==="assistant" ? "#a8d4ff" : "#a8ffd4",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {formatText(msg.content)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
            <div style={{
              width:32, height:32, borderRadius:"50%", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background:"radial-gradient(circle,#001830,#000510)",
              border:"1px solid rgba(0,140,255,0.3)",
              fontSize:11, fontWeight:700, color:"#00aaff",
            }}>J</div>
            <div style={{
              padding:"12px 16px",
              background:"rgba(0,12,30,0.88)",
              border:"1px solid rgba(0,110,255,0.1)",
              borderLeft:"2px solid rgba(0,140,255,0.45)",
              borderRadius:3,
            }}>
              <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width:7, height:7, borderRadius:"50%",
                    background:"#00aaff", boxShadow:"0 0 8px #00aaff",
                    animation:"bounceDot 1.2s ease-in-out infinite",
                    animationDelay:`${i*0.2}s`,
                  }}/>
                ))}
                <span style={{ fontSize:8, color:"rgba(0,150,255,0.35)", letterSpacing:"0.2em", marginLeft:4 }}>
                  JARVIS IS THINKING...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* ── INPUT ── */}
      <div style={{
        padding:"10px 12px 12px",
        borderTop:"1px solid rgba(0,110,255,0.08)",
        background:"rgba(0,2,8,0.98)",
        backdropFilter:"blur(30px)",
        position:"relative", zIndex:10,
      }}>
        <div style={{
          display:"flex", justifyContent:"space-between",
          fontSize:7, color:"rgba(0,130,255,0.25)",
          letterSpacing:"0.18em", marginBottom:7,
        }}>
          <span>⬡ JARVIS · AZLAN OS v1.0 · {mode.toUpperCase()} MODE</span>
          <span>TOKENS: {tokens.toLocaleString()}</span>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Talk to JARVIS, Azlan..."
            rows={1}
            style={{
              flex:1,
              background:"rgba(0,12,28,0.75)",
              border:"1px solid rgba(0,110,255,0.18)",
              borderBottom:"2px solid rgba(0,140,255,0.35)",
              borderRadius:3, color:"#9dcfff",
              fontSize:14, padding:"10px 13px",
              outline:"none", resize:"none",
              fontFamily:"'Courier New',monospace",
              minHeight:44, maxHeight:110, lineHeight:1.5,
            }}
          />
          <button onClick={send} disabled={loading || !input.trim()} style={{
            width:46, height:46, flexShrink:0,
            background: loading ? "rgba(0,50,90,0.2)" : "rgba(0,90,220,0.12)",
            border:`1px solid ${loading?"rgba(0,100,255,0.08)":"rgba(0,140,255,0.45)"}`,
            borderRadius:3, color: loading ? "rgba(0,140,255,0.25)" : "#00aaff",
            fontSize:20, cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 0 14px rgba(0,140,255,0.25)",
            transition:"all 0.2s",
          }}>
            {loading ? "⟳" : "⟶"}
          </button>
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position:"fixed", bottom:80, right:8,
        fontSize:7, letterSpacing:"0.25em",
        color:"rgba(0,100,255,0.1)", fontWeight:700,
        transform:"rotate(90deg)", transformOrigin:"right center",
        zIndex:1,
      }}>AZLAN © 2026</div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinR{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
        @keyframes pulse{0%,100%{opacity:0.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes bounceDot{0%,100%{transform:translateY(0);opacity:0.3}50%{transform:translateY(-5px);opacity:1}}
        @keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        textarea::placeholder{color:rgba(0,110,200,0.28);}
        textarea:focus{border-color:rgba(0,140,255,0.35)!important;}
        button:active{transform:scale(0.93);}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:rgba(0,140,255,0.12);}
        *{box-sizing:border-box;margin:0;padding:0;}
      `}</style>
    </div>
  );
}
