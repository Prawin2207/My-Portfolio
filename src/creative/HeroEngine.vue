<template>
  <section id="input" ref="root" class="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-ink">
    <!-- WebGL signal terrain -->
    <canvas ref="canvas" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div v-if="!webgl" class="schematic-grid absolute inset-0" aria-hidden="true"></div>
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_20%,#0a0a0b_78%)]"></div>
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent"></div>

    <!-- Top telemetry row -->
    <div class="hero-meta relative z-10 mx-auto mt-24 flex w-full max-w-[1600px] items-start justify-between px-5 md:mt-28 md:px-12">
      <div class="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-bone">
        <span class="led"></span> NODE_01 // INPUT
      </div>
      <div class="hidden text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-zinc-500 sm:block">
        +11.1271° N &nbsp; +78.6569° E<br />Tamil Nadu, IN
      </div>
    </div>

    <!-- Monumental name -->
    <div ref="titleWrap" class="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-5 md:px-12">
      <h1 class="sr-only">Prawin K. — Full-Stack Developer and Zoho Specialist</h1>
      <div aria-hidden="true" class="select-none">
        <!-- "PRAWIN K." on one line; font-size is fitted to the container width in JS -->
        <div ref="nameLine" class="name-line inline-flex w-max items-baseline whitespace-nowrap font-display uppercase">
          <div ref="nameEl" class="hero-name">PRAWIN</div>
          <div ref="kEl" class="hero-k">K<span class="hero-dot" aria-hidden="true"></span></div>
        </div>
        <p ref="roleEl" class="mt-6 max-w-[40ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-bone-dim md:mt-8 md:text-xs">
          Full-stack developer / Zoho specialist
        </p>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="hero-meta relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-end gap-6 px-5 pb-8 md:grid-cols-3 md:px-12 md:pb-10">
      <p class="max-w-[42ch] text-sm font-light leading-relaxed text-bone/70">
        {{ bio }}
      </p>

      <a href="#work" class="group hidden flex-col items-center gap-3 justify-self-center md:flex" data-cursor="Scroll">
        <span class="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">Scroll to run pipeline</span>
        <span class="relative block h-14 w-px overflow-hidden bg-zinc-700">
          <span class="scroll-pulse absolute left-1/2 top-0 h-3 w-[3px] -translate-x-1/2 rounded-full bg-accent"></span>
        </span>
      </a>

      <div class="flex items-center gap-3 justify-self-start border border-zinc-800 bg-[#121214]/80 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-bone backdrop-blur md:justify-self-end">
        <span class="led"></span>
        Available for work
        <span class="text-zinc-600">—</span>
        <span class="tabular-nums text-accent">IST {{ clock }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, hasWebGL, isFinePointer } from './motion';

const props = defineProps({
  bio: { type: String, required: true },
  ready: { type: Boolean, default: false }
});

const root = ref(null);
const canvas = ref(null);
const titleWrap = ref(null);
const nameEl = ref(null);
const nameLine = ref(null);

// "PRAWIN K." on one line at a compact 100px; shrinks only when the screen is too narrow
const NAME_MAX_PX = 100;
const fitName = () => {
  const line = nameLine.value;
  const box = titleWrap.value;
  if (!line || !box) return;
  const cs = getComputedStyle(box);
  const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  line.style.fontSize = '100px';
  const w = line.scrollWidth;
  if (w > 0) line.style.fontSize = Math.min(NAME_MAX_PX, (100 * avail * 0.995) / w) + 'px';
  ScrollTrigger.refresh();
};
let fitRO = null;
const roleEl = ref(null);
const kEl = ref(null);
const webgl = ref(true);
const clock = ref('--:--:--');

let terrain = null;
let ctx = null;
let introStarted = false;
let split = null;
let io = null;
let clockTimer = 0;
let ro = null;

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
});
const updateClock = () => { clock.value = fmt.format(new Date()); };

const onPointerMove = (e) => terrain?.setPointer(e.clientX, e.clientY);
const onPointerLeave = () => terrain?.clearPointer();

// Proximity "x-ray": letters near the cursor fade from solid to outline.
// Only the fill opacity changes, so letter widths stay perfectly even.
let chars = [];
let fillSetters = [];
const onNameMove = (e) => {
  chars.forEach((c, i) => {
    const r = c.getBoundingClientRect();
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    fillSetters[i](gsap.utils.clamp(0, 1, gsap.utils.mapRange(60, 300, 0, 1, d)));
  });
};
const onNameLeave = () => fillSetters.forEach((s) => s(1));

