<template>
  <section id="capabilities" ref="root" class="relative border-t border-zinc-800 bg-ink py-24 md:py-32">
    <div class="schematic-grid pointer-events-none absolute inset-0 opacity-50"></div>
    <div class="relative mx-auto max-w-[1600px] px-5 md:px-12">
      <!-- header -->
      <div class="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div class="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
            <span class="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_rgba(198,255,61,0.8)]"></span>
            NODE_03 // CAPABILITIES
          </div>
          <h2 ref="heading" class="mt-5 font-display text-[clamp(2.6rem,6.5vw,6.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.04em]">
            Wired for<br />the <span class="text-accent">whole</span> stack
          </h2>
        </div>
        <p class="max-w-[40ch] text-sm font-light leading-relaxed text-bone/60 md:text-right">
          Hover a node to trace how it connects. Zoho apps on the left, custom engineering on the right — joined by the API layer I build between them.
        </p>
      </div>

      <!-- stats -->
      <div class="mt-14 grid grid-cols-2 border-l border-t border-zinc-800 md:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="border-b border-r border-zinc-800 p-5 md:p-7">
          <div class="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{{ s.id }}</div>
          <div class="mt-3 font-display text-5xl font-extrabold tracking-tighter md:text-6xl">
            <span class="stat-num tabular-nums" :data-to="s.value">0</span><span class="text-accent">{{ s.suffix }}</span>
          </div>
          <div class="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/60">{{ s.label }}</div>
        </div>
      </div>

      <div class="mt-10 grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <!-- schematic -->
        <div class="relative min-w-0 border border-zinc-800 bg-[#121214]/80">
          <div class="flex items-center justify-between border-b border-zinc-800 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            <span>system.schematic <span class="text-zinc-600 md:hidden">· swipe →</span></span>
            <span class="text-bone/80">{{ hovered ? hovered.label : 'all nodes' }}</span>
          </div>
          <div class="overflow-x-auto no-scrollbar">
            <svg ref="svg" viewBox="0 0 1000 600" class="block min-w-[720px] w-full" role="img"
              aria-label="Skills schematic: Zoho Creator, Deluge, Books, CRM and Desk connect through an Express API layer to Node.js, MySQL and Vue front-ends.">
              <!-- wires -->
              <g fill="none">
                <path v-for="(w, i) in wires" :key="'b' + i" :d="w.d" stroke="#27272a" stroke-width="1.5" />
                <path v-for="(w, i) in wires" :key="'w' + i" :d="w.d" :ref="(el) => (wireEls[i] = el)"
                  :class="['wire transition-[stroke,opacity] duration-300', isLit(w) ? 'lit' : hovered ? 'dim' : '']"
                  stroke-width="1.5" />
              </g>
              <!-- pulses -->
              <g>
                <circle v-for="(w, i) in wires" :key="'p' + i" :ref="(el) => (pulseEls[i] = el)" r="3.5" fill="#c6ff3d" class="pulse" opacity="0" />
              </g>
              <!-- nodes -->
              <g v-for="n in nodes" :key="n.id" :transform="`translate(${n.x} ${n.y})`">
                <g class="node" @mouseenter="hovered = n" @mouseleave="hovered = null" @focus="hovered = n" @blur="hovered = null" tabindex="0" :aria-label="n.label + ': ' + n.info" data-cursor="Trace">
                  <rect :x="-n.w / 2" y="-22" :width="n.w" height="44" :fill="hovered && hovered.id === n.id ? '#c6ff3d' : '#18181b'"
                    :stroke="n.hub ? '#c6ff3d' : '#3f3f46'" class="transition-[fill] duration-300" />
                  <circle :cx="-n.w / 2" cy="0" r="3.5" fill="#0a0a0b" stroke="#71717a" />
                  <circle :cx="n.w / 2" cy="0" r="3.5" fill="#0a0a0b" stroke="#71717a" />
                  <text text-anchor="middle" y="4.5" font-family="JetBrains Mono" font-size="13" font-weight="600" letter-spacing="1"
                    :fill="hovered && hovered.id === n.id ? '#0a0a0b' : '#ede8df'" class="pointer-events-none uppercase">{{ n.label }}</text>
                  <text text-anchor="middle" y="40" font-family="JetBrains Mono" font-size="9" letter-spacing="1.5" fill="#71717a" class="pointer-events-none">{{ n.tag }}</text>
                </g>
              </g>
            </svg>
          </div>
          <div class="min-h-[64px] border-t border-zinc-800 px-5 py-4 text-sm font-light text-bone/70">
            <span class="mr-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">&gt; info</span>
            {{ hovered ? hovered.info : 'Hover or tab through the nodes to inspect each capability.' }}
          </div>
        </div>

        <!-- live telemetry (from the Stitch concept) -->
        <div class="flex min-w-0 flex-col border border-zinc-800 bg-[#121214]/80">
          <div class="flex items-center justify-between border-b border-zinc-800 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em]">
            <span class="text-accent">Live telemetry stream</span>
            <span class="text-zinc-500">simulated feed</span>
          </div>
          <div class="flex flex-1 flex-col gap-3 p-4 md:p-5">
            <div v-for="(e, i) in endpoints" :key="e.path" :ref="(el) => (rowEls[i] = el)" class="border border-zinc-800 bg-[#18181b] p-4">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 font-mono text-[10px] font-bold" :style="{ background: e.color, color: '#0a0a0b' }">{{ e.method }}</span>
                <span class="truncate font-mono text-xs text-bone md:text-[13px]">{{ e.path }}</span>
                <span class="ml-auto shrink-0 font-mono text-[11px] text-accent">200 OK</span>
              </div>
              <div class="mt-2 font-mono text-[10px] text-zinc-500">
                latency: <span class="tabular-nums text-bone/80">{{ e.latency }}ms</span> · {{ e.note }}
              </div>
            </div>

            <div class="mt-auto border border-zinc-800 bg-[#18181b] p-4">
              <div class="flex justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                <span>throughput (req/s)</span><span class="tabular-nums text-bone">{{ throughput[throughput.length - 1] }}</span>
              </div>
              <svg viewBox="0 0 300 90" class="mt-3 w-full" aria-hidden="true">
                <line x1="0" y1="89" x2="300" y2="89" stroke="#27272a" />
                <polyline :points="sparkPoints" fill="none" stroke="#c6ff3d" stroke-width="2" stroke-linejoin="round" />
                <circle ref="sparkDot" :cx="300" :cy="sparkY(throughput[throughput.length - 1])" r="4" fill="#c6ff3d" />
              </svg>
              <div class="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                <span>t-60s</span><span>t-30s</span><span class="text-accent">now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import anime from 'animejs/lib/anime.es.js';
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from './motion';

