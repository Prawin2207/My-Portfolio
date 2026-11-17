<template>
  <div v-if="enabled" aria-hidden="true" class="pointer-events-none fixed inset-0 z-[150]">
    <div ref="ring" class="cursor-ring">
      <span ref="labelEl" class="cursor-label">{{ label }}</span>
    </div>
    <div ref="dot" class="cursor-dot"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { isFinePointer, prefersReducedMotion } from './motion';

// Custom cursor driven entirely by the native Web Animations API (WAAPI).
// Elements can opt in with data-cursor="LABEL" to morph the ring into a labelled lens.
const enabled = ref(false);
const ring = ref(null);
const dot = ref(null);
const labelEl = ref(null);
const label = ref('');

let current = null;
let state = 'idle';

const onMove = (e) => {
  const t = `translate(${e.clientX}px, ${e.clientY}px)`;
  dot.value.style.transform = t;
  // WAAPI: each move creates a short trailing animation; fill keeps the final frame.
  ring.value.animate({ transform: t }, { duration: 550, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' });
};

const setState = (next, text = '') => {
  if (state === next && label.value === text) return;
  state = next;
  label.value = text;
  const size = next === 'label' ? 88 : next === 'link' ? 56 : 34;
  ring.value.animate(
    {
      width: size + 'px',
      height: size + 'px',
      margin: `${-size / 2}px 0 0 ${-size / 2}px`,
      backgroundColor: next === 'label' ? '#c6ff3d' : 'rgba(198,255,61,0)',
      borderColor: next === 'idle' ? 'rgba(237,232,223,.45)' : '#c6ff3d'
    },
    { duration: 380, fill: 'forwards', easing: 'cubic-bezier(.2,.8,.2,1)' }
  );
  labelEl.value.animate(
    [{ opacity: next === 'label' ? 0 : 1, transform: 'scale(.6)' }, { opacity: next === 'label' ? 1 : 0, transform: 'scale(1)' }],
    { duration: 300, fill: 'forwards', easing: 'ease-out' }
  );
};

const onOver = (e) => {
  const target = e.target.closest('[data-cursor], a, button, [role="button"]');
  if (target === current) return;
  current = target;
  if (!target) return setState('idle');
  const text = target.getAttribute('data-cursor');
  text ? setState('label', text) : setState('link');
};

const onDown = () => dot.value.animate([{ scale: 1 }, { scale: 2.6 }, { scale: 1 }], { duration: 400, easing: 'ease-out' });
const onLeaveWindow = () => ring.value.animate({ opacity: 0 }, { duration: 200, fill: 'forwards' });
const onEnterWindow = () => ring.value.animate({ opacity: 1 }, { duration: 200, fill: 'forwards' });

onMounted(async () => {
  if (!isFinePointer() || prefersReducedMotion()) return;
  enabled.value = true;
  await nextTick();
  document.documentElement.classList.add('has-cursor');
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerover', onOver, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('mouseleave', onLeaveWindow);
  document.addEventListener('mouseenter', onEnterWindow);
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove('has-cursor');
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerover', onOver);
  window.removeEventListener('pointerdown', onDown);
  document.removeEventListener('mouseleave', onLeaveWindow);
  document.removeEventListener('mouseenter', onEnterWindow);
});
</script>

<style scoped>
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  will-change: transform;
}
.cursor-dot {
  width: 6px;
  height: 6px;
  margin: -3px 0 0 -3px;
  border-radius: 9999px;
  background: #c6ff3d;
  mix-blend-mode: difference;
}
.cursor-ring {
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  border-radius: 9999px;
  border: 1px solid rgba(237, 232, 223, 0.45);
  display: grid;
  place-items: center;
}
.cursor-label {
  opacity: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #0a0a0b;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
