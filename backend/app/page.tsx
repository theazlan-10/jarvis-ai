<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="JARVIS">
<meta name="theme-color" content="#000408">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>J.A.R.V.I.S — AZLAN'S TECH</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&family=Exo+2:wght@300;400;700;900&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<style>
:root {
  --cyan:#00f2fe; --cyan-dim:rgba(0,242,254,0.15);
  --purple:#9d4edd; --pink:#ff007f;
  --bg-void:#030712; --bg-deep:#050816;
  --text-prime:#e2f4ff; --text-dim:rgba(200,230,255,0.55);
  --glass-bg:rgba(5,12,40,0.55); --glass-border:rgba(0,242,254,0.18);
  --font-hud:'Orbitron',sans-serif;
  --font-mono:'Share Tech Mono',monospace;
  --font-body:'Exo 2',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow:hidden;background:var(--bg-void);color:var(--text-prime);font-family:var(--font-body);}

/* CURSOR */
#cur-core{position:fixed;top:0;left:0;z-index:9999;width:10px;height:10px;background:var(--cyan);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);box-shadow:0 0 8px var(--cyan),0 0 20px var(--cyan);transition:width .15s,height .15s;mix-blend-mode:screen;}
#cur-ring{position:fixed;top:0;left:0;z-index:9998;width:36px;height:36px;border:1.5px solid rgba(0,242,254,0.6);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);transition:width .3s,height .3s;}
body.hovering #cur-core{width:16px;height:16px;background:#fff;}
body.hovering #cur-ring{width:56px;height:56px;}
.trail-dot{position:fixed;pointer-events:none;z-index:9997;border-radius:50%;background:var(--cyan);transform:translate(-50%,-50%);}
.ripple{position:fixed;pointer-events:none;z-index:9996;border-radius:50%;border:1.5px solid var(--cyan);transform:translate(-50%,-50%) scale(0);animation:rippleAnim .8s ease-out forwards;}
@keyframes rippleAnim{to{transform:translate(-50%,-50%) scale(4);opacity:0;}}

/* GESTURE OVERLAY */
#gestureIndicator{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9995;pointer-events:none;display:none;text-align:center;}
#gestureIcon{font-size:48px;animation:gesturePulse 0.5s ease-in-out;}
#gestureLabel{font-family:var(--font-mono);font-size:10px;color:var(--cyan);letter-spacing:0.3em;margin-top:8px;}
@keyframes gesturePulse{0%{transform:scale(0.5);opacity:0;}100%{transform:scale(1);opacity:1;}}

/* CURSOR TOGGLE */
#cursorToggle{position:fixed;top:20px;right:20px;z-index:9990;font-family:var(--font-mono);font-size:8px;letter-spacing:0.15em;color:var(--cyan);border:1px solid rgba(0,242,254,0.3);padding:4px 10px;border-radius:3px;cursor:pointer;background:rgba(0,10,30,0.8);display:none;}
#cursorToggle.active{color:#00ff88;border-color:rgba(0,255,136,0.4);}

/* BOOT SCREEN */
#boot{position:fixed;inset:0;z-index:8000;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;}
#boot-logo{font-family:var(--font-hud);font-size:clamp(2rem,6vw,5rem);font-weight:900;letter-spacing:0.35em;color:var(--cyan);opacity:0;text-shadow:0 0 20px var(--cyan),0 0 60px rgba(0,242,254,0.4);}
#boot-bar-wrap{width:clamp(200px,30vw,360px);height:2px;background:rgba(0,242,254,0.12);border-radius:2px;overflow:hidden;opacity:0;}
#boot-bar{height:100%;width:0%;background:linear-gradient(90deg,var(--purple),var(--cyan));box-shadow:0 0 12px var(--cyan);border-radius:2px;}
#boot-status{font-family:var(--font-mono);font-size:.72rem;color:var(--cyan);letter-spacing:0.18em;opacity:0;}

/* THREE CANVAS */
#three-canvas{position:fixed;inset:0;z-index:0;display:block;}

/* OVERLAYS */
#vignette{position:fixed;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 30%,rgba(3,7,18,0.85) 100%);}
#grid-ol{position:fixed;inset:0;z-index:1;pointer-events:none;background-image:linear-gradient(rgba(0,242,254,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,242,254,0.025) 1px,transparent 1px);background-size:60px 60px;opacity:0;}
#scanline{position:fixed;inset:0;z-index:2;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,242,254,0.012) 3px,rgba(0,242,254,0.012) 4px);opacity:0;}
#sweep{position:fixed;left:0;right:0;z-index:3;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);box-shadow:0 0 12px var(--cyan);opacity:0;top:0;animation:sweepAnim 5s linear infinite;}
@keyframes sweepAnim{0%{top:0%;opacity:0;}5%{opacity:.7;}95%{opacity:.7;}100%{top:100%;opacity:0;}}
#noise{position:fixed;inset:0;z-index:4;pointer-events:none;opacity:.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px 200px;}

/* HUD CORNERS */
.hud-c{position:fixed;z-index:10;width:80px;height:80px;pointer-events:none;opacity:0;}
#hc-tl{top:20px;left:20px;border-top:1.5px solid var(--cyan);border-left:1.5px solid var(--cyan);}
#hc-tr{top:20px;right:20px;border-top:1.5px solid var(--cyan);border-right:1.5px solid var(--cyan);}
#hc-bl{bottom:20px;left:20px;border-bottom:1.5px solid var(--cyan);border-left:1.5px solid var(--cyan);}
#hc-br{bottom:20px;right:20px;border-bottom:1.5px solid var(--cyan);border-right:1.5px solid var(--cyan);}
.hud-c::after{content:'';position:absolute;width:6px;height:6px;border-radius:50%;background:var(--cyan);box-shadow:0 0 8px var(--cyan);}
#hc-tl::after{top:-3px;left:-3px;}#hc-tr::after{top:-3px;right:-3px;}
#hc-bl::after{bottom:-3px;left:-3px;}#hc-br::after{bottom:-3px;right:-3px;}