const root = ref(null);
const svg = ref(null);
const heading = ref(null);
const sparkDot = ref(null);
const hovered = ref(null);
const wireEls = [];
const pulseEls = [];
const rowEls = [];

const stats = [
  { id: 'T_RUN', value: 3, suffix: '+', label: 'Years shipping' },
  { id: 'APPS', value: 12, suffix: '+', label: 'Custom apps' },
  { id: 'ENDPOINTS', value: 40, suffix: '+', label: 'REST endpoints' },
  { id: 'ZOHO', value: 5, suffix: '', label: 'Zoho apps integrated' }
];

const nodes = [
  { id: 'creator', label: 'Creator', tag: 'ZOHO / APPS', x: 140, y: 120, w: 150, info: 'Custom Zoho Creator apps: relational forms, portals, pages and reports that replace spreadsheets.' },
  { id: 'deluge', label: 'Deluge', tag: 'SCRIPTING', x: 390, y: 70, w: 140, info: 'Deluge workflows, schedules and custom functions that automate every hand-off.' },
  { id: 'books', label: 'Books', tag: 'ZOHO / FINANCE', x: 140, y: 300, w: 130, info: 'Zoho Books automation: invoices, contacts, taxes and order-to-invoice sync.' },
  { id: 'crm', label: 'CRM', tag: 'ZOHO / SALES', x: 390, y: 260, w: 120, info: 'Zoho CRM pipelines, Blueprints, lead scoring and round-robin assignment.' },
  { id: 'desk', label: 'Desk', tag: 'ZOHO / SUPPORT', x: 140, y: 480, w: 120, info: 'Zoho Desk SLAs and escalations, linked back to CRM accounts.' },
  { id: 'api', label: 'Express API', tag: 'INTEGRATION LAYER', x: 640, y: 300, w: 190, hub: true, info: 'The bridge: Express services, webhooks, auth and idempotent syncs between Zoho and custom systems.' },
  { id: 'node', label: 'Node.js', tag: 'RUNTIME', x: 640, y: 110, w: 140, info: 'Node.js services: background jobs, integrations and REST APIs.' },
  { id: 'mysql', label: 'MySQL', tag: 'DATA', x: 870, y: 300, w: 130, info: 'MySQL schema design, indexing, transactions and query optimisation.' },
  { id: 'vue', label: 'Vue / JS', tag: 'INTERFACE', x: 640, y: 490, w: 140, info: 'Responsive, accessible front-ends in Vue, JavaScript and modern CSS.' }
];
const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const links = [
  ['creator', 'deluge'], ['deluge', 'crm'], ['creator', 'books'], ['desk', 'crm'],
  ['crm', 'api'], ['books', 'api'], ['deluge', 'node'], ['node', 'api'], ['api', 'mysql'], ['api', 'vue'], ['node', 'mysql']
];
const wires = links.map(([a, b]) => {
  const A = byId[a];
  const B = byId[b];
  const x1 = A.x + A.w / 2;
  const x2 = B.x - B.w / 2;
  const fwd = x2 > x1;
  const sx = fwd ? x1 : A.x;
  const sy = fwd ? A.y : A.y + 22;
  const ex = fwd ? x2 : B.x;
  const ey = fwd ? B.y : B.y - 22;
  const d = fwd
    ? `M${sx} ${sy} C${(sx + ex) / 2} ${sy}, ${(sx + ex) / 2} ${ey}, ${ex} ${ey}`
    : `M${sx} ${sy} C${sx} ${(sy + ey) / 2}, ${ex} ${(sy + ey) / 2}, ${ex} ${ey}`;
  return { a, b, d };
});
const isLit = (w) => hovered.value && (w.a === hovered.value.id || w.b === hovered.value.id);

