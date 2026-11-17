<template>
  <div ref="root" class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink text-bone" aria-hidden="true">
    <div class="schematic-grid absolute inset-0 opacity-60"></div>

    <svg class="relative w-[min(560px,86vw)]" viewBox="0 0 560 120" fill="none">
      <path class="pl-wire" d="M30 60 H140 M170 60 C210 60 210 25 250 25 H310 C350 25 350 60 390 60 H530"
        stroke="#3f3f46" stroke-width="1.5" />
      <path class="pl-wire pl-live" d="M30 60 H140 M170 60 C210 60 210 25 250 25 H310 C350 25 350 60 390 60 H530"
        stroke="#c6ff3d" stroke-width="1.5" />
      <g v-for="(n, i) in nodes" :key="i" :transform="`translate(${n.x} ${n.y})`">
        <g class="pl-node">
          <circle r="7" fill="#0a0a0b" stroke="#c6ff3d" stroke-width="1.5" />
          <circle r="2.5" fill="#c6ff3d" />
          <text y="26" text-anchor="middle" fill="#71717a" font-family="JetBrains Mono" font-size="9" letter-spacing="1.2">{{ n.label }}</text>
        </g>
      </g>
    </svg>

    <div class="relative mt-10 flex items-end gap-6">
      <span ref="counter" class="font-display text-7xl font-extrabold leading-none tracking-tighter tabular-nums md:text-8xl">000</span>
      <span class="mb-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-bone-dim">
        Booting<br />pipeline<span class="text-accent">_</span>
      </span>
    </div>

    <div class="absolute bottom-8 left-6 right-6 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 md:left-12 md:right-12">
      <span>+11.1271° N  +78.6569° E</span>
      <span ref="status">init()</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import anime from 'animejs/lib/anime.es.js';
import { gsap, prefersReducedMotion } from './motion';

const emit = defineEmits(['done']);
const root = ref(null);
const counter = ref(null);
const status = ref(null);

const nodes = [
  { x: 30, y: 60, label: 'INPUT' },
  { x: 155, y: 60, label: 'AUTH' },
  { x: 280, y: 25, label: 'DELUGE' },
  { x: 390, y: 60, label: 'SYNC' },
  { x: 530, y: 60, label: 'OUTPUT' }
];
const steps = ['init()', 'load.modules', 'connect.zoho', 'compile.shaders', 'ready ✓'];

let tl;
let failsafe = 0;

onMounted(() => {
  if (prefersReducedMotion()) {
    emit('done');
    return;
  }
  const count = { v: 0 };
  let finished = false;
  const exit = () => {
    if (finished) return;
    finished = true;
    clearTimeout(failsafe);
    gsap.timeline({ onComplete: () => emit('done') })
      .to(root.value.children, { opacity: 0, y: -30, duration: 0.45, stagger: 0.04, ease: 'power2.in' })
      .to(root.value, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, '-=0.15');
  };
  // never trap the visitor behind the loader
  failsafe = window.setTimeout(() => { finished = true; emit('done'); }, 6000);
  tl = anime.timeline({ easing: 'easeInOutQuart', complete: exit });
  tl.add({
    targets: root.value.querySelectorAll('.pl-wire'),
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 1300,
    delay: anime.stagger(250)
  })
    .add({
      targets: root.value.querySelectorAll('.pl-node'),
      scale: [0, 1],
      opacity: [0, 1],
      duration: 500,
      easing: 'easeOutBack',
      delay: anime.stagger(140)
    }, 150)
    .add({
      targets: count,
      v: 100,
      round: 1,
      duration: 1700,
      easing: 'easeInOutCubic',
      update: () => {
        counter.value.textContent = String(count.v).padStart(3, '0');
        status.value.textContent = steps[Math.min(steps.length - 1, Math.floor(count.v / 21))];
      }
    }, 0);
});

onBeforeUnmount(() => { tl?.pause(); clearTimeout(failsafe); });
</script>

<style scoped>
.pl-node { opacity: 0; transform-box: fill-box; transform-origin: center; }
</style>