const playIntro = async () => {
  if (introStarted) return;
  introStarted = true; // guard against double start while fonts load
  await document.fonts?.ready;
  if (unmounted) return;
  const reduce = prefersReducedMotion();
  ctx = gsap.context(() => {
    split = new SplitText(nameEl.value, { type: 'chars', mask: 'chars' });
    chars = split.chars;

    if (reduce) return;

    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(split.chars, { yPercent: 115, rotate: 8, duration: 1.4, stagger: 0.07 })
      .from(kEl.value, { scale: 0.2, opacity: 0, transformOrigin: '100% 100%', duration: 1.2 }, 0.45)
      .to(roleEl.value, {
        duration: 1.6,
        scrambleText: { text: roleEl.value.textContent, chars: '01<>/{}#_', speed: 0.6, revealDelay: 0.3 },
        ease: 'none'
      }, 0.5)
      .from(root.value.querySelectorAll('.hero-meta > *'), { opacity: 0, y: 24, duration: 1, stagger: 0.08 }, 0.7);

    // Scroll: text drifts up & thins; terrain scatters
    gsap.to(titleWrap.value, {
      yPercent: -35,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true }
    });
    ScrollTrigger.create({
      trigger: root.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => terrain?.setScatter(self.progress * 1.2)
    });

    if (isFinePointer()) {
      fillSetters = chars.map((c) => {
        gsap.set(c, { '--fill': 1 });
        return gsap.quickTo(c, '--fill', { duration: 0.5, ease: 'power3.out' });
      });
      root.value.addEventListener('pointermove', onNameMove);
      root.value.addEventListener('pointerleave', onNameLeave);
    }
  }, root.value);
};

let unmounted = false;

onMounted(async () => {
  updateClock();
  clockTimer = window.setInterval(updateClock, 1000);
  fitName();
  document.fonts?.ready.then(fitName);
  let fitTimer = 0;
  fitRO = new ResizeObserver(() => { clearTimeout(fitTimer); fitTimer = setTimeout(fitName, 80); });
  fitRO.observe(titleWrap.value);
  if (props.ready) playIntro();

  webgl.value = hasWebGL();
  if (webgl.value) {
    try {
      // Three.js is loaded on demand so text & layout appear before the 3D engine
      const { createSignalTerrain } = await import('./SignalTerrain');
      if (unmounted) return;
      terrain = createSignalTerrain(canvas.value, { dense: window.innerWidth > 900 });
      ro = new ResizeObserver(() => terrain.resize());
      ro.observe(canvas.value);
      if (prefersReducedMotion()) {
        terrain.setScatter(0);
        terrain.start();
        requestAnimationFrame(() => requestAnimationFrame(() => terrain.stop()));
      } else {
        // Only render while the hero is on screen
        io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? terrain.start() : terrain.stop()));
        io.observe(root.value);
        root.value.addEventListener('pointermove', onPointerMove, { passive: true });
        root.value.addEventListener('pointerleave', onPointerLeave);
      }
    } catch {
      webgl.value = false;
    }
  }
});

watch(() => props.ready, (r) => { if (r) playIntro(); });

onBeforeUnmount(() => {
  unmounted = true;
  clearInterval(clockTimer);
  fitRO?.disconnect();
  io?.disconnect();
  ro?.disconnect();
  root.value?.removeEventListener('pointermove', onPointerMove);
  root.value?.removeEventListener('pointerleave', onPointerLeave);
  root.value?.removeEventListener('pointermove', onNameMove);
  root.value?.removeEventListener('pointerleave', onNameLeave);
  ctx?.revert();
  terrain?.dispose();
});
</script>

<style scoped>
.name-line {
  font-size: min(100px, 13.5vw); /* fallback; fitName() sets the exact size */
}
.hero-name {
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.06em;
  margin-left: -0.05em;
}
/* SplitText chars: solid fill that can fade to an outline */
.hero-name :deep(div) {
  color: rgba(237, 232, 223, var(--fill, 1));
  -webkit-text-stroke: 1.5px rgba(237, 232, 223, 0.8);
}
.hero-k {
  margin-left: 0.2em;
  font-weight: 700;
  line-height: 0.82;
  letter-spacing: -0.04em;
  -webkit-text-stroke: 1.5px rgba(237, 232, 223, 0.8);
  color: transparent;
}
.hero-dot {
  display: inline-block;
  width: 0.15em;
  height: 0.15em;
  margin-left: 0.06em;
  border-radius: 9999px;
  background: #c6ff3d;
  box-shadow: 0 0 0.12em rgba(198, 255, 61, 0.7);
  animation: dot 2.4s ease-in-out infinite;
}
@keyframes dot {
  50% { box-shadow: 0 0 0.03em rgba(198, 255, 61, 0.3); transform: scale(0.88); }
}
.led {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #c6ff3d;
  box-shadow: 0 0 12px rgba(198, 255, 61, 0.7);
  animation: led 1.8s ease-in-out infinite;
}
@keyframes led {
  50% { opacity: 0.35; box-shadow: 0 0 2px rgba(198, 255, 61, 0.3); }
}
.scroll-pulse {
  animation: pulse-down 1.8s cubic-bezier(.6, 0, .4, 1) infinite;
}
@keyframes pulse-down {
  0% { transform: translate(-50%, -100%); }
  100% { transform: translate(-50%, 500%); }
}
@media (prefers-reduced-motion: reduce) {
  .led, .scroll-pulse, .hero-dot { animation: none; }
}
</style>