/* ---------- simulated telemetry ---------- */
const endpoints = ref([
  { method: 'POST', path: '/api/v1/crm/lead-pipeline', latency: 38, note: 'webhook · idempotent', color: '#c6ff3d' },
  { method: 'GET', path: '/api/v1/books/invoices', latency: 19, note: 'cached', color: '#7aa2ff' },
  { method: 'SYNC', path: '/deluge/creator→books', latency: 88, note: '412 records', color: '#ff5b2e' }
]);
const throughput = ref(Array.from({ length: 20 }, (_, i) => 40 + Math.round(Math.sin(i / 2) * 12 + i * 1.5)));
const sparkY = (v) => 86 - ((v - 20) / 80) * 80;
const sparkPoints = computed(() =>
  throughput.value.map((v, i) => `${(i / (throughput.value.length - 1)) * 300},${sparkY(v)}`).join(' ')
);

let feedTimer = 0;
const runFeed = () => {
  feedTimer = window.setInterval(() => {
    const last = throughput.value[throughput.value.length - 1];
    const next = Math.max(24, Math.min(98, last + Math.round((Math.random() - 0.45) * 14)));
    throughput.value = [...throughput.value.slice(1), next];
    const i = Math.floor(Math.random() * endpoints.value.length);
    const e = endpoints.value[i];
    e.latency = Math.max(8, Math.round(e.latency * (0.8 + Math.random() * 0.4)));
    // WAAPI flash on the updated row + dot ping
    rowEls[i]?.animate(
      [{ borderColor: '#c6ff3d', backgroundColor: 'rgba(198,255,61,0.06)' }, { borderColor: '#27272a', backgroundColor: '#18181b' }],
      { duration: 900, easing: 'ease-out' }
    );
    sparkDot.value?.animate([{ r: 9, opacity: 0.4 }, { r: 4, opacity: 1 }], { duration: 600, easing: 'ease-out' });
  }, 1400);
};

/* ---------- anime.js schematic ---------- */
let pulseAnims = [];
let ctx;
let started = false;

const startSchematic = () => {
  if (started) return;
  started = true;
  const nodeEls = svg.value.querySelectorAll('.node');
  const counters = [...root.value.querySelectorAll('.stat-num')].map((el) => ({ el, v: 0, to: +el.dataset.to }));
  anime.timeline({ easing: 'easeInOutSine' })
    .add({ targets: nodeEls, opacity: [0, 1], translateY: [14, 0], duration: 600, delay: anime.stagger(70, { from: 'center' }), easing: 'easeOutExpo' })
    .add({ targets: wireEls, strokeDashoffset: [anime.setDashoffset, 0], duration: 1100, delay: anime.stagger(90) }, 250)
    .add({
      targets: counters,
      v: (c) => c.to,
      round: 1,
      duration: 1600,
      easing: 'easeOutExpo',
      update: () => counters.forEach((c) => (c.el.textContent = c.v))
    }, 0)
    .finished.then(() => {
      // data packets travelling along every wire
      pulseAnims = wires.map((_, i) => {
        const path = anime.path(wireEls[i]);
        return anime({
          targets: pulseEls[i],
          translateX: path('x'),
          translateY: path('y'),
          opacity: [{ value: 1, duration: 150 }, { value: 1, duration: 1500 }, { value: 0, duration: 250 }],
          duration: 1900 + (i % 4) * 400,
          delay: i * 260,
          endDelay: 600 + (i % 3) * 500,
          easing: 'easeInOutSine',
          loop: true
        });
      });
    });
};

onMounted(async () => {
  if (prefersReducedMotion()) {
    root.value.querySelectorAll('.stat-num').forEach((el) => (el.textContent = el.dataset.to));
    return;
  }
  await document.fonts?.ready;
  if (!root.value) return;
  svg.value.querySelectorAll('.node').forEach((n) => (n.style.opacity = 0));
  ctx = gsap.context(() => {
    const split = new SplitText(heading.value, { type: 'lines,words', mask: 'lines' });
    gsap.from(split.words, {
      yPercent: 110, duration: 1.1, stagger: 0.05, ease: 'expo.out',
      scrollTrigger: { trigger: heading.value, start: 'top 82%' }
    });
    ScrollTrigger.create({ trigger: svg.value, start: 'top 80%', once: true, onEnter: startSchematic });
    ScrollTrigger.create({
      trigger: root.value, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { clearInterval(feedTimer); if (self.isActive) runFeed(); }
    });
  }, root.value);
});

onBeforeUnmount(() => {
  clearInterval(feedTimer);
  pulseAnims.forEach((a) => a.pause());
  ctx?.revert();
});
</script>

<style scoped>
.wire { stroke: #52525b; }
.wire.lit { stroke: #c6ff3d; }
.wire.dim { opacity: 0.25; }
.node { cursor: pointer; outline: none; }
.node:focus-visible rect { stroke: #c6ff3d; stroke-width: 2; }
</style>
