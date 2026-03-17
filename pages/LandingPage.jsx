import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ── Favicon ─────────────────────────────────────────────────────────────── */
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#03060f"/><path d="M16 2 L18.4 13.6 L30 11 L20 16 L29 23 L17.2 18.4 L16 30 L14.8 18.4 L3 23 L12 16 L2 11 L13.6 13.6 Z" fill="#e2eaf4"/></svg>`;

/* ── Star field ──────────────────────────────────────────────────────────── */
const STARS = Array.from({ length: 220 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 2.2 + 0.4,
  op: Math.random() * 0.5 + 0.4,
  dur: (Math.random() * 3 + 2).toFixed(1),
  del: (Math.random() * 6).toFixed(1),
}));

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg:       #020205;
  --bg2:      #030307;
  --bg3:      #05050a;
  --cyan:     #4f8eff;
  --cyan2:    #2563eb;
  --purple:   #a78bfa;
  --blue:     #60a5fa;
  --text:     #e2eaf4;
  --muted:    rgba(180, 210, 240, 0.5);
  --border:   rgba(255,255,255,0.06);
  --border2:  rgba(255,255,255,0.1);
  --mono:     'JetBrains Mono', monospace;
  --sans:     'Inter', sans-serif;
}

html, body, #root {
  width: 100%; min-height: 100vh;
  background: var(--bg); overflow-x: hidden;
  margin: 0; padding: 0;
}
body { font-family: var(--sans); color: var(--text); -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: rgba(79,142,255,0.3); border-radius: 2px; }

/* ── STARS ── */
.star-field { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.star {
  position: absolute; border-radius: 50%; background: #fff;
  animation: twinkle ease-in-out infinite alternate;
}
@keyframes twinkle {
  from { opacity: 0.08; }
  to   { opacity: 0.9; }
}

/* ── BG LAYERS ── */
.bg-space {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: #010103;
}
.bg-nebula-top {
  position: fixed; top: -160px; left: 50%; transform: translateX(-50%);
  width: 900px; height: 500px;
  background: radial-gradient(ellipse, rgba(30, 60, 140, 0.2) 0%, transparent 65%);
  z-index: 0; pointer-events: none; filter: blur(50px);
}
.bg-nebula-left {
  position: fixed; top: 10%; left: -200px;
  width: 600px; height: 600px;
  background: radial-gradient(ellipse, rgba(20, 30, 100, 0.15) 0%, transparent 70%);
  z-index: 0; pointer-events: none; filter: blur(60px);
}
.bg-nebula-right {
  position: fixed; bottom: 10%; right: -150px;
  width: 500px; height: 500px;
  background: radial-gradient(ellipse, rgba(60, 20, 120, 0.1) 0%, transparent 70%);
  z-index: 0; pointer-events: none; filter: blur(60px);
}

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 60px; height: 66px;
  background: rgba(1,1,3,0.85); backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.nav-logo {
  font-size: 15px; font-weight: 700; letter-spacing: 0.07em;
  color: var(--text); text-decoration: none;
  display: flex; align-items: center; gap: 9px;
}
.nav-logo-star {
  width: 22px; height: 22px; flex-shrink: 0;
}
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 6px rgba(79,142,255,0.7); }
  50%      { box-shadow: 0 0 16px rgba(79,142,255,1), 0 0 30px rgba(79,142,255,0.4); }
}
.nav-right { display: flex; gap: 10px; align-items: center; }
.btn-nav-ghost {
  padding: 8px 20px; background: transparent;
  border: 1px solid var(--border2); color: rgba(255,255,255,0.7);
  border-radius: 8px; font-family: var(--sans); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
}
.btn-nav-ghost:hover { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.05); }
.btn-nav-fill {
  padding: 8px 20px;
  background: linear-gradient(135deg, var(--cyan2), var(--cyan));
  border: none; color: #000;
  border-radius: 8px; font-family: var(--sans); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-nav-fill:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79,142,255,0.35); }