/* RETICLE */
#reticle{position:fixed;z-index:10;pointer-events:none;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;}
.r-ring{position:absolute;border-radius:50%;border:1px solid;top:50%;left:50%;transform:translate(-50%,-50%);}
.r1{width:200px;height:200px;border-color:rgba(0,242,254,0.12);animation:rspin 12s linear infinite;}
.r2{width:300px;height:300px;border-color:rgba(157,78,221,0.10);animation:rspin 20s linear infinite reverse;}
.r3{width:420px;height:420px;border-color:rgba(255,0,127,0.06);animation:rspin 35s linear infinite;}
.r1::before,.r2::before,.r3::before{content:'';position:absolute;background:var(--cyan);border-radius:50%;width:5px;height:5px;top:-2.5px;left:50%;transform:translateX(-50%);box-shadow:0 0 8px var(--cyan);}
.r2::before{background:var(--purple);box-shadow:0 0 8px var(--purple);}
.r3::before{background:var(--pink);box-shadow:0 0 8px var(--pink);width:4px;height:4px;top:-2px;}
@keyframes rspin{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
.ch-h,.ch-v{position:absolute;background:rgba(0,242,254,0.08);top:50%;left:50%;}
.ch-h{width:500px;height:1px;transform:translate(-50%,-50%);}
.ch-v{height:500px;width:1px;transform:translate(-50%,-50%);}

/* HUD TOP */
#hud-top{position:fixed;top:22px;left:50%;z-index:15;transform:translateX(-50%);display:flex;gap:24px;align-items:center;opacity:0;pointer-events:none;}
.top-badge{font-family:var(--font-mono);font-size:.55rem;letter-spacing:0.25em;padding:4px 10px;border:1px solid;text-transform:uppercase;}
.b-cyan{color:var(--cyan);border-color:rgba(0,242,254,0.3);}
.b-green{color:#00ff88;border-color:rgba(0,255,136,0.3);}
.b-pulse{animation:bPulse 2s ease-in-out infinite;}
@keyframes bPulse{0%,100%{opacity:1}50%{opacity:.4}}

/* SIDE PANELS */
.side-panel{position:fixed;z-index:15;background:rgba(5,8,24,0.7);border:1px solid rgba(0,242,254,0.12);backdrop-filter:blur(12px);padding:16px;width:clamp(140px,16vw,210px);opacity:0;pointer-events:none;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));}
#pl{left:24px;top:50%;transform:translateY(-50%);}
#pr{right:24px;top:50%;transform:translateY(-50%);}
.p-title{font-family:var(--font-mono);font-size:.58rem;letter-spacing:0.25em;color:var(--cyan);opacity:.75;margin-bottom:12px;text-transform:uppercase;}
.d-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;}
.d-key{font-family:var(--font-mono);font-size:.6rem;color:var(--text-dim);letter-spacing:.05em;}
.d-val{font-family:var(--font-mono);font-size:.65rem;color:var(--cyan);letter-spacing:.05em;}
.d-val.ok{color:#00ff88;}.d-val.warn{color:#ffcc00;animation:wBlink 1.5s step-end infinite;}
@keyframes wBlink{50%{opacity:.3}}
.d-div{height:1px;background:rgba(0,242,254,0.08);margin:10px 0;}
.bin-stream{font-family:var(--font-mono);font-size:.48rem;color:rgba(0,242,254,0.22);letter-spacing:.08em;line-height:1.7;overflow:hidden;height:50px;word-break:break-all;margin-top:8px;}

/* HUD BOTTOM */
#hud-bot{position:fixed;bottom:30px;left:50%;z-index:15;transform:translateX(-50%);display:flex;gap:32px;align-items:center;opacity:0;pointer-events:none;}
.t-item{text-align:center;font-family:var(--font-mono);}
.t-lbl{font-size:.5rem;letter-spacing:.3em;color:var(--text-dim);}
.t-val{font-size:.72rem;letter-spacing:.1em;color:var(--cyan);margin-top:2px;}
.t-sep{width:1px;height:30px;background:rgba(0,242,254,0.15);}

/* LANDING SCREEN */
#landing{position:fixed;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;opacity:0;}
#hero{text-align:center;position:relative;margin-bottom:8px;}
.pre-title{font-family:var(--font-mono);font-size:clamp(.55rem,1.2vw,.75rem);letter-spacing:.5em;color:var(--cyan);opacity:.7;margin-bottom:10px;}
#main-title{font-family:var(--font-hud);font-size:clamp(3.5rem,10vw,9rem);font-weight:900;letter-spacing:.25em;line-height:1;background:linear-gradient(135deg,#fff 0%,var(--cyan) 40%,var(--purple) 70%,var(--pink) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 0 30px rgba(0,242,254,.5));}
.sub-title{font-family:var(--font-hud);font-size:clamp(.45rem,1.4vw,.8rem);letter-spacing:.55em;color:var(--text-dim);margin-top:10px;text-transform:uppercase;}
#term-line{margin-top:18px;font-family:var(--font-mono);font-size:clamp(.62rem,1.3vw,.85rem);color:var(--cyan);letter-spacing:.12em;height:22px;display:flex;align-items:center;gap:6px;}
#term-txt{opacity:.9;}
#cur-blink{display:inline-block;width:7px;height:14px;background:var(--cyan);animation:blink .9s step-end infinite;box-shadow:0 0 6px var(--cyan);}
@keyframes blink{50%{opacity:0;}}

/* CTA */
#cta-wrap{margin-top:32px;pointer-events:all;position:relative;}
#cta-btn{position:relative;font-family:var(--font-hud);font-size:clamp(.65rem,1.4vw,.85rem);font-weight:700;letter-spacing:.35em;color:var(--cyan);background:transparent;border:none;cursor:pointer;padding:16px 48px;clip-path:polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px);outline:none;z-index:1;}
#cta-btn::before{content:'';position:absolute;inset:0;background:rgba(0,242,254,.06);clip-path:polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px);transition:background .3s;}
#cta-btn:hover::before{background:rgba(0,242,254,.14);}
.btn-bdr{position:absolute;inset:0;pointer-events:none;clip-path:polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px);}
#bb1{border:1.5px solid rgba(0,242,254,.6);}
#bb2{border:1px solid rgba(0,242,254,.2);inset:-3px;clip-path:polygon(14px 0%,calc(100% - 14px) 0%,100% 14px,100% calc(100% - 14px),calc(100% - 14px) 100%,14px 100%,0% calc(100% - 14px),0% 14px);}
.btn-pulse{position:absolute;inset:0;border-radius:2px;animation:bPulse2 2.4s ease-in-out infinite;pointer-events:none;}
@keyframes bPulse2{0%,100%{box-shadow:0 0 8px rgba(0,242,254,.2),0 0 24px rgba(0,242,254,.1)}50%{box-shadow:0 0 20px rgba(0,242,254,.5),0 0 60px rgba(0,242,254,.2)}}
#btn-sweep{position:absolute;top:0;bottom:0;width:40px;background:linear-gradient(90deg,transparent,rgba(0,242,254,.3),transparent);left:-60px;animation:btnSwp 3s ease-in-out infinite;pointer-events:none;}
@keyframes btnSwp{0%,100%{left:-60px;opacity:0}30%{opacity:1}70%{left:calc(100% + 20px);opacity:1}100%{left:calc(100% + 60px);opacity:0}}

