<template>
  <div ref="root" class="relative overflow-hidden border-y border-zinc-800 bg-ink py-5 md:py-7" aria-label="Technologies">
    <div v-for="(row, r) in rows" :key="r" :class="['flex whitespace-nowrap', r === 1 && 'mt-3 md:mt-4']">
      <div class="track flex shrink-0 items-center will-change-transform">
        <template v-for="copy in 2" :key="copy">
          <span v-for="t in row" :key="copy + t"
            :class="['flex items-center gap-8 pr-8 font-display font-extrabold uppercase tracking-tight md:gap-12 md:pr-12',
              r === 0 ? 'text-4xl text-bone md:text-7xl' : 'text-3xl text-outline md:text-6xl']">
            {{ t }} <span :class="r === 0 ? 'text-accent' : 'text-signal'" class="text-2xl md:text-4xl" aria-hidden="true">◆</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

const rows = [
  ['Zoho Creator', 'Deluge', 'Node.js', 'Zoho CRM', 'MySQL', 'Express', 'Zoho Books'],
  ['REST APIs', 'Zoho Desk', 'JavaScript', 'Vue', 'Webhooks', 'Automation', 'Blueprints']
];

const root = ref(null);
let ctx;
let tickFn;

onMounted(() => {
  if (prefersReducedMotion()) return;
  ctx = gsap.context(() => {
    const tracks = gsap.utils.toArray('.track', root.value);
    const state = tracks.map((el, i) => ({ el, x: 0, dir: i === 0 ? -1 : 1, width: el.scrollWidth / 2 }));
    let boost = 0;
    const skewTo = gsap.quickTo(tracks, 'skewX', { duration: 0.5, ease: 'power3.out' });

    let settled = true;
    tickFn = (time, delta) => {
      state.forEach((s) => {
        s.x += s.dir * (0.045 + boost) * delta;
        if (s.x <= -s.width) s.x += s.width;
        if (s.x >= 0 && s.dir > 0) s.x -= s.width;
        gsap.set(s.el, { x: s.x });
      });
      boost *= 0.92;
      // ease the skew back once scrolling stops
      if (boost < 0.01 && !settled) { skewTo(0); settled = true; }
      else if (boost >= 0.01) settled = false;
    };
    // start the right-moving row offset so it doesn't jump
    state[1].x = -state[1].width;
    gsap.ticker.add(tickFn);

    ScrollTrigger.create({
      trigger: root.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        boost = Math.min(Math.abs(v) / 4000, 0.6);
        skewTo(gsap.utils.clamp(-12, 12, v / -300));
      },
      onLeave: () => skewTo(0),
      onLeaveBack: () => skewTo(0)
    });
  }, root.value);
});

onBeforeUnmount(() => {
  if (tickFn) gsap.ticker.remove(tickFn);
  ctx?.revert();
});
</script>