/* ── HERO ── */
.hero {
  position: relative; z-index: 1;
  width: 100%; min-height: 100vh;
  display: grid; grid-template-columns: 1fr 1fr;
  align-items: center; gap: 60px;
  padding: 110px 60px 80px;
}
.hero-left { position: relative; }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(79,142,255,0.08); border: 1px solid rgba(79,142,255,0.2);
  border-radius: 100px; padding: 5px 16px;
  font-size: 11px; font-weight: 600; color: var(--cyan);
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px;
  opacity: 0; animation: riseUp 0.7s 0.0s ease forwards;
}
.eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
  box-shadow: 0 0 8px var(--cyan); animation: glowPulse 2s infinite;
}
.hero-h1 {
  font-size: clamp(40px, 5vw, 68px); font-weight: 800;
  line-height: 1.0; letter-spacing: -1.5px; margin-bottom: 20px; color: #fff;
  opacity: 0; animation: riseUp 0.7s 0.1s ease forwards;
}
.hero-h1 em {
  font-style: normal;
  background: linear-gradient(135deg, var(--cyan) 0%, var(--purple) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub {
  font-size: 16px; color: var(--muted); line-height: 1.75;
  margin-bottom: 40px; max-width: 460px; font-weight: 400;
  opacity: 0; animation: riseUp 0.7s 0.2s ease forwards;
}
.hero-cta {
  display: flex; gap: 14px; align-items: center;
  opacity: 0; animation: riseUp 0.7s 0.3s ease forwards;
}
.btn-hero {
  padding: 13px 32px;
  background: linear-gradient(135deg, var(--cyan2), var(--cyan));
  border: none; color: #fff; border-radius: 9px;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; letter-spacing: 0.01em;
}
.btn-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(79,142,255,0.4); }

/* ── EDITOR MOCKUP ── */
.hero-right {
  opacity: 0; animation: riseUp 0.9s 0.25s ease forwards;
}
.editor-window {
  background: #020205; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; overflow: hidden;
  box-shadow: 0 30px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(79,142,255,0.04) inset;
}
.editor-bar {
  background: #030308; padding: 11px 16px;
  display: flex; align-items: center; gap: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.wm { display: flex; gap: 6px; }
.wm-dot { width: 11px; height: 11px; border-radius: 50%; }
.wm-r{background:#ff5f57;} .wm-y{background:#febc2e;} .wm-g{background:#28c840;}
.etabs { display: flex; gap: 2px; margin-left: 8px; flex: 1; }
.etab { padding: 3px 13px; border-radius: 5px; font-family: var(--mono); font-size: 11px; color: var(--muted); }
.etab.on { background: rgba(79,142,255,0.1); color: var(--cyan); }
.collab-pile { display: flex; margin-left: auto; }
.cav {
  width: 25px; height: 25px; border-radius: 50%;
  border: 2px solid #020205;
  font-size: 9px; font-weight: 700; color: #fff;
  display: flex; align-items: center; justify-content: center;
  margin-left: -7px;
}
.cav1{background:#4f7cff;} .cav2{background:#f06292;} .cav3{background:#00c9a7;} .cav4{background:#ff9f43;}
.editor-body { display: grid; grid-template-columns: 40px 1fr; background: #020205; }
.line-nums {
  padding: 16px 10px 16px 14px; font-family: var(--mono); font-size: 12px;
  color: rgba(255,255,255,0.1); line-height: 1.9; text-align: right;
  border-right: 1px solid rgba(255,255,255,0.05); user-select: none; background: #020205;
}
.code-pane { padding: 16px 18px; font-family: var(--mono); font-size: 12px; line-height: 1.9; white-space: pre; overflow-x: hidden; background: #020205; }
.kw{color:#c792ea;} .fn{color:#82aaff;} .str{color:#c3e88d;} .op{color:#89ddff;} .nb{color:#f78c6c;} .cm{color:rgba(255,255,255,0.22);}
.hl { background: rgba(79,142,255,0.06); display: block; margin: 0 -18px; padding: 0 18px; }
.cur { display: inline-block; width: 2px; height: 13px; background: var(--cyan); vertical-align: middle; animation: blink 1s step-end infinite; }
.cur2 { display: inline-block; width: 2px; height: 13px; background: #f06292; vertical-align: middle; position: relative; }
.cur2::before { content:'Sara'; position:absolute; top:-17px; left:0; background:#f06292; color:#fff; font-size:9px; font-weight:700; padding:1px 5px; border-radius:3px; white-space:nowrap; }
@keyframes blink { 50%{opacity:0;} }
.editor-foot {
  background: #030308; border-top: 1px solid rgba(255,255,255,0.06);
  padding: 7px 16px; display: flex; align-items: center; gap: 14px;
  font-family: var(--mono); font-size: 11px; color: var(--muted);
}
.live-pill {
  display: flex; align-items: center; gap: 5px;
  background: rgba(79,142,255,0.08); border: 1px solid rgba(79,142,255,0.2);
  padding: 2px 8px; border-radius: 100px; color: var(--cyan);
}
.live-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--cyan); animation: glowPulse 1.5s infinite; }

/* ── SECTIONS ── */
.section {
  position: relative; z-index: 1; width: 100%;
  padding: 110px 60px; border-top: 1px solid var(--border);
}
.sec-label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.13em;
  text-transform: uppercase; color: var(--cyan); margin-bottom: 14px;
}
.sec-title {
  font-size: clamp(30px, 4vw, 48px); font-weight: 700;
  letter-spacing: -1px; line-height: 1.1; margin-bottom: 14px; color: #fff;
}
.sec-sub { font-size: 15px; color: var(--muted); max-width: 480px; line-height: 1.75; margin-bottom: 64px; }

/* FEATURES */
.feat-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
}
.feat-card {
  background: var(--bg2); padding: 40px 34px; transition: background 0.2s; position: relative; overflow: hidden;
}
.feat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(79,142,255,0.4), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.feat-card:hover { background: var(--bg3); }
.feat-card:hover::before { opacity: 1; }
.feat-icon {
  width: 50px; height: 50px; border-radius: 12px;
  background: rgba(79,142,255,0.07); border: 1px solid rgba(79,142,255,0.18);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; margin-bottom: 22px; transition: all 0.2s;
}
.feat-card:hover .feat-icon { border-color: rgba(79,142,255,0.35); box-shadow: 0 0 16px rgba(79,142,255,0.15); }
.feat-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #fff; letter-spacing: -0.2px; }
.feat-card p  { font-size: 14px; color: var(--muted); line-height: 1.75; }

/* STEPS */
.steps-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; margin-top: 60px;
}
.step { padding: 32px 26px; border-right: 1px solid var(--border); }
.step:last-child { border-right: none; }
.step-n { font-size: 46px; font-weight: 800; color: rgba(79,142,255,0.12); line-height: 1; margin-bottom: 18px; letter-spacing: -2px; }
.step h3 { font-size: 14px; font-weight: 600; color: var(--cyan); margin-bottom: 8px; letter-spacing: 0.02em; }
.step p  { font-size: 13px; color: var(--muted); line-height: 1.75; }

/* CTA */
.cta-band {
  position: relative; z-index: 1; width: 100%;
  padding: 130px 60px; border-top: 1px solid var(--border);
  text-align: center; overflow: hidden;
}
.cta-glow {
  position: absolute; width: 800px; height: 400px;
  background: radial-gradient(ellipse, rgba(30,60,160,0.18) 0%, rgba(80,20,140,0.06) 50%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  filter: blur(50px); pointer-events: none;
}
.cta-band h2 {
  font-size: clamp(32px, 4.5vw, 56px); font-weight: 700;
  letter-spacing: -1px; line-height: 1.05; margin-bottom: 16px;
  color: #fff; position: relative;
}
.cta-band h2 span { color: var(--cyan); }
.cta-band > p { font-size: 16px; color: var(--muted); margin-bottom: 44px; position: relative; }
.cta-btns { display: flex; gap: 12px; justify-content: center; position: relative; }
.btn-cta {
  padding: 14px 40px;
  background: linear-gradient(135deg, var(--cyan2), var(--cyan));
  border: none; color: #fff; border-radius: 10px;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.btn-cta:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(79,142,255,0.4); }
.btn-cta-ghost {
  padding: 14px 32px; background: transparent;
  border: 1px solid var(--border2); color: var(--muted);
  border-radius: 10px; font-family: var(--sans); font-size: 15px; font-weight: 500;
  cursor: pointer; transition: all 0.2s;
}
.btn-cta-ghost:hover { color: #fff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); }

/* FOOTER */
.footer {
  position: relative; z-index: 1; width: 100%;
  padding: 30px 60px; border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; color: var(--muted);
}
.footer-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; color: var(--text); font-weight: 600; font-size: 14px; letter-spacing: 0.06em; }
.footer-logo-star { width: 16px; height: 16px; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: var(--cyan); }

/* ANIMATIONS */
@keyframes riseUp {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero { grid-template-columns: 1fr; padding: 100px 40px 60px; }
  .hero-right { display: none; }
  .feat-grid { grid-template-columns: 1fr 1fr; }
  .steps-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .nav { padding: 0 20px; }
  .hero { padding: 90px 20px 60px; }
  .section { padding: 80px 20px; }
  .feat-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr; }
  .step { border-right: none; border-bottom: 1px solid var(--border); }
  .cta-band { padding: 80px 20px; }
  .footer { padding: 24px 20px; flex-direction: column; gap: 14px; text-align: center; }
}
`;

const FEATURES = [
  { icon: "👁️", title: "Live Preview Panel", desc: "See your React, Vue, or vanilla output hot-reload in a split pane as you type. No save, no refresh." },
  { icon: "🔐", title: "Encrypted Rooms", desc: "Every session is end-to-end encrypted. Invite-only links, read-only viewers, and role-based permissions built-in." },
  { icon: "🔌", title: "Zero Setup", desc: "Paste a GitHub URL and start coding in seconds. No Docker, no config files, no dependency installs." },
];

const STEPS = [
  { n: "01", title: "Create a room", desc: "Open a new session or import from GitHub. Your environment spins up in the cloud instantly." },
  { n: "02", title: "Invite teammates", desc: "Share a link. Collaborators join with live cursors and their own colour immediately." },
  { n: "03", title: "Code together", desc: "Every edit, selection, and cursor move syncs in real time. Chat, comment, and review inline." },
  { n: "04", title: "Ship it", desc: "Export, deploy to Vercel/Netlify, or push directly to GitHub — without leaving the browser." },
];

export default function LandingPage() {
  const styleRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.innerHTML = CSS;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    const blob = new Blob([FAVICON], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const fav = document.createElement("link");
    fav.rel = "icon"; fav.type = "image/svg+xml"; fav.href = url;
    document.head.appendChild(fav);
    document.title = "Coden — Real-Time Collaborative Editor";
    return () => {
      if (styleRef.current) { document.head.removeChild(styleRef.current); styleRef.current = null; }
      try { document.head.removeChild(fav); URL.revokeObjectURL(url); } catch { }
    };
  }, []);

  const handleSignIn = () => { navigate("/sign-in") };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#010103", overflowX: "hidden" }}>

      {/* ── Background ── */}
      <div className="bg-space" aria-hidden="true" />
      <div className="bg-nebula-top" aria-hidden="true" />
      <div className="bg-nebula-left" aria-hidden="true" />
      <div className="bg-nebula-right" aria-hidden="true" />

      {/* ── Stars (above bg, below content) ── */}
      <div className="star-field" aria-hidden="true">
        {STARS.map((s, i) => (
          <div key={i} className="star" style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.r}px`,
            height: `${s.r}px`,
            opacity: s.op * 0.3,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.del}s`,
          }} />
        ))}
      </div>

      {/* ── NAV ── */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <svg className="nav-logo-star" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 1 L23 16 L38 13 L25 20 L36 31 L21 24 L20 39 L19 24 L4 31 L15 20 L2 13 L17 16 Z" fill="#e2eaf4" />
          </svg>
          Coden
        </a>
        <div className="nav-right">
          <button className="btn-nav-ghost" onClick={handleSignIn}>Sign in →</button>
          <button className="btn-nav-fill">Get started free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="eyebrow-dot" />
            Live collaboration · now in beta
          </div>
          <h1 className="hero-h1">
            Write code.<br /><em>Together.</em><br />Ship faster.
          </h1>
          <p className="hero-sub">
            A real-time collaborative code editor with live cursors, instant previews,
            and AI-assisted coding — built for teams who move fast.
          </p>
          <div className="hero-cta">
            <button className="btn-hero">Start coding free</button>
          </div>
        </div>

        {/* Editor mockup */}
        <div className="hero-right">
          <div className="editor-window">
            <div className="editor-bar">
              <div className="wm">
                <div className="wm-dot wm-r" /><div className="wm-dot wm-y" /><div className="wm-dot wm-g" />
              </div>
              <div className="etabs">
                <div className="etab on">app.tsx</div>
                <div className="etab">server.ts</div>
                <div className="etab">types.ts</div>
              </div>
              <div className="collab-pile">
                <div className="cav cav1">AK</div>
                <div className="cav cav2">SR</div>
                <div className="cav cav3">MJ</div>
                <div className="cav cav4">+4</div>
              </div>
            </div>
            <div className="editor-body">
              <div className="line-nums">
                {Array.from({ length: 18 }, (_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <div className="code-pane">
                <span className="cm">{"// coden — real-time editor core\n"}</span>
                <span><span className="kw">import</span> <span className="op">{"{ "}</span><span className="fn">createRoom</span><span className="op">{", "}</span><span className="fn">useCollabState</span><span className="op">{" }"}</span> <span className="kw">from</span> <span className="str">'@coden/react'</span>{"\n"}</span>
                <span><span className="kw">import</span> <span className="op">{"{ "}</span><span className="fn">Editor</span><span className="op">{" }"}</span> <span className="kw">from</span> <span className="str">'@coden/editor'</span>{"\n"}</span>
                {"\n"}
                <span><span className="kw">interface</span> <span className="fn">RoomConfig</span> <span className="op">{"{"}</span>{"\n"}</span>
                <span>{"  "}<span className="nb">roomId</span><span className="op">:</span> <span className="kw">string</span>{"\n"}</span>
                <span>{"  "}<span className="nb">userId</span><span className="op">:</span> <span className="kw">string</span>{"\n"}</span>
                <span>{"  "}<span className="nb">lang</span><span className="op">?:</span> <span className="str">'ts'</span> <span className="op">|</span> <span className="str">'js'</span> <span className="op">|</span> <span className="str">'py'</span>{"\n"}</span>
                <span><span className="op">{"}"}</span>{"\n"}</span>
                {"\n"}
                <span><span className="kw">export function</span> <span className="fn">CollabEditor</span><span className="op">{"({ roomId, userId }: RoomConfig) {"}</span>{"\n"}</span>
                <span>{"  "}<span className="kw">const</span> <span className="op">{"{ "}</span><span className="nb">peers</span><span className="op">{", "}</span><span className="nb">cursors</span><span className="op">{", "}</span><span className="nb">isLive</span><span className="op">{" }"}</span> <span className="op">=</span> <span className="fn">useCollabState</span><span className="op">{"()"}</span>{"\n"}</span>
                <span className="hl">{"  "}<span className="kw">const</span> <span className="nb">room</span> <span className="op">=</span> <span className="fn">createRoom</span><span className="op">{"({ roomId, userId })"}</span><span className="cur" />{"\n"}</span>
                <span>{"  "}<span className="kw">return</span> <span className="op">{"("}</span>{"\n"}</span>
                <span>{"    "}<span className="op">{"<"}</span><span className="fn">Editor</span>{"\n"}</span>
                <span>{"      "}<span className="nb">room</span><span className="op">{"={room}"}</span>{"\n"}</span>
                <span>{"      "}<span className="nb">peers</span><span className="op">{"={peers}"}</span> <span className="cur2" />{"\n"}</span>
                <span>{"      "}<span className="nb">theme</span><span className="op">=</span><span className="str">"dark"</span>{"\n"}</span>
                <span>{"    "}<span className="op">{"/>"}</span>{"\n"}</span>
                <span>{"  "}<span className="op">{")"}</span>{"\n"}</span>
                <span><span className="op">{"}"}</span></span>
              </div>
            </div>
            <div className="editor-foot">
              <div className="live-pill"><div className="live-dot" />Live · 7 connected</div>
              <span>TypeScript</span>
              <span style={{ marginLeft: "auto" }}>Ln 17, Col 38</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="sec-label">Everything you need</div>
        <h2 className="sec-title">Built for real collaboration,<br />not just screen sharing.</h2>
        <p className="sec-sub">Coden is an editor first, collaboration layer second — so it feels fast, not clunky.</p>
        <div className="feat-grid">
          {FEATURES.map(f => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="sec-label">How it works</div>
        <h2 className="sec-title">From idea to shipped<br />in four steps.</h2>
        <div className="steps-grid">
          {STEPS.map(s => (
            <div className="step" key={s.n}>
              <div className="step-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-band">
        <div className="cta-glow" />
        <h2>Your team's new<br /><span>home for code.</span></h2>
        <p>Join 12,000+ developers building together in real time.</p>
        <div className="cta-btns">
          <button className="btn-cta" onClick={handleSignIn}>Create a free workspace</button>
          <button className="btn-cta-ghost" onClick={handleSignIn}>Sign in to existing account</button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <a href="/" className="footer-logo">
          <svg className="footer-logo-star" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 1 L23 16 L38 13 L25 20 L36 31 L21 24 L20 39 L19 24 L4 31 L15 20 L2 13 L17 16 Z" fill="#e2eaf4" />
          </svg>
          Coden
        </a>
        <span>© 2026 Coden Inc. All rights reserved.</span>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Status</a>
          <a href="#">GitHub</a>
        </div>
      </footer>
    </div>
  );
}