/* STATUS CARDS */
#cards-row{margin-top:36px;display:flex;gap:14px;flex-wrap:wrap;justify-content:center;pointer-events:all;}
.s-card{position:relative;background:var(--glass-bg);border:1px solid var(--glass-border);backdrop-filter:blur(20px);padding:14px 18px;min-width:155px;cursor:pointer;transition:transform .2s,border-color .3s;animation:cardFloat 4s ease-in-out infinite;clip-path:polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px);}
.s-card:nth-child(2){animation-delay:-1.1s;}.s-card:nth-child(3){animation-delay:-2.3s;}.s-card:nth-child(4){animation-delay:-3.4s;}
@keyframes cardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.s-card:hover{border-color:rgba(0,242,254,.45);}
.c-glow{position:absolute;inset:0;pointer-events:none;opacity:0;box-shadow:0 0 20px rgba(0,242,254,.15),inset 0 0 20px rgba(0,242,254,.04);transition:opacity .3s;clip-path:polygon(8px 0%,100% 0%,100% calc(100% - 8px),calc(100% - 8px) 100%,0% 100%,0% 8px);}
.s-card:hover .c-glow{opacity:1;}
.c-lbl{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.18em;color:var(--cyan);opacity:.65;margin-bottom:5px;text-transform:uppercase;}
.c-val{font-family:var(--font-hud);font-size:clamp(1rem,2.5vw,1.3rem);font-weight:700;color:#fff;letter-spacing:.05em;}
.c-sub{font-family:var(--font-body);font-size:.65rem;color:var(--text-dim);margin-top:3px;letter-spacing:.08em;}
.c-bar-w{margin-top:10px;height:2px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;}
.c-bar{height:100%;width:0%;border-radius:2px;transition:width 1.2s cubic-bezier(.4,0,.2,1);}
.bc{background:linear-gradient(90deg,var(--purple),var(--cyan));box-shadow:0 0 6px var(--cyan);}
.bp{background:linear-gradient(90deg,var(--pink),var(--purple));box-shadow:0 0 6px var(--purple);}
.bg{background:linear-gradient(90deg,var(--cyan),#00ff88);box-shadow:0 0 6px #00ff88;}
.bk{background:linear-gradient(90deg,var(--purple),var(--pink));box-shadow:0 0 6px var(--pink);}
.w-canvas{margin-top:8px;display:block;opacity:.7;}

/* NIGHTCORE OVERLAY */
#nc-overlay{position:fixed;inset:0;z-index:6000;background:rgba(15,0,0,.98);display:none;flex-direction:column;align-items:center;justify-content:center;font-family:var(--font-hud);}
#nc-overlay.show{display:flex;}
#nc-title{font-size:28px;font-weight:900;color:#ff0000;letter-spacing:.3em;text-shadow:0 0 20px #ff0000;animation:ncP 1s infinite;margin-bottom:6px;}
#nc-sub{font-size:9px;color:rgba(255,50,50,.5);letter-spacing:.4em;margin-bottom:30px;}
@keyframes ncP{0%,100%{text-shadow:0 0 20px #ff0000}50%{text-shadow:0 0 40px #ff0000,0 0 80px #ff000066}}
@keyframes ncSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

body.nc .header{border-bottom-color:rgba(255,0,0,.2)!important;background:rgba(8,0,0,.98)!important;}
body.nc .hName{background:linear-gradient(90deg,#ff5555,#fff,#ff5555)!important;background-size:200%!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;}
body.nc .bJ{border-left-color:rgba(255,50,50,.6)!important;background:rgba(18,0,0,.92)!important;color:#ffcccc!important;}
body.nc textarea{border-bottom-color:rgba(255,50,50,.5)!important;}
body.nc #sBtn{border-color:rgba(255,50,50,.5)!important;color:#ff4444!important;}
body.nc #sDot{background:#ff4444!important;box-shadow:0 0 6px #ff4444!important;}
body.nc #sText{color:#ff4444!important;}
body.nc .td{background:#ff4444!important;box-shadow:0 0 6px #ff4444!important;}

/* MIC INDICATOR */
#micBar{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,12,30,.97);border:1px solid rgba(0,200,255,.4);border-radius:6px;padding:14px 22px;text-align:center;z-index:7000;backdrop-filter:blur(20px);}
#micBar.show{display:block;animation:msgIn .3s ease-out;}
.mic-title{font-family:var(--font-hud);font-size:10px;color:var(--cyan);letter-spacing:.25em;margin-bottom:8px;}
.mic-wave{display:flex;gap:3px;justify-content:center;align-items:flex-end;height:20px;}
.mic-wave span{width:3px;background:var(--cyan);border-radius:2px;animation:wave 1s ease-in-out infinite;}
.mic-wave span:nth-child(1){animation-delay:0s;}.mic-wave span:nth-child(2){animation-delay:.1s;}
.mic-wave span:nth-child(3){animation-delay:.2s;}.mic-wave span:nth-child(4){animation-delay:.3s;}
.mic-wave span:nth-child(5){animation-delay:.4s;}
@keyframes wave{0%,100%{height:3px}50%{height:20px}}
.mic-sub{font-family:var(--font-mono);font-size:8px;color:rgba(0,150,255,.35);letter-spacing:.15em;margin-top:5px;}

/* MAIN CHAT APP */
#app{display:flex;flex-direction:column;height:100vh;opacity:0;transition:opacity .8s;position:relative;z-index:5000;font-family:var(--font-body);display:none;}
#app.show{display:flex;opacity:1;}
#appBg{position:fixed;inset:0;z-index:0;background:radial-gradient(ellipse at 50% 0%,rgba(0,80,255,.1) 0%,transparent 50%);}
#appGrid{position:fixed;inset:0;z-index:0;background-image:linear-gradient(rgba(0,100,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,100,255,.04) 1px,transparent 1px);background-size:28px 28px;}
#appScan{position:fixed;inset:0;z-index:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.07) 3px,rgba(0,0,0,.07) 4px);}

/* HEADER */
.header{padding:10px 14px;border-bottom:1px solid rgba(0,140,255,.12);background:rgba(0,2,8,.97);backdrop-filter:blur(20px);display:flex;align-items:center;gap:10px;position:relative;z-index:20;flex-shrink:0;}
.hReactor{position:relative;width:42px;height:42px;flex-shrink:0;}
.hInfo{flex:1;min-width:0;}
.hName{font-family:var(--font-hud);font-size:14px;font-weight:900;letter-spacing:.3em;background:linear-gradient(90deg,#00ccff,#fff,#00aaff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
.hRow{display:flex;align-items:center;gap:4px;margin-top:2px;flex-wrap:wrap;}
.hBy{font-family:var(--font-mono);font-size:7px;color:rgba(0,150,255,.35);letter-spacing:.15em;}
.hOwner{font-family:var(--font-hud);font-size:8px;font-weight:700;letter-spacing:.25em;background:linear-gradient(90deg,#00ffcc,#00aaff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
#sDot{width:5px;height:5px;border-radius:50%;background:#00ff88;box-shadow:0 0 5px #00ff88;animation:pulse 1.5s infinite;flex-shrink:0;}
#sText{font-family:var(--font-mono);font-size:7px;color:#00ff88;letter-spacing:.1em;}
.hBtn{font-size:8px;cursor:pointer;padding:2px 7px;border-radius:3px;font-family:var(--font-mono);letter-spacing:.08em;border:1px solid;transition:all .2s;user-select:none;}
.hTime{text-align:right;flex-shrink:0;}
#clock{font-family:var(--font-hud);font-size:12px;color:#00ccff;font-weight:700;}
#dateEl,#pwrEl{font-family:var(--font-mono);font-size:7px;color:rgba(0,150,255,.35);}

/* STATUS BAR */
#statusBar{padding:4px 14px;background:rgba(0,1,4,.9);border-bottom:1px solid rgba(0,100,255,.06);display:flex;align-items:center;gap:8px;position:relative;z-index:20;flex-shrink:0;overflow-x:auto;}
.sItem{display:flex;align-items:center;gap:3px;font-family:var(--font-mono);font-size:7px;color:rgba(0,150,255,.25);white-space:nowrap;}
.sDotSm{width:4px;height:4px;border-radius:50%;background:rgba(0,150,255,.25);flex-shrink:0;}
.sDotSm.on{background:#00ff88;box-shadow:0 0 4px #00ff88;animation:pulse 1.5s infinite;}
#modeBar{margin-left:auto;font-family:var(--font-mono);font-size:7px;color:rgba(0,150,255,.2);white-space:nowrap;}

/* MESSAGES */
#msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:12px;position:relative;z-index:5;}
#msgs::-webkit-scrollbar{width:2px;}
#msgs::-webkit-scrollbar-thumb{background:rgba(0,140,255,.1);}

/* WELCOME */
.welcome{text-align:center;padding:20px 8px;}
.wReactor{position:relative;width:86px;height:86px;margin:0 auto 16px;}
.wTitle{font-family:var(--font-hud);font-size:10px;font-weight:900;letter-spacing:.5em;background:linear-gradient(90deg,#00ccff,#fff,#00ccff);background-size:200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 3s linear infinite;margin-bottom:4px;}
.wSub{font-family:var(--font-mono);font-size:8px;color:rgba(0,150,255,.35);letter-spacing:.3em;margin-bottom:12px;}
.wText{font-size:13px;color:rgba(0,180,255,.6);line-height:1.7;max-width:290px;margin:0 auto 16px;}
.chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;}
.chip{padding:6px 11px;font-family:var(--font-mono);font-size:10px;background:rgba(0,80,200,.06);border:1px solid rgba(0,130,255,.18);border-radius:3px;color:rgba(0,170,255,.55);cursor:pointer;transition:all .2s;}
.chip:active{background:rgba(0,80,200,.18);}

/* MESSAGE BUBBLES */
.msg{display:flex;gap:8px;align-items:flex-start;animation:msgIn .25s ease-out;}
.msg.user{flex-direction:row-reverse;}
.av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-hud);font-size:10px;font-weight:700;flex-shrink:0;}
.avJ{background:radial-gradient(circle,#001830,#000510);border:1px solid rgba(0,140,255,.3);color:#00aaff;}
.avA{background:radial-gradient(circle,#001a10,#000508);border:1px solid rgba(0,255,120,.3);color:#00ff88;}
.bub{max-width:82%;}
.bLbl{font-family:var(--font-mono);font-size:8px;letter-spacing:.15em;color:rgba(0,140,255,.25);margin-bottom:3px;}
.msg.user .bLbl{text-align:right;}
.bTxt{padding:10px 13px;border-radius:3px;font-size:13px;line-height:1.65;white-space:pre-wrap;word-break:break-word;}
.bJ{background:rgba(0,10,28,.9);border:1px solid rgba(0,110,255,.1);border-left:2px solid rgba(0,150,255,.45);color:#b0d5ff;}
.bA{background:rgba(0,20,12,.9);border:1px solid rgba(0,190,90,.1);border-right:2px solid rgba(0,255,110,.45);color:#b0ffd5;}
.bTxt strong{color:#00ddff;font-weight:700;}

/* TYPING */
.typing{display:none;gap:8px;align-items:flex-start;}
.typing.show{display:flex;}
.typBub{padding:11px 15px;background:rgba(0,10,28,.9);border:1px solid rgba(0,110,255,.1);border-left:2px solid rgba(0,150,255,.45);border-radius:3px;display:flex;gap:5px;align-items:center;}
.td{width:7px;height:7px;border-radius:50%;background:#00aaff;box-shadow:0 0 6px #00aaff;animation:bounceDot 1.2s ease-in-out infinite;}
.td:nth-child(2){animation-delay:.2s;}.td:nth-child(3){animation-delay:.4s;}
.tLbl{font-family:var(--font-mono);font-size:8px;color:rgba(0,150,255,.3);letter-spacing:.15em;margin-left:4px;}

/* INPUT */
#inputArea{padding:10px 12px calc(14px + env(safe-area-inset-bottom));border-top:2px solid rgba(0,100,255,.12);background:rgba(0,2,8,1);position:relative;z-index:20;flex-shrink:0;}
#inputTop{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:7px;color:rgba(0,120,255,.2);letter-spacing:.15em;margin-bottom:8px;}
#inputRow{display:flex;gap:6px;align-items:flex-end;}
#inp{flex:1;background:rgba(0,10,22,.95);border:1px solid rgba(0,120,255,.22);border-bottom:2px solid rgba(0,160,255,.45);border-radius:4px;color:#c5e0ff;font-family:var(--font-body);font-size:15px;padding:12px 14px;outline:none;resize:none;min-height:50px;max-height:120px;line-height:1.5;transition:all .2s;-webkit-appearance:none;}
#inp:focus{border-color:rgba(0,160,255,.5);box-shadow:0 0 12px rgba(0,150,255,.08);background:rgba(0,14,30,.95);}
#inp::placeholder{color:rgba(0,140,210,.3);font-size:14px;}
.btn{width:50px;height:50px;flex-shrink:0;border-radius:4px;font-size:20px;cursor:pointer;transition:all .2s;border:1px solid;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;}
#stopBtn{background:rgba(255,150,0,.1);border-color:rgba(255,150,0,.35);color:#ffaa00;display:none;}
#stopBtn.show{display:flex;}
#micBtn{background:rgba(255,50,50,.07);border-color:rgba(255,80,80,.25);color:rgba(255,100,100,.6);}
#micBtn.active{background:rgba(255,30,30,.18);border-color:rgba(255,30,30,.6);color:#ff3333;box-shadow:0 0 12px rgba(255,30,30,.25);animation:pulse 1s infinite;}
#sBtn{background:rgba(0,80,220,.12);border-color:rgba(0,150,255,.45);color:#00aaff;box-shadow:0 0 12px rgba(0,150,255,.15);}
#sBtn:disabled{background:rgba(0,40,80,.15);border-color:rgba(0,100,200,.1);color:rgba(0,140,255,.25);box-shadow:none;cursor:not-allowed;}
#watermark{position:fixed;bottom:100px;right:6px;font-family:var(--font-hud);font-size:6px;letter-spacing:.2em;color:rgba(0,100,255,.07);font-weight:700;transform:rotate(90deg);transform-origin:right center;z-index:1;}

@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes spinR{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
@keyframes pulse{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
@keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}
@keyframes msgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes bounceDot{0%,100%{transform:translateY(0);opacity:.3}50%{transform:translateY(-4px);opacity:1}}

@media(max-width:768px){.side-panel{display:none;}#cards-row{gap:8px;}.s-card{min-width:140px;padding:10px 14px;}.hud-c{width:50px;height:50px;}.r1{width:120px;height:120px;}.r2{width:180px;height:180px;}.r3{width:260px;height:260px;}}
@media(max-width:480px){#cards-row{display:none;}#hud-bot{display:none;}}
</style>
</head>
<body>

<!-- CURSOR -->
<div id="cur-core"></div>
<div id="cur-ring"></div>
<div id="gestureIndicator"><div id="gestureIcon">✋</div><div id="gestureLabel">GESTURE DETECTED</div></div>
<button id="cursorToggle" onclick="toggleGesture()">👆 GESTURE OFF</button>

<!-- BOOT -->
<div id="boot">
  <div id="boot-logo">J.A.R.V.I.S</div>
  <div id="boot-bar-wrap"><div id="boot-bar"></div></div>
  <div id="boot-status">INITIALIZING NEURAL CORE...</div>
</div>

<!-- THREE.JS -->
<canvas id="three-canvas"></canvas>

<!-- OVERLAYS -->
<div id="vignette"></div>
<div id="grid-ol"></div>
<div id="scanline"></div>
<div id="sweep"></div>
<div id="noise"></div>

<!-- HUD CORNERS -->
<div class="hud-c" id="hc-tl"></div>
<div class="hud-c" id="hc-tr"></div>
<div class="hud-c" id="hc-bl"></div>
<div class="hud-c" id="hc-br"></div>

<!-- RETICLE -->
<div id="reticle">
  <div class="r-ring r1"></div>
  <div class="r-ring r2"></div>
  <div class="r-ring r3"></div>
  <div class="ch-h"></div>
  <div class="ch-v"></div>
</div>

<!-- HUD TOP -->
<div id="hud-top">
  <span class="top-badge b-green b-pulse">● SYSTEM ONLINE</span>
  <span class="top-badge b-cyan">NEURAL OS v9.4.1</span>
  <span class="top-badge b-cyan">LATENCY: <span id="latency-val">12ms</span></span>
  <span class="top-badge b-green">AI CORE STABLE</span>
</div>

<!-- SIDE PANELS -->
<div class="side-panel" id="pl">
  <div class="p-title">// DIAGNOSTICS</div>
  <div class="d-row"><span class="d-key">CPU LOAD</span><span class="d-val" id="cpu-val">04.2%</span></div>
  <div class="d-row"><span class="d-key">GPU TEMP</span><span class="d-val">61°C</span></div>
  <div class="d-row"><span class="d-key">BANDWIDTH</span><span class="d-val ok">94.7 TB/s</span></div>
  <div class="d-row"><span class="d-key">ENCRYPTION</span><span class="d-val ok">AES-4096</span></div>
  <div class="d-row"><span class="d-key">THREAT LVL</span><span class="d-val ok">NOMINAL</span></div>
  <div class="d-div"></div>
  <div class="d-row"><span class="d-key">UPLINK</span><span class="d-val ok">ACTIVE</span></div>
  <div class="d-row"><span class="d-key">GRID NODE</span><span class="d-val warn">SYNC</span></div>
  <div class="d-div"></div>
  <div class="bin-stream" id="bin-l"></div>
</div>
<div class="side-panel" id="pr">
  <div class="p-title">// NEURAL FEED</div>
  <div class="d-row"><span class="d-key">SYNAPSE</span><span class="d-val">98.4%</span></div>
  <div class="d-row"><span class="d-key">COGNITION</span><span class="d-val ok">PRIME</span></div>
  <div class="d-row"><span class="d-key">MEMORY</span><span class="d-val">2.4 YB</span></div>
  <div class="d-row"><span class="d-key">INFERENCE</span><span class="d-val ok">LIVE</span></div>
  <div class="d-row"><span class="d-key">EMOTION SIM</span><span class="d-val">ENABLED</span></div>
  <div class="d-div"></div>
  <div class="d-row"><span class="d-key">LANGUAGE</span><span class="d-val">219 LANGS</span></div>
  <div class="d-row"><span class="d-key">ETHICS CORE</span><span class="d-val ok">ENGAGED</span></div>
  <div class="d-div"></div>
  <div class="bin-stream" id="bin-r"></div>
</div>

<!-- LANDING PAGE -->
<div id="landing">
  <div id="hero">
    <div class="pre-title">AZLAN'S TECH — ADVANCED AI DIVISION</div>
    <h1 id="main-title">J.A.R.V.I.S</h1>
    <div class="sub-title">Just A Rather Very Intelligent System</div>
    <div id="term-line"><span>&gt;</span><span id="term-txt"></span><span id="cur-blink"></span></div>
  </div>
  <div id="cta-wrap">
    <button id="cta-btn" onclick="launchChat()">
      <div class="btn-bdr" id="bb1"></div>
      <div class="btn-bdr" id="bb2"></div>
      <div class="btn-pulse"></div>
      <div id="btn-sweep"></div>
      INITIALIZE JARVIS
    </button>
  </div>
  <div id="cards-row">
    <div class="s-card"><div class="c-glow"></div><div class="c-lbl">AI SYNAPSE CORE</div><div class="c-val"><span class="counter" data-target="98.4">0</span>%</div><div class="c-sub">NEURAL THROUGHPUT</div><div class="c-bar-w"><div class="c-bar bc" data-width="98.4"></div></div><canvas class="w-canvas" width="130" height="28"></canvas></div>
    <div class="s-card"><div class="c-glow"></div><div class="c-lbl">QUANTUM GRID</div><div class="c-val">CONNECTED</div><div class="c-sub">ENTANGLEMENT STABLE</div><div class="c-bar-w"><div class="c-bar bp" data-width="100"></div></div><canvas class="w-canvas" width="130" height="28"></canvas></div>
    <div class="s-card"><div class="c-glow"></div><div class="c-lbl">THREAT ANALYSIS</div><div class="c-val"><span class="counter" data-target="0.3">0</span>%</div><div class="c-sub">PERIMETER SECURE</div><div class="c-bar-w"><div class="c-bar bg" data-width="0.3"></div></div><canvas class="w-canvas" width="130" height="28"></canvas></div>
    <div class="s-card"><div class="c-glow"></div><div class="c-lbl">NEURAL PROCESSING</div><div class="c-val">ACTIVE</div><div class="c-sub">94.7 EXAFLOPS/S</div><div class="c-bar-w"><div class="c-bar bk" data-width="94.7"></div></div><canvas class="w-canvas" width="130" height="28"></canvas></div>
  </div>
</div>

<!-- HUD BOTTOM -->
<div id="hud-bot">
  <div class="t-item"><div class="t-lbl">REACTOR OUTPUT</div><div class="t-val">3.0 GW</div></div>
  <div class="t-sep"></div>
  <div class="t-item"><div class="t-lbl">SHIELD INTEGRITY</div><div class="t-val">100%</div></div>
  <div class="t-sep"></div>
  <div class="t-item"><div class="t-lbl">SYSTEM TIME</div><div class="t-val" id="sys-time">00:00:00</div></div>
  <div class="t-sep"></div>
  <div class="t-item"><div class="t-lbl">UPTIME</div><div class="t-val">99.97%</div></div>
</div>

<!-- NIGHTCORE OVERLAY -->
<div id="nc-overlay">
  <div style="position:relative;width:110px;height:110px;margin-bottom:28px;">
    <div style="position:absolute;inset:0;border-radius:50%;border-top:2px solid rgba(255,0,0,.9);animation:ncSpin 1s linear infinite;"></div>
    <div style="position:absolute;inset:14px;border-radius:50%;border-top:2px solid rgba(255,50,50,.7);animation:ncSpin .7s linear infinite reverse;"></div>
    <div style="position:absolute;inset:28px;border-radius:50%;border-top:2px solid rgba(255,100,100,.8);animation:ncSpin .5s linear infinite;"></div>
    <div style="position:absolute;inset:42px;border-radius:50%;border-top:1px solid rgba(255,0,0,.6);animation:ncSpin .3s linear infinite reverse;"></div>
    <div style="position:absolute;inset:52px;border-radius:50%;background:radial-gradient(circle,#ff0000,#880000,#110000);box-shadow:0 0 20px #ff0000,0 0 40px #ff000066;animation:ncP 1s ease-in-out infinite;"></div>
  </div>
  <div id="nc-title">NIGHTCORE</div>
  <div id="nc-sub">CYBER WARFARE — ENGAGING</div>
  <div style="font-size:8px;color:rgba(255,80,80,.35);letter-spacing:.15em;text-align:center;line-height:1.8;max-width:280px;">⚠ ETHICAL CYBERSECURITY ONLY<br>AUTHORIZED USE BY AZLAN</div>
</div>

<!-- MIC BAR -->
<div id="micBar" onclick="stopListen()">
  <div class="mic-title">🎤 LISTENING</div>
  <div class="mic-wave"><span></span><span></span><span></span><span></span><span></span></div>
  <div class="mic-sub">SPEAK NOW · TAP TO CANCEL</div>
</div>

<!-- MAIN CHAT APP -->
<div id="appBg"></div>
<div id="appGrid"></div>
<div id="appScan"></div>

<div id="app">
  <div class="header">
    <div class="hReactor">
      <div style="position:absolute;inset:0;border-radius:50%;border-top:2px solid rgba(0,220,255,.9);animation:spin 2.5s linear infinite;"></div>
      <div style="position:absolute;inset:9px;border-radius:50%;border-top:2px solid rgba(0,200,255,.7);animation:spinR 4s linear infinite;"></div>
      <div style="position:absolute;inset:18px;border-radius:50%;border-top:2px solid rgba(0,240,255,.8);animation:spin 1.8s linear infinite;"></div>
      <div style="position:absolute;inset:27px;border-radius:50%;background:radial-gradient(circle,#00ffff,#0077ff,#001144);box-shadow:0 0 10px #00ccff,0 0 20px #0066ff66;animation:pulse 2s ease-in-out infinite;"></div>
      <div style="position:absolute;inset:-7px;border-radius:50%;background:radial-gradient(circle,rgba(0,150,255,.1),transparent 70%);animation:pulse 2s ease-in-out infinite;"></div>
    </div>
    <div class="hInfo">
      <div class="hName">J.A.R.V.I.S</div>
      <div class="hRow">
        <span class="hBy">BY</span>
        <span class="hOwner">AZLAN</span>
        <div id="sDot"></div>
        <span id="sText">ONLINE</span>
        <span id="voiceBtn" class="hBtn" onclick="toggleVoice()" style="color:#00ff88;border-color:rgba(0,255,136,.3);">🔊 ON</span>
        <span id="clapBtn" class="hBtn" onclick="toggleClap()" style="color:rgba(0,150,255,.4);border-color:rgba(0,150,255,.2);">👏 OFF</span>
      </div>
    </div>
    <div class="hTime">
      <div id="clock">--:--:--</div>
      <div id="dateEl"></div>
      <div id="pwrEl">⚡ 97%</div>
    </div>
  </div>

  <div id="statusBar">
    <div class="sItem"><div class="sDotSm on"></div>NEURAL</div>
    <div class="sItem"><div class="sDotSm on" id="aiDot"></div>AI</div>
    <div class="sItem"><div class="sDotSm" id="micDot"></div>MIC</div>
    <div class="sItem"><div class="sDotSm on"></div>MEMORY</div>
    <div id="modeBar">MARK III · AZLAN OS v3.0</div>
  </div>

  <div id="msgs">
    <div class="welcome">
      <div class="wReactor" style="position:relative;">
        <div style="position:absolute;inset:0;border-radius:50%;border-top:2px solid rgba(0,220,255,.9);animation:spin 2.5s linear infinite;"></div>
        <div style="position:absolute;inset:11px;border-radius:50%;border-top:2px solid rgba(0,200,255,.7);animation:spinR 4s linear infinite;"></div>
        <div style="position:absolute;inset:22px;border-radius:50%;border-top:2px solid rgba(0,240,255,.8);animation:spin 1.8s linear infinite;"></div>
        <div style="position:absolute;inset:32px;border-radius:50%;background:radial-gradient(circle,#00ffff,#0077ff,#001144);box-shadow:0 0 12px #00ccff,0 0 24px #0066ff;animation:pulse 2s ease-in-out infinite;"></div>
        <div style="position:absolute;inset:-11px;border-radius:50%;background:radial-gradient(circle,rgba(0,150,255,.1),transparent 70%);animation:pulse 2s ease-in-out infinite;"></div>
      </div>
      <div class="wTitle">JARVIS ONLINE</div>
      <div class="wSub">AZLAN'S PERSONAL AI · MARK III</div>
      <div class="wText">Good to see you, <strong style="color:#00ddff;">Azlan</strong>. All systems fully operational.</div>
      <div class="chips">
        <div class="chip" onclick="qs('What can you do?')">Capabilities</div>
        <div class="chip" onclick="qs('Write me Python code')">Write code</div>
        <div class="chip" onclick="qs('Explain AI to me')">Explain AI</div>
        <div class="chip" onclick="qs('Help me build something')">Build</div>
        <div class="chip" onclick="qs('Security analysis')">Security</div>
        <div class="chip" onclick="qs('Surprise me Jarvis')">Surprise me</div>
        <div class="chip" onclick="scanNet()" style="border-color:rgba(0,255,136,.25);color:rgba(0,255,136,.55);">🔍 Scan Network</div>
      </div>
    </div>
    <div class="typing" id="typing">
      <div class="av avJ">J</div>
      <div><div class="bLbl">JARVIS</div>
        <div class="typBub"><div class="td"></div><div class="td"></div><div class="td"></div><span class="tLbl">THINKING...</span></div>
      </div>
    </div>
  </div>

  <div id="inputArea">
    <div id="inputTop">
      <span id="modeLbl">⬡ JARVIS · AZLAN OS v3.0 · MARK III</span>
      <span>TOKENS: <span id="tCount">0</span></span>
    </div>
    <div id="inputRow">
      <button class="btn" id="stopBtn" onclick="stopSpeak()">⏹</button>
      <textarea id="inp" placeholder="Talk to JARVIS, Azlan..." rows="1"
        onkeydown="onKey(event)" oninput="resize(this)"></textarea>
      <button class="btn" id="micBtn" onclick="toggleMic()">🎤</button>
      <button class="btn" id="sBtn" onclick="send()">⟶</button>
    </div>
  </div>
  <div id="watermark">AZLAN © 2026</div>
</div>

<script>
// ══════════════════════════════════
// STATE
// ══════════════════════════════════
let AC=null,cid=null,tok=0,nrg=97.4,busy=false;
let von=true,spk=false,lst=false,nc=false,mode='chat';
let rec=null,lastClap=0,lastWake=0,clapActive=false;
let gestureEnabled=false,lastGestureTime=0;
let appLaunched=false;

// ══════════════════════════════════
// UTILS
// ══════════════════════════════════
const $=id=>document.getElementById(id);
function resize(el){el.style.height='auto';el.style.height=Math.min(el.scrollHeight,120)+'px';}

// ══════════════════════════════════
// CURSOR SYSTEM
// ══════════════════════════════════
const curCore=$('cur-core'),curRing=$('cur-ring');
let mx=window.innerWidth/2,my=window.innerHeight/2,rx=mx,ry=my;
let gestureHistory=[];

document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  curCore.style.left=mx+'px';curCore.style.top=my+'px';
  if(gestureEnabled)trackGesture(mx,my);
});

document.addEventListener('touchmove',e=>{
  const t=e.touches[0];
  mx=t.clientX;my=t.clientY;
  curCore.style.left=mx+'px';curCore.style.top=my+'px';
  if(gestureEnabled)trackGesture(mx,my);
},{passive:true});

function animRing(){
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  curRing.style.left=rx+'px';curRing.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('button,a,.s-card,.chip').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

// Trail
document.addEventListener('mousemove',e=>{
  if(Math.random()>.45)return;
  const d=document.createElement('div');
  d.className='trail-dot';
  const sz=Math.random()*4+2;
  d.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px;opacity:.7;`;
  document.body.appendChild(d);
  if(typeof gsap!=='undefined'){
    gsap.to(d,{opacity:0,scale:0,duration:.6+Math.random()*.4,ease:'power2.out',onComplete:()=>d.remove()});
  }else{
    setTimeout(()=>d.remove(),600);
  }
});

// Ripple
document.addEventListener('click',e=>{
  const r=document.createElement('div');
  r.className='ripple';
  r.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:40px;height:40px;`;
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),900);
});

// ══════════════════════════════════
// GESTURE TRACKING
// ══════════════════════════════════
function trackGesture(x,y){
  const now=Date.now();
  gestureHistory.push({x,y,t:now});
  if(gestureHistory.length>30)gestureHistory.shift();
  if(now-lastGestureTime<800)return;
  if(gestureHistory.length<10)return;

  const first=gestureHistory[0];
  const last=gestureHistory[gestureHistory.length-1];
  const dx=last.x-first.x;
  const dy=last.y-first.y;
  const dist=Math.sqrt(dx*dx+dy*dy);
  const duration=last.t-first.t;

  if(dist<80||duration>1000)return;

  const angle=Math.atan2(dy,dx)*180/Math.PI;
  let gesture=null;

  if(angle>-30&&angle<30)gesture={name:'SWIPE RIGHT →',icon:'👉',action:'next'};
  else if(angle>150||angle<-150)gesture={name:'SWIPE LEFT ←',icon:'👈',action:'prev'};
  else if(angle>-120&&angle<-60)gesture={name:'SWIPE UP ↑',icon:'☝️',action:'scrollUp'};
  else if(angle>60&&angle<120)gesture={name:'SWIPE DOWN ↓',icon:'👇',action:'scrollDown'};

  if(gesture){
    lastGestureTime=now;
    gestureHistory=[];
    showGesture(gesture);
    executeGesture(gesture.action);
  }
}

function detectCircle(){
  if(gestureHistory.length<20)return false;
  const pts=gestureHistory.slice(-20);
  const cx=pts.reduce((s,p)=>s+p.x,0)/pts.length;
  const cy=pts.reduce((s,p)=>s+p.y,0)/pts.length;
  const dists=pts.map(p=>Math.sqrt((p.x-cx)**2+(p.y-cy)**2));
  const avgR=dists.reduce((s,d)=>s+d,0)/dists.length;
  const variance=dists.reduce((s,d)=>s+Math.abs(d-avgR),0)/dists.length;
  return avgR>60&&variance<25;
}

setInterval(()=>{
  if(!gestureEnabled)return;
  if(detectCircle()){
    const now=Date.now();
    if(now-lastGestureTime>1500){
      lastGestureTime=now;
      gestureHistory=[];
      showGesture({name:'CIRCLE — ACTIVATE',icon:'🔄',action:'circle'});
      executeGesture('circle');
    }
  }
},300);

function showGesture(g){
  const gi=$('gestureIcon'),gl=$('gestureLabel'),gd=$('gestureIndicator');
  gi.textContent=g.icon;
  gl.textContent=g.name;
  gd.style.display='block';
  setTimeout(()=>gd.style.display='none',1200);
}

function executeGesture(action){
  beep('pip');
  if(action==='scrollUp'){
    const m=$('msgs');if(m)m.scrollTop-=200;
  }else if(action==='scrollDown'){
    const m=$('msgs');if(m)m.scrollTop+=200;
  }else if(action==='next'){
    qs('What can you help me with next?');
  }else if(action==='prev'){
    toggleVoice();
  }else if(action==='circle'){
    if(!nc)goNightcore();else exitNightcore();
  }
}

function toggleGesture(){
  gestureEnabled=!gestureEnabled;
  const b=$('cursorToggle');
  if(gestureEnabled){
    b.textContent='👆 GESTURE ON';
    b.classList.add('active');
    showGesture({name:'GESTURES ENABLED',icon:'🖐️',action:null});
  }else{
    b.textContent='👆 GESTURE OFF';
    b.classList.remove('active');
  }
}

// ══════════════════════════════════
// THREE.JS
// ══════════════════════════════════
(function initThree(){
  const canvas=$('three-canvas');
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setClearColor(0x000000,0);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,2000);
  camera.position.set(0,0,320);

  const isMob=window.innerWidth<768;
  const COUNT=isMob?4000:12000;
  const geo=new THREE.BufferGeometry();
  const positions=new Float32Array(COUNT*3);
  const colors=new Float32Array(COUNT*3);
  const sizes=new Float32Array(COUNT);
  const phases=new Float32Array(COUNT);
  const radii=new Float32Array(COUNT);
  const speeds=new Float32Array(COUNT);

  const cC=new THREE.Color('#00f2fe');
  const cP=new THREE.Color('#9d4edd');
  const cK=new THREE.Color('#ff007f');
  const cW=new THREE.Color('#ffffff');

  for(let i=0;i<COUNT;i++){
    const theta=Math.random()*Math.PI*2;
    const phi=Math.acos(2*Math.random()-1);
    const r=40+Math.pow(Math.random(),.6)*160;
    radii[i]=r;phases[i]=Math.random()*Math.PI*2;speeds[i]=.08+Math.random()*.18;
    const x=r*Math.sin(phi)*Math.cos(theta);
    const y=r*Math.sin(phi)*Math.sin(theta)*.7;
    const z=r*Math.cos(phi);
    positions[i*3]=x;positions[i*3+1]=y;positions[i*3+2]=z;
    sizes[i]=Math.random()<.05?Math.random()*3+2:Math.random()*1.8+.3;
    const t=(z+160)/320;
    const col=new THREE.Color();
    if(t<.33)col.lerpColors(cP,cC,t/.33);
    else if(t<.66)col.lerpColors(cC,cK,(t-.33)/.33);
    else col.lerpColors(cK,cW,(t-.66)/.34);
    colors[i*3]=col.r;colors[i*3+1]=col.g;colors[i*3+2]=col.b;
  }
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
  geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));

  const tc=(()=>{
    const c=document.createElement('canvas');c.width=c.height=64;
    const ctx=c.getContext('2d');
    const g=ctx.createRadialGradient(32,32,0,32,32,32);
    g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(200,240,255,.7)');g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(c);
  })();

  const mat=new THREE.PointsMaterial({size:2.2,map:tc,vertexColors:true,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0,sizeAttenuation:true});
  const mesh=new THREE.Points(geo,mat);
  scene.add(mesh);

  let tRX=0,tRY=0,cTX=0,cTY=0,curRX=0,curRY=0;
  document.addEventListener('mousemove',e=>{
    const nx=(e.clientX/window.innerWidth-.5);
    const ny=(e.clientY/window.innerHeight-.5);
    tRY=nx*.4;tRX=-ny*.25;cTX=nx*12;cTY=-ny*8;
  });
  document.addEventListener('touchmove',e=>{
    const t=e.touches[0];
    tRY=(t.clientX/window.innerWidth-.5)*.3;
    tRX=-(t.clientY/window.innerHeight-.5)*.2;
  },{passive:true});
  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });

  let t=0;
  const posArr=geo.attributes.position.array;
  const colArr=geo.attributes.color.array;
  const origPos=positions.slice();

  function animP(){
    t+=.004;
    for(let i=0;i<COUNT;i++){
      const ph=phases[i],sp=speeds[i];
      const noise=Math.sin(t*sp+ph)*3;
      const noiseY=Math.cos(t*sp*.7+ph*1.3)*2;
      const ox=origPos[i*3],oz=origPos[i*3+2];
      const angle=t*sp*.12;
      posArr[i*3]=ox*Math.cos(angle)-oz*Math.sin(angle)+noise;
      posArr[i*3+1]=origPos[i*3+1]+noiseY+Math.sin(t*.3+ph)*4;
      posArr[i*3+2]=ox*Math.sin(angle)+oz*Math.cos(angle);
      const cp=(Math.sin(t*.5+ph)+1)*.5;
      const col=new THREE.Color();col.lerpColors(cC,cP,cp);
      const cp2=(Math.cos(t*.3+ph*1.5)+1)*.5;
      if(cp2>.7)col.lerpColors(col,cK,(cp2-.7)/.3);
      colArr[i*3]=col.r;colArr[i*3+1]=col.g;colArr[i*3+2]=col.b;
    }
    geo.attributes.position.needsUpdate=true;
    geo.attributes.color.needsUpdate=true;
    curRX+=(tRX-curRX)*.05;curRY+=(tRY-curRY)*.05;
    mesh.rotation.x=curRX+Math.sin(t*.2)*.04;
    mesh.rotation.y=curRY+t*.04;
    mesh.rotation.z=Math.sin(t*.15)*.02;
    camera.position.x+=(cTX-camera.position.x)*.02;
    camera.position.y+=(cTY-camera.position.y)*.02;
    camera.position.z=320+Math.sin(t*.18)*10;
    camera.lookAt(0,0,0);
    renderer.render(scene,camera);
    requestAnimationFrame(animP);
  }
  animP();
  window._pMat=mat;
})();

// ══════════════════════════════════
// BOOT SEQUENCE
// ══════════════════════════════════
(function bootSeq(){
  if(typeof gsap==='undefined'){
    setTimeout(()=>{
      $('boot').style.display='none';
      showLanding();
    },2000);
    return;
  }

  const msgs=['LOADING NEURAL KERNEL...','CALIBRATING QUANTUM MESH...','ESTABLISHING SECURE UPLINK...','COMPILING HEURISTICS ENGINE...','AZLAN OS v3.0 — READY.'];
  let mi=0;
  const cycle=()=>{if(mi<msgs.length)$('boot-status').textContent=msgs[mi++];};

  const tl=gsap.timeline({defaults:{ease:'power2.out'}});
  tl.to('#boot-logo',{opacity:1,duration:.4,ease:'power3.in'})
    .to('#boot-logo',{opacity:.3,duration:.1}).to('#boot-logo',{opacity:1,duration:.15})
    .to('#boot-logo',{opacity:.2,duration:.08}).to('#boot-logo',{opacity:1,duration:.2})
    .to('#boot-bar-wrap',{opacity:1,duration:.3},'-=.1')
    .to('#boot-status',{opacity:1,duration:.3},'-=.1')
    .call(cycle).to('#boot-bar',{width:'20%',duration:.5})
    .call(cycle).to('#boot-bar',{width:'45%',duration:.6})
    .call(cycle).to('#boot-bar',{width:'68%',duration:.5})
    .call(cycle).to('#boot-bar',{width:'88%',duration:.7})
    .call(cycle).to('#boot-bar',{width:'100%',duration:.4})
    // ✅ FIX 1: was .to({},' duration:.4}) — rogue quote broke the whole timeline
    .to({},{duration:.4})
    .to('#boot',{opacity:0,duration:.5,ease:'power2.in',onComplete:()=>{$('boot').style.display='none';}})
    .call(()=>showLanding());
})();

function showLanding(){
  if(typeof gsap==='undefined'){
    $('landing').style.opacity='1';$('landing').style.pointerEvents='all';
    $('grid-ol').style.opacity='1';$('scanline').style.opacity='1';
    $('sweep').style.opacity='1';$('hud-top').style.opacity='1';
    $('reticle').style.opacity='1';$('hud-bot').style.opacity='1';
    document.querySelectorAll('.hud-c').forEach(e=>e.style.opacity='1');
    document.querySelectorAll('.side-panel').forEach(e=>e.style.opacity='1');
    if(window._pMat)window._pMat.opacity=.88;
    $('cursorToggle').style.display='block';
    startTerminal();startBinary();startWaveforms();startCounters();animateBars();
    return;
  }

  const tl=gsap.timeline();
  tl.to('#grid-ol',{opacity:1,duration:1})
    .to('#scanline',{opacity:1,duration:.5},'-=.5')
    .to('#sweep',{opacity:1,duration:.5},'-=.3')
    .to(['.hud-c'],{opacity:1,duration:.4,stagger:.12},'-=.3')
    .to('#hud-top',{opacity:1,duration:.5},'-=.2')
    .to('#reticle',{opacity:1,duration:.8},'-=.4')
    .to(window._pMat,{opacity:.88,duration:1.5,ease:'power2.inOut'},'-=.8')
    .to('#pl',{opacity:1,duration:.6,ease:'power3.out'},'-=.8')
    .to('#pr',{opacity:1,duration:.6,ease:'power3.out'},'-=.5')
    .to('#landing',{opacity:1,duration:.6,pointerEvents:'all'},'-=.5')
    .to('#hud-bot',{opacity:1,duration:.5},'-=.3')
    .from('.s-card',{y:30,opacity:0,duration:.6,stagger:.12,ease:'back.out(1.4)'},'-=.4')
    .call(()=>{
      startCounters();animateBars();startTerminal();
      startBinary();startWaveforms();
      $('cursorToggle').style.display='block';
    });
}

// ══════════════════════════════════
// LAUNCH CHAT
// ══════════════════════════════════
function launchChat(){
  if(appLaunched)return;
  appLaunched=true;
  beep('up');

  if(typeof gsap!=='undefined'){
    gsap.timeline()
      .to('#cta-btn',{scale:.95,duration:.08})
      .to('#cta-btn',{scale:1.06,duration:.15,ease:'power3.out'})
      .to('#cta-btn',{scale:1,duration:.4,ease:'elastic.out(1.2,.4)'})
      .to('#landing',{opacity:0,duration:.6,ease:'power2.in'})
      .to('#hud-top',{opacity:0,duration:.3},'-=.4')
      .to('#hud-bot',{opacity:0,duration:.3},'-=.4')
      .to(['.side-panel'],{opacity:0,duration:.3},'-=.3')
      .to('#reticle',{opacity:0,duration:.3},'-=.3')
      .call(()=>{
        $('landing').style.display='none';
        $('app').style.display='flex';
        setTimeout(()=>{$('app').classList.add('show');},50);
        startClock();
        setTimeout(()=>initClap(),2000);
        loadMemory();
        speak('JARVIS online. Welcome back, Azlan. All systems operational.');
      });
  }else{
    $('landing').style.display='none';
    $('app').style.display='flex';
    setTimeout(()=>{$('app').classList.add('show');},50);
    startClock();
    setTimeout(()=>initClap(),2000);
    loadMemory();
    speak('JARVIS online. Welcome back, Azlan.');
  }
}

// ══════════════════════════════════
// AUDIO ENGINE
// ══════════════════════════════════
function AC_(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();return AC;}

function beep(type){
  try{
    const ctx=AC_(),o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    const t=ctx.currentTime;
    if(type==='up'){
      o.frequency.setValueAtTime(60,t);o.frequency.exponentialRampToValueAtTime(2200,t+2.5);
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.2);g.gain.exponentialRampToValueAtTime(.001,t+2.5);
      o.start();o.stop(t+2.5);
      const o2=ctx.createOscillator(),g2=ctx.createGain();
      o2.connect(g2);g2.connect(ctx.destination);
      o2.frequency.setValueAtTime(120,t);o2.frequency.exponentialRampToValueAtTime(4000,t+2.5);
      g2.gain.setValueAtTime(0,t);g2.gain.linearRampToValueAtTime(.12,t+.2);g2.gain.exponentialRampToValueAtTime(.001,t+2.5);
      o2.start();o2.stop(t+2.5);
    }else if(type==='pip'){
      o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(1300,t+.08);
      g.gain.setValueAtTime(.22,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);
      o.start();o.stop(t+.1);
    }else if(type==='snd'){
      o.frequency.setValueAtTime(700,t);o.frequency.exponentialRampToValueAtTime(1000,t+.07);
      g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.09);
      o.start();o.stop(t+.09);
    }else if(type==='rcv'){
      o.frequency.setValueAtTime(1000,t);o.frequency.exponentialRampToValueAtTime(700,t+.1);
      g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);
      o.start();o.stop(t+.12);
    }else if(type==='stp'){
      o.type='square';o.frequency.setValueAtTime(180,t);
      g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);
      o.start();o.stop(t+.15);
    }else if(type==='wsh'){
      o.type='sawtooth';o.frequency.setValueAtTime(400,t);o.frequency.exponentialRampToValueAtTime(30,t+.5);
      g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);
      o.start();o.stop(t+.5);
    }
  }catch(e){}
}

// ══════════════════════════════════
// VOICE OUTPUT
// ══════════════════════════════════
function speak(txt){
  if(!von||!txt)return;
  spk=true;$('stopBtn').classList.add('show');
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(txt);
  const go=()=>{
    const vs=window.speechSynthesis.getVoices();
    const want=['Google UK English Male','Daniel','Microsoft David Desktop','Alex'];
    let v=null;
    for(const n of want){v=vs.find(x=>x.name.includes(n));if(v)break;}
    if(!v)v=vs.find(x=>x.lang&&x.lang.startsWith('en-'));
    if(v)u.voice=v;
    u.rate=.88;u.pitch=.85;u.volume=1;
    u.onend=u.onerror=()=>{spk=false;$('stopBtn').classList.remove('show');};
    window.speechSynthesis.speak(u);
  };
  if(window.speechSynthesis.getVoices().length)go();
  else window.speechSynthesis.onvoiceschanged=go;
}

function stopSpeak(){window.speechSynthesis.cancel();spk=false;$('stopBtn').classList.remove('show');beep('stp');}

function toggleVoice(){
  von=!von;
  const b=$('voiceBtn');
  if(von){b.textContent='🔊 ON';b.style.color='#00ff88';b.style.borderColor='rgba(0,255,136,.3)';speak('Voice enabled.');}
  else{window.speechSynthesis.cancel();spk=false;$('stopBtn').classList.remove('show');b.textContent='🔇 OFF';b.style.color='rgba(255,80,80,.5)';b.style.borderColor='rgba(255,80,80,.25)';}
}

// ══════════════════════════════════
// VOICE INPUT
// ══════════════════════════════════
function toggleMic(){lst?stopListen():startListen();}

function startListen(){
  if(!('webkitSpeechRecognition'in window)&&!('SpeechRecognition'in window)){alert('Use Chrome!');return;}
  if(spk)stopSpeak();
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  rec=new SR();rec.continuous=false;rec.interimResults=true;rec.lang='en-US';
  rec.onstart=()=>{lst=true;$('micBtn').classList.add('active');$('micDot').classList.add('on');$('inp').placeholder='🎤 Listening...';$('micBar').classList.add('show');};
  rec.onresult=e=>{$('inp').value=Array.from(e.results).map(r=>r[0].transcript).join('');};
  rec.onend=()=>{
    lst=false;$('micBtn').classList.remove('active');$('micDot').classList.remove('on');
    $('inp').placeholder='Talk to JARVIS, Azlan...';$('micBar').classList.remove('show');
    const t=$('inp').value.trim();if(t)send();
  };
  rec.onerror=()=>{lst=false;$('micBtn').classList.remove('active');$('micDot').classList.remove('on');$('micBar').classList.remove('show');};
  rec.start();
}

function stopListen(){if(rec)rec.stop();lst=false;$('micBtn').classList.remove('active');$('micDot').classList.remove('on');$('micBar').classList.remove('show');}

// ══════════════════════════════════
// CLAP DETECTION
// ══════════════════════════════════
async function initClap(){
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    const src=ctx.createMediaStreamSource(stream);
    const an=ctx.createAnalyser();
    an.fftSize=256;an.smoothingTimeConstant=.1;src.connect(an);
    const buf=new Uint8Array(an.frequencyBinCount);
    let quiet=true;
    setInterval(()=>{
      if(spk||lst)return;
      an.getByteFrequencyData(buf);
      const peak=Math.max(...Array.from(buf.slice(20,60)));
      if(peak>195&&quiet){
        const now=Date.now();
        if(now-lastClap>150&&now-lastClap<650&&now-lastWake>5000){lastWake=now;wakeUp();}
        lastClap=now;
      }
      quiet=peak<140;
    },25);
  }catch(e){console.log('Clap N/A');}
}

let clapActive2=false;
function toggleClap(){
  if(!clapActive2){initClap();clapActive2=true;const b=$('clapBtn');b.textContent='👏 ON';b.style.color='#00ff88';b.style.borderColor='rgba(0,255,136,.3)';}
  else{clapActive2=false;const b=$('clapBtn');b.textContent='👏 OFF';b.style.color='rgba(0,150,255,.4)';b.style.borderColor='rgba(0,150,255,.2)';}
}

function wakeUp(){
  const f=document.createElement('div');
  f.style.cssText='position:fixed;inset:0;background:#00aaff;opacity:.3;z-index:9994;pointer-events:none;';
  document.body.appendChild(f);setTimeout(()=>f.remove(),200);
  beep('up');
  const d=document.createElement('div');
  d.style.cssText='position:fixed;top:80px;left:50%;transform:translateX(-50%);background:rgba(0,18,38,.96);border:1px solid rgba(0,200,255,.45);border-radius:4px;padding:9px 18px;font-family:Orbitron,monospace;font-size:10px;color:#00ccff;letter-spacing:.2em;z-index:9993;';
  d.textContent='👋 JARVIS ACTIVATED';
  document.body.appendChild(d);setTimeout(()=>d.remove(),2200);
  spk=true;speak('Yes Azlan?');
  setTimeout(()=>{spk=false;$('inp').focus();},2800);
}

// ══════════════════════════════════
// NIGHTCORE
// ══════════════════════════════════
function goNightcore(){
  $('nc-overlay').classList.add('show');
  beep('up');
  const f=document.createElement('div');
  f.style.cssText='position:fixed;inset:0;background:#ff0000;opacity:.2;z-index:9993;pointer-events:none;';
  document.body.appendChild(f);setTimeout(()=>f.remove(),400);
  setTimeout(()=>{
    $('nc-overlay').classList.remove('show');
    nc=true;mode='nightcore';
    document.body.classList.add('nc');
    $('sText').textContent='NIGHTCORE';
    $('modeLbl').textContent='💀 NIGHTCORE · CYBER WARFARE · ACTIVE';
    addMsg('J','💀 NIGHTCORE MODE ENGAGED\n\n⚡ Cyber warfare systems online.\n🔴 Defensive hacking protocols active.\n🛡️ I am your cybersecurity weapon, Azlan.\n\nWhat is your target?');
    speak('Nightcore mode engaged. Ready for your command Azlan.');
  },3000);
}

function exitNightcore(){
  nc=false;mode='chat';
  document.body.classList.remove('nc');
  // ✅ FIX 3: Reset status dot and text colours when exiting nightcore
  $('sDot').style.background='#00ff88';
  $('sDot').style.boxShadow='0 0 5px #00ff88';
  $('sText').textContent='ONLINE';
  $('sText').style.color='#00ff88';
  $('modeLbl').textContent='⬡ JARVIS · AZLAN OS v3.0 · MARK III';
  addMsg('J','✅ NIGHTCORE deactivated. Returning to standard mode.');
  speak('Nightcore deactivated.');
}

// ══════════════════════════════════
// NETWORK SCAN
// ══════════════════════════════════
async function scanNet(){
  addMsg('U','🔍 Scanning network...');setLoad(true);
  try{
    const r=await fetch('http://localhost:8080/api/network/scan');
    const d=await r.json();
    let s='🛰️ NETWORK SCAN COMPLETE\n━━━━━━━━━━━━━━━━━━\n';
    s+=`Total: ${d.total} device(s)\n\n`;
    (d.devices||[]).forEach(x=>{s+=`${x.icon} ${x.ip}\n   ${x.hostname}\n   ${x.device_type}${x.is_self?' ✅':''}\n\n`;});
    addMsg('J',s);speak(`Found ${d.total} devices.`);
  }catch(e){addMsg('J','⚠️ Scan failed. Check backend.');}
  setLoad(false);
}

// ══════════════════════════════════
// MEMORY
// ══════════════════════════════════
async function loadMemory(){
  try{
    const r=await fetch('http://localhost:8080/api/memory/context');
    const d=await r.json();
    if(d.context)console.log('Memory:',d.context);
  }catch(e){}
}

async function saveSession(){
  try{
    await fetch('http://localhost:8080/api/memory/session',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({topics:[],summary:'Session with Azlan'})
    });
  }catch(e){}
}
window.addEventListener('beforeunload',saveSession);

// ══════════════════════════════════
// CLOCK
// ══════════════════════════════════
function startClock(){
  setInterval(()=>{
    const n=new Date();
    $('clock').textContent=n.toLocaleTimeString('en-US',{hour12:false});
    $('dateEl').textContent=n.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
    nrg=Math.min(100,Math.max(88,nrg+(Math.random()>.5?.2:-.2)));
    $('pwrEl').textContent='⚡ '+nrg.toFixed(1)+'%';
  },1000);
  setInterval(()=>{
    const n=new Date();
    const el=$('sys-time');if(el)el.textContent=n.toLocaleTimeString('en-US',{hour12:false});
  },1000);
  setInterval(()=>{const el=$('latency-val');if(el)el.textContent=(8+Math.floor(Math.random()*12))+'ms';},1800);
  setInterval(()=>{const el=$('cpu-val');if(el)el.textContent=(2+Math.random()*6).toFixed(1)+'%';},2200);
}

// ══════════════════════════════════
// LOADING STATE
// ══════════════════════════════════
function setLoad(v){
  busy=v;
  const dot=$('sDot'),txt=$('sText'),btn=$('sBtn'),typ=$('typing'),ai=$('aiDot');
  if(v){
    if(!nc){dot.style.background='#ffaa00';dot.style.boxShadow='0 0 5px #ffaa00';txt.textContent='PROCESSING...';txt.style.color='#ffaa00';}
    btn.disabled=true;btn.textContent='⟳';typ.classList.add('show');
    ai.style.background='#ffaa00';ai.style.boxShadow='0 0 4px #ffaa00';
  }else{
    // ✅ FIX 2: Was split across two WhatsApp messages — txt. / textContent='ONLINE'
    if(!nc){dot.style.background='#00ff88';dot.style.boxShadow='0 0 5px #00ff88';txt.textContent='ONLINE';txt.style.color='#00ff88';}
    btn.disabled=false;btn.textContent='⟶';typ.classList.remove('show');
    ai.style.background='#00ff88';ai.style.boxShadow='0 0 4px #00ff88';
  }
  $('msgs').scrollTop=99999;
}

// ══════════════════════════════════
// MESSAGES
// ══════════════════════════════════
function fmt(t){return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');}

function addMsg(who,txt){
  const msgs=$('msgs'),typ=$('typing');
  const d=document.createElement('div');
  const isJ=who==='J';
  d.className='msg'+(isJ?'':' user');
  d.innerHTML=`<div class="av ${isJ?'avJ':'avA'}">${isJ?'J':'A'}</div><div class="bub"><div class="bLbl">${isJ?'JARVIS':'AZLAN'}</div><div class="bTxt ${isJ?'bJ':'bA'}">${fmt(txt)}</div></div>`;
  msgs.insertBefore(d,typ);
  msgs.scrollTop=99999;
}

// ══════════════════════════════════
// SEND
// ══════════════════════════════════
async function send(){
  const inp=$('inp');
  const txt=inp.value.trim();
  if(!txt||busy)return;
  const low=txt.toLowerCase();
  if(low==='nightcore'){inp.value='';inp.style.height='auto';if(!nc)goNightcore();return;}
  if(low==='exit nightcore'||low==='deactivate'){inp.value='';inp.style.height='auto';if(nc)exitNightcore();return;}
  inp.value='';inp.style.height='auto';
  beep('snd');addMsg('U',txt);setLoad(true);
  try{
    const r=await fetch('http://localhost:8080/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:txt,conversation_id:cid,mode:mode}),
    });
    const d=await r.json();
    if(!cid)cid=d.conversation_id;
    tok+=(d.tokens_used||0);
    $('tCount').textContent=tok.toLocaleString();
    beep('rcv');addMsg('J',d.response);
    speak(d.response.slice(0,280));
  }catch(e){
    addMsg('J','⚠ Signal lost. Check backend connection at localhost:8080.');
  }
  setLoad(false);
}

function qs(t){$('inp').value=t;send();}
function onKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}

// ══════════════════════════════════
// TERMINAL TYPEWRITER
// ══════════════════════════════════
function startTerminal(){
  const messages=[
    'NEURAL LINK ACTIVE — ALL SYSTEMS NOMINAL',
    'QUANTUM GRID CONNECTED — ENTANGLEMENT STABLE',
    'THREAT MATRIX CLEAR — PERIMETER SECURE',
    'SYNAPSE THROUGHPUT: 98.4% — OPERATING AT PEAK',
    'AWAITING YOUR COMMAND, AZLAN.',
  ];
  let mi=0;
  const el=$('term-txt');
  if(!el)return;
  function type(msg,cb){
    let i=0;el.textContent='';
    const iv=setInterval(()=>{
      el.textContent+=msg[i++];
      if(i>=msg.length){clearInterval(iv);setTimeout(cb,2200);}
    },42);
  }
  function erase(cb){
    const iv=setInterval(()=>{
      const t=el.textContent;
      if(!t.length){clearInterval(iv);cb();return;}
      el.textContent=t.slice(0,-1);
    },22);
  }
  function loop(){type(messages[mi++%messages.length],()=>erase(loop));}
  loop();
}

// ══════════════════════════════════
// BINARY STREAM
// ══════════════════════════════════
function startBinary(){
  ['bin-l','bin-r'].forEach(id=>{
    const el=$(id);if(!el)return;
    setInterval(()=>{
      let s='';
      for(let i=0;i<80;i++)s+=['0','1',' '][Math.floor(Math.random()*3)];
      el.textContent=s;
    },120);
  });
}

// ══════════════════════════════════
// WAVEFORMS
// ══════════════════════════════════
function startWaveforms(){
  const colors=['#00f2fe','#9d4edd','#00ff88','#ff007f'];
  document.querySelectorAll('.w-canvas').forEach((cv,idx)=>{
    const ctx=cv.getContext('2d');
    let t=idx*50;
    function draw(){
      ctx.clearRect(0,0,cv.width,cv.height);
      ctx.strokeStyle=colors[idx%colors.length];
      ctx.lineWidth=1.5;
      ctx.shadowColor=colors[idx%colors.length];
      ctx.shadowBlur=6;
      ctx.beginPath();
      for(let x=0;x<=cv.width;x+=2){
        const y=cv.height/2+Math.sin((x*.06)+t*.05)*6+Math.sin((x*.12)+t*.08+1)*3+Math.random()*1.5;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();t++;
      requestAnimationFrame(draw);
    }
    draw();
  });
}

// ══════════════════════════════════
// COUNTERS & BARS
// ══════════════════════════════════
function startCounters(){
  document.querySelectorAll('.counter').forEach(el=>{
    const target=parseFloat(el.dataset.target);
    const isInt=Number.isInteger(target);
    let current=0;
    const step=target/60;
    const iv=setInterval(()=>{
      current+=step;
      if(current>=target){current=target;clearInterval(iv);}
      el.textContent=isInt?Math.floor(current):current.toFixed(1);
    },20);
  });
}

function animateBars(){
  document.querySelectorAll('.c-bar').forEach(el=>{
    const w=el.dataset.width;
    setTimeout(()=>{el.style.width=w+'%';},100);
  });
}

// ══════════════════════════════════
// HUD FLICKER
// ══════════════════════════════════
setInterval(()=>{
  if(typeof gsap==='undefined')return;
  const corners=document.querySelectorAll('.hud-c');
  const pick=corners[Math.floor(Math.random()*corners.length)];
  gsap.to(pick,{opacity:.2,duration:.05,yoyo:true,repeat:3,onComplete:()=>gsap.set(pick,{opacity:1})});
},3500);

// CTA button events
const ctaBtn=$('cta-btn');
if(ctaBtn&&typeof gsap!=='undefined'){
  ctaBtn.addEventListener('mouseenter',function(){gsap.to(this,{scale:1.04,duration:.3,ease:'power2.out'});});
  ctaBtn.addEventListener('mouseleave',function(){gsap.to(this,{scale:1,x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'});});
  ctaBtn.addEventListener('mousemove',function(e){
    const rect=this.getBoundingClientRect();
    const dx=e.clientX-(rect.left+rect.width/2);
    const dy=e.clientY-(rect.top+rect.height/2);
    gsap.to(this,{x:dx*.2,y:dy*.2,duration:.3,ease:'power2.out'});
  });
}

const sty=document.createElement('style');
sty.textContent='@keyframes particleFly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}';
document.head.appendChild(sty);
</script>
</body>
</html>