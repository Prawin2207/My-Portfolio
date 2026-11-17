<template>
  <section id="log" ref="root" class="relative border-t border-zinc-800 bg-ink py-24 md:py-32">
    <div class="relative mx-auto grid max-w-[1600px] gap-12 px-5 md:px-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20 [&>*]:min-w-0">
      <!-- left: about -->
      <div class="lg:sticky lg:top-28 lg:self-start">
        <div class="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
          <span class="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_rgba(198,255,61,0.8)]"></span>
          NODE_04 // LOG
        </div>
        <h2 class="mt-5 font-display text-[clamp(2.6rem,5.5vw,5.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.04em]">
          Execution<br /><span class="text-outline">history</span>
        </h2>
        <p ref="aboutEl" class="mt-8 max-w-[46ch] text-lg font-light leading-relaxed text-bone/45">{{ about }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a :href="resumeUrl" target="_blank" rel="noopener noreferrer" data-cursor="Open"
            class="bg-accent px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-shadow hover:shadow-[0_0_24px_rgba(198,255,61,0.5)]">
            Resume ↗
          </a>
          <a :href="linkedin" target="_blank" rel="noopener noreferrer"
            class="border border-zinc-700 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-bone transition-colors hover:border-accent hover:text-accent">
            LinkedIn ↗
          </a>
        </div>
      </div>

      <!-- right: terminal -->
      <div ref="term" class="terminal relative border border-zinc-800 bg-[#0c0c0e]">
        <div class="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-[#febc2e]"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]"></span>
          <span class="ml-3 font-mono text-[11px] text-zinc-500">prawin@pipeline: ~/career — zsh</span>
        </div>
        <div class="relative min-h-[520px] p-5 font-mono text-[12.5px] leading-[1.75] md:p-7 md:text-[13px]" aria-live="off">
          <!-- full text for screen readers -->
          <div class="sr-only">
            <div v-for="(l, i) in lines" :key="'sr' + i">{{ l.text }}</div>
          </div>
          <div aria-hidden="true">
            <div v-for="(l, i) in lines" :key="i" :class="['whitespace-pre-wrap break-words', l.cls]">{{ shown[i] || '' }}<span v-if="i === cursorLine" class="caret">▋</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

const props = defineProps({
  about: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  linkedin: { type: String, required: true }
});

const career = [
  { date: '2023 — PRESENT', title: 'Software Developer (Full-Stack & Zoho)', org: 'Enterprise Solutions',
    bullets: ['Built web apps end-to-end: JavaScript UIs → Node.js/Express → MySQL', 'Custom Zoho Creator apps streamlining CRM, Books & Desk operations', 'Unit tests, documentation and code reviews for stable deploys', 'Fixed production bugs, optimised queries, refactored for performance'] },
  { date: '2021 — 2023', title: 'Full-Stack Web Developer', org: 'Freelance / Web Projects',
    bullets: ['Secure REST APIs with Express & Node connected to relational databases', 'Responsive semantic HTML5 / CSS / JS interfaces'] },
  { date: '2023', title: 'Video Editing Basics Certification', org: 'Great Learning Academy',
    bullets: ['Composition, timelines, rendering formats'] },
  { date: 'JAN 2023', title: 'B.Sc. Computer Science — GPA 8.0/10', org: 'HCAS College',
    bullets: ['Led project teams as technical lead & workload coordinator'] }
];

const lines = [
  { text: '$ ./run --pipeline career --verbose', cls: 'text-bone' },
  { text: '[boot] loading execution history… 4 jobs found', cls: 'text-zinc-500' },
  { text: '', cls: '' }
];
career.forEach((c) => {
  lines.push({ text: `✓ [${c.date}] ${c.title}`, cls: 'text-accent' });
  lines.push({ text: `  @ ${c.org}`, cls: 'text-bone/70' });
  c.bullets.forEach((b) => lines.push({ text: `  → ${b}`, cls: 'text-zinc-400' }));
  lines.push({ text: '', cls: '' });
});
lines.push({ text: '[done] exit 0 — status: AVAILABLE FOR NEW WORK', cls: 'text-signal' });
lines.push({ text: '$ ', cls: 'text-bone' });

const root = ref(null);
const term = ref(null);
const aboutEl = ref(null);
const shown = ref([]);
const cursorLine = ref(0);
let typingTimer = 0;
let ctx;
let caretAnim;

const typeAll = () => {
  let li = 0;
  let ci = 0;
  const step = () => {
    if (li >= lines.length) return;
    const full = lines[li].text;
    // type ~3 chars per tick for speed; blank/short lines appear instantly
    ci = Math.min(full.length, ci + 3);
    shown.value[li] = full.slice(0, ci);
    cursorLine.value = li;
    if (ci >= full.length) { li++; ci = 0; typingTimer = window.setTimeout(step, full.startsWith('✓') ? 160 : 40); }
    else typingTimer = window.setTimeout(step, 14);
  };
  step();
};

onMounted(async () => {
  if (prefersReducedMotion()) {
    shown.value = lines.map((l) => l.text);
    cursorLine.value = lines.length - 1;
    return;
  }
  ctx = gsap.context(() => {
    // about paragraph: brighten word by word while scrolling
    const words = props.about.split(' ');
    aboutEl.value.textContent = '';
    words.forEach((w) => {
      const s = document.createElement('span');
      s.textContent = w + ' ';
      aboutEl.value.appendChild(s);
    });
    gsap.to(aboutEl.value.children, {
      color: '#ede8df', stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: aboutEl.value, start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
    gsap.from(term.value, { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: term.value, start: 'top 85%' } });
    ScrollTrigger.create({ trigger: term.value, start: 'top 65%', once: true, onEnter: typeAll });
  }, root.value);

  blinkCaret();
});

// WAAPI caret blink - re-attached whenever the caret moves to a new line
const blinkCaret = async () => {
  await nextTick();
  const c = root.value?.querySelector('.caret');
  if (!c || c.dataset.blinking) return;
  c.dataset.blinking = '1';
  caretAnim?.cancel();
  caretAnim = c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 530, iterations: Infinity, direction: 'alternate', easing: 'steps(1, end)' });
};
watch(cursorLine, blinkCaret);

onBeforeUnmount(() => {
  clearTimeout(typingTimer);
  caretAnim?.cancel();
  ctx?.revert();
});
</script>

<style scoped>
.terminal::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(rgba(18, 18, 20, 0) 50%, rgba(0, 0, 0, 0.22) 50%);
  background-size: 100% 4px;
}
.caret { color: #c6ff3d; margin-left: 1px; }
</style>
