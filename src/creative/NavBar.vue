<template>
  <header ref="root" class="fixed inset-x-0 top-0 z-[120]">
    <div class="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 md:px-12">
      <a href="#input" class="group flex items-baseline font-display text-xl font-extrabold tracking-tight text-bone" aria-label="Back to top">
        PK<span class="text-accent transition-transform duration-300 group-hover:translate-x-1">/</span>
      </a>

      <nav class="hidden items-center border border-zinc-800 bg-ink/70 backdrop-blur-md md:flex" aria-label="Primary">
        <a v-for="l in links" :key="l.href" :href="l.href"
          :class="['nav-link relative px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
            active === l.href.slice(1) ? 'text-accent' : 'text-bone/70 hover:text-bone']">
          <span class="text-zinc-600">{{ l.n }}</span> {{ l.label }}
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <a ref="hire" href="#contact" data-cursor="Hire"
          class="hire hidden bg-accent px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-shadow hover:shadow-[0_0_24px_rgba(198,255,61,0.55)] sm:inline-block">
          Hire me →
        </a>
        <button type="button" class="grid h-10 w-10 place-items-center border border-zinc-700 md:hidden"
          :aria-expanded="open" aria-controls="mobile-menu" aria-label="Toggle menu" @click="toggle">
          <span class="relative block h-3 w-5">
            <span :class="['absolute left-0 top-0 h-px w-5 bg-bone transition-transform duration-300', open && 'translate-y-1.5 rotate-45']"></span>
            <span :class="['absolute bottom-0 left-0 h-px w-5 bg-bone transition-transform duration-300', open && '-translate-y-1.5 -rotate-45']"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="open" id="mobile-menu" ref="menu" class="fixed inset-0 -z-10 flex flex-col justify-end bg-ink px-5 pb-12 md:hidden">
      <div class="schematic-grid absolute inset-0 opacity-50"></div>
      <a v-for="l in links" :key="l.href" :href="l.href" @click="toggle"
        class="m-link relative border-b border-zinc-800 py-4 font-display text-[11vw] font-extrabold uppercase leading-none tracking-tight text-bone">
        <span class="mr-3 align-top font-mono text-xs text-accent">{{ l.n }}</span>{{ l.label }}
      </a>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap, ScrollTrigger, isFinePointer } from './motion';

const links = [
  { href: '#work', label: 'Work', n: '02' },
  { href: '#capabilities', label: 'Stack', n: '03' },
  { href: '#log', label: 'Log', n: '04' },
  { href: '#contact', label: 'Contact', n: '05' }
];

const root = ref(null);
const hire = ref(null);
const menu = ref(null);
const open = ref(false);
const active = ref('input');
let triggers = [];
let lastY = 0;
let onScroll;

const toggle = async () => {
  open.value = !open.value;
  document.body.style.overflow = open.value ? 'hidden' : '';
  if (open.value) {
    await nextTick();
    gsap.fromTo(menu.value.querySelectorAll('.m-link'),
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out' });
  }
};

// Magnetic "Hire me" button
const onMagnet = (e) => {
  const r = hire.value.getBoundingClientRect();
  gsap.to(hire.value, { x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.5, duration: 0.4, ease: 'power3.out' });
};
const offMagnet = () => gsap.to(hire.value, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });

onMounted(() => {
  ['input', 'work', 'capabilities', 'log', 'contact'].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    triggers.push(ScrollTrigger.create({
      trigger: el, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => self.isActive && (active.value = id)
    }));
  });

  // Hide on scroll down, reveal on scroll up
  onScroll = () => {
    const y = window.scrollY;
    if (!open.value) {
      gsap.to(root.value, { yPercent: y > lastY && y > 200 ? -110 : 0, duration: 0.45, ease: 'power3.out', overwrite: true });
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (isFinePointer() && hire.value) {
    hire.value.addEventListener('pointermove', onMagnet);
    hire.value.addEventListener('pointerleave', offMagnet);
  }
});

onBeforeUnmount(() => {
  triggers.forEach((t) => t.kill());
  window.removeEventListener('scroll', onScroll);
  hire.value?.removeEventListener('pointermove', onMagnet);
  hire.value?.removeEventListener('pointerleave', offMagnet);
  document.body.style.overflow = '';
});
</script>
