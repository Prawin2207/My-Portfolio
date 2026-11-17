<template>
  <section id="work" ref="root" class="relative overflow-hidden bg-ink">
    <div ref="pin" class="relative lg:h-screen">
      <!-- top telemetry -->
      <div class="relative z-10 mx-auto flex max-w-[1600px] items-center justify-between px-5 pt-24 md:px-12 lg:absolute lg:inset-x-0 lg:top-0">
        <div class="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
          <span class="h-[7px] w-[7px] rounded-full bg-signal shadow-[0_0_12px_rgba(255,91,46,0.8)]"></span>
          NODE_02 // PROCESS
        </div>
        <div class="hidden items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 lg:flex">
          <span class="tabular-nums text-bone">{{ String(current).padStart(2, '0') }}</span>
          <span class="relative block h-px w-40 bg-zinc-800">
            <span ref="progress" class="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-accent"></span>
          </span>
          <span class="tabular-nums">{{ String(projects.length).padStart(2, '0') }}</span>
        </div>
      </div>

      <div ref="track" class="relative flex flex-col gap-16 px-5 pb-24 pt-10 md:px-12 lg:h-full lg:flex-row lg:items-center lg:gap-[6vw] lg:px-[8vw] lg:py-0 lg:will-change-transform">
        <!-- connector bus behind the panels -->
        <span class="pointer-events-none absolute left-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent lg:block" :style="{ width: '100%' }"></span>

        <!-- Intro block -->
        <div class="intro relative shrink-0 lg:w-[36vw]">
          <h2 class="font-display text-[clamp(2.2rem,9vw,5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] lg:text-[4.4vw]">
            Selected<br /><span class="text-outline">work</span><span class="text-accent">.</span>
          </h2>
          <p class="mt-6 max-w-[38ch] text-sm font-light leading-relaxed text-bone/65 md:text-base">
            Four systems I designed, wired and shipped — from Deluge automations to Node.js services. Drag through the pipeline; open any node to run its case study.
          </p>
          <div class="mt-8 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 lg:flex">
            <span class="relative block h-px w-12 overflow-hidden bg-zinc-700"><span class="hint absolute inset-y-0 left-0 w-4 bg-accent"></span></span>
            Scroll →
          </div>
        </div>

        <!-- Project panels -->
        <article v-for="(p, i) in projects" :key="p.slug" class="panel relative shrink-0 lg:w-[min(62vw,980px)]" style="perspective: 1400px">
          <a :href="'#work/' + p.slug" @click.prevent="openStudy(i)" data-cursor="Run ↗"
            class="tilt group relative block border border-zinc-800 bg-[#121214] transition-colors duration-500 hover:border-zinc-600"
            :aria-label="'Open case study: ' + p.title">
            <!-- crosshair corners -->
            <span v-for="c in corners" :key="c" :class="['cross', c]" aria-hidden="true"></span>

            <!-- registration header -->
            <div class="flex items-center justify-between border-b border-zinc-800 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500 md:px-5">
              <span>NODE_02.{{ i + 1 }} // 0x{{ (79 + i * 13).toString(16).toUpperCase() }}</span>
              <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-accent"></span>{{ p.year }}</span>
            </div>

            <div class="grid gap-0 md:grid-cols-[1.35fr_1fr]">
              <!-- visual -->
              <div class="relative aspect-[16/11] overflow-hidden border-b border-zinc-800 md:aspect-auto md:min-h-[46vh] md:border-b-0 md:border-r">
                <div :class="['absolute inset-0 bg-gradient-to-br opacity-90', p.gradient]"></div>
                <div class="schematic-grid absolute inset-0 opacity-40"></div>
                <div class="parallax absolute inset-[-8%] flex items-center justify-center p-[12%]">
                  <CrmMockup v-if="p.mockupType === 'crm'" class="w-full" />
                  <img v-else :src="p.imageUrl" :alt="p.title" loading="lazy"
                    class="w-full border border-white/15 object-cover shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]" />
                </div>
              </div>

              <!-- meta -->
              <div class="flex flex-col justify-between gap-8 p-5 md:p-7">
                <div>
                  <div class="font-display text-6xl font-extrabold leading-none tracking-tighter text-zinc-800 transition-colors duration-500 group-hover:text-accent md:text-7xl">
                    {{ String(i + 1).padStart(2, '0') }}
                  </div>
                  <h3 class="mt-4 text-balance break-words font-display text-xl font-bold uppercase leading-tight tracking-tight xl:text-2xl">{{ p.title }}</h3>
                  <p class="mt-3 text-sm font-light leading-relaxed text-bone/60">{{ p.description }}</p>
                </div>
                <div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="t in p.tags" :key="t" class="border border-zinc-800 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone/70">{{ t }}</span>
                  </div>
                  <span class="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                    [ RUN_CASE_STUDY <span class="transition-transform duration-300 group-hover:translate-x-1.5">→</span> ]
                  </span>
                </div>
              </div>
            </div>
          </a>
        </article>

        <div class="hidden shrink-0 lg:block lg:w-[4vw]"></div>
      </div>
    </div>

    <CaseStudyModal
      :project="activeIndex === null ? null : projects[activeIndex]"
      :index="activeIndex ?? 0"
      :total="projects.length"
      :nextTitle="activeIndex === null ? '' : projects[(activeIndex + 1) % projects.length].title"
      @close="closeStudy"
      @next="step(1)"
      @prev="step(-1)"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { gsap, ScrollTrigger, prefersReducedMotion, isFinePointer } from './motion';
