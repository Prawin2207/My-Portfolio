<template>
  <!-- Fixed pipeline rail: shows where the visitor is in INPUT → OUTPUT -->
  <aside class="pointer-events-none fixed left-4 top-1/2 z-[110] hidden -translate-y-1/2 lg:block" aria-hidden="true">
    <div class="relative flex flex-col gap-9">
      <span class="absolute left-[3.5px] top-1 bottom-1 w-px bg-zinc-800"></span>
      <span ref="fill" class="absolute left-[3.5px] top-1 w-px origin-top bg-accent" style="height: calc(100% - 8px); transform: scaleY(0)"></span>
      <div v-for="(n, i) in nodes" :key="n.id" class="relative flex items-center gap-3">
        <span :class="['relative z-[1] h-2 w-2 rounded-full border transition-all duration-500',
          activeIndex >= i ? 'border-accent bg-accent shadow-[0_0_10px_rgba(198,255,61,0.8)]' : 'border-zinc-600 bg-ink']"></span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { gsap, ScrollTrigger } from './motion';

const nodes = [
  { id: 'input', label: '01 Input' },
  { id: 'work', label: '02 Process' },
  { id: 'capabilities', label: '03 Stack' },
  { id: 'log', label: '04 Log' },
  { id: 'contact', label: '05 Output' }
];
const fill = ref(null);
const activeIndex = ref(0);
let triggers = [];

onMounted(() => {
  triggers.push(ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => gsap.set(fill.value, { scaleY: self.progress })
  }));
  nodes.forEach((n, i) => {
    const el = document.getElementById(n.id);
    if (!el) return;
    triggers.push(ScrollTrigger.create({
      trigger: el, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => self.isActive && (activeIndex.value = i)
    }));
  });
});
onBeforeUnmount(() => triggers.forEach((t) => t.kill()));
</script>