import CaseStudyModal from '../components/CaseStudyModal.vue';
import CrmMockup from '../components/CrmMockup.vue';

const props = defineProps({ projects: { type: Array, required: true } });

const corners = ['tl', 'tr', 'bl', 'br'];
const root = ref(null);
const pin = ref(null);
const track = ref(null);
const progress = ref(null);
const current = ref(1);
const activeIndex = ref(null);
let mm;
let tiltCleanups = [];

/* ---------- case-study routing (#work/<slug>) ---------- */
const setHash = (h) => history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
const openStudy = (i) => { activeIndex.value = i; setHash('work/' + props.projects[i].slug); };
const closeStudy = () => { activeIndex.value = null; setHash('work'); };
const step = (d) => { const n = props.projects.length; openStudy((activeIndex.value + d + n) % n); };
const syncFromHash = () => {
  const m = location.hash.match(/^#work\/([a-z0-9-]+)$/);
  const i = m ? props.projects.findIndex((p) => p.slug === m[1]) : -1;
  activeIndex.value = i >= 0 ? i : null;
};

/* ---------- 3D pointer tilt ---------- */
const bindTilt = (el) => {
  const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
  const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
  const move = (e) => {
    const r = el.getBoundingClientRect();
    rx(((e.clientY - r.top) / r.height - 0.5) * -6);
    ry(((e.clientX - r.left) / r.width - 0.5) * 8);
  };
  const leave = () => { rx(0); ry(0); };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  tiltCleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
};

onMounted(() => {
  syncFromHash();
  window.addEventListener('hashchange', syncFromHash);
  if (prefersReducedMotion()) return;

  if (isFinePointer()) root.value.querySelectorAll('.tilt').forEach(bindTilt);

  mm = gsap.matchMedia();

  // Desktop: pinned horizontal pipeline
  mm.add('(min-width: 1024px)', () => {
    const distance = () => track.value.scrollWidth - window.innerWidth;
    const scrollTween = gsap.to(track.value, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin.value,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => '+=' + distance(),
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(progress.value, { scaleX: self.progress });
          current.value = Math.min(props.projects.length, Math.max(1, Math.ceil(self.progress * props.projects.length + 0.001)));
        }
      }
    });

    gsap.utils.toArray('.panel', track.value).forEach((panel) => {
      // panels swing in like cards being dealt
      gsap.fromTo(panel,
        { rotationY: -18, rotationZ: 2, opacity: 0.35, scale: 0.92, transformPerspective: 1600 },
        { rotationY: 0, rotationZ: 0, opacity: 1, scale: 1, ease: 'power2.out',
          scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left 95%', end: 'left 45%', scrub: true } });
      // inner image parallax
      gsap.fromTo(panel.querySelector('.parallax'), { xPercent: 6 }, { xPercent: -6, ease: 'none',
        scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true } });
    });

    gsap.from(track.value.querySelectorAll('.intro > *'), {
      y: 60, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: root.value, start: 'top 70%' }
    });
  });

  // Mobile / tablet: vertical reveals
  mm.add('(max-width: 1023px)', () => {
    gsap.utils.toArray('.panel, .intro', track.value).forEach((el) => {
      gsap.from(el, { y: 70, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncFromHash);
  tiltCleanups.forEach((f) => f());
  mm?.revert();
});
</script>

<style scoped>
.cross {
  position: absolute;
  width: 11px;
  height: 11px;
  z-index: 2;
  pointer-events: none;
}
.cross::before,
.cross::after {
  content: '';
  position: absolute;
  background: #71717a;
}
.cross::before { left: 5px; top: 0; width: 1px; height: 11px; }
.cross::after { top: 5px; left: 0; height: 1px; width: 11px; }
.cross.tl { left: -6px; top: -6px; }
.cross.tr { right: -6px; top: -6px; }
.cross.bl { left: -6px; bottom: -6px; }
.cross.br { right: -6px; bottom: -6px; }

.tilt { transform-style: preserve-3d; will-change: transform; }

.hint { animation: hint 1.6s cubic-bezier(.6,0,.4,1) infinite; }
@keyframes hint {
  from { transform: translateX(-100%); }
  to { transform: translateX(300%); }
}
</style>
