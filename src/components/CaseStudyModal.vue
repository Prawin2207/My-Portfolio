<template>
  <Teleport to="body">
    <Transition name="cs">
      <div
        v-if="project && study"
        class="fixed inset-0 z-[100] flex justify-center bg-black/70 backdrop-blur-sm"
        @click.self="$emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-label="project.title + ' case study'"
      >
        <div
          ref="panelRef"
          class="cs-panel relative h-full w-full max-w-[1200px] overflow-y-auto bg-ink text-white shadow-2xl md:my-6 md:h-[calc(100%-3rem)] md:rounded-3xl md:border md:border-white/10"
        >
          <!-- Sticky top bar -->
          <div class="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-ink/85 px-5 py-3 backdrop-blur-md md:px-10">
            <span class="truncate font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
              Case study · {{ String(index + 1).padStart(2, '0') }} / {{ String(total).padStart(2, '0') }}
            </span>
            <div class="flex items-center gap-2">
              <button type="button" @click="$emit('prev')" aria-label="Previous project"
                class="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white">
                <ChevronLeft class="size-4" />
              </button>
              <button type="button" @click="$emit('next')" aria-label="Next project"
                class="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white">
                <ChevronRight class="size-4" />
              </button>
              <button ref="closeRef" type="button" @click="$emit('close')" aria-label="Close case study"
                class="ml-1 grid h-9 w-9 place-items-center rounded-full bg-white text-ink transition hover:scale-105">
                <X class="size-4" />
              </button>
            </div>
          </div>

          <!-- Hero -->
          <header :class="['relative overflow-hidden bg-gradient-to-br px-5 pb-10 pt-12 md:px-10 md:pb-14 md:pt-16', project.gradient]">
            <div class="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay bg-[radial-gradient(circle_at_20%_10%,white,transparent_55%)]"></div>
            <div class="relative grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
              <div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="t in project.tags" :key="t"
                    class="rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
                    {{ t }}
                  </span>
                </div>
                <h2 class="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
                  {{ project.title }}
                </h2>
                <p class="mt-5 max-w-[52ch] text-pretty text-base font-light leading-relaxed text-white/80 md:text-lg">
                  {{ study.summary }}
                </p>
              </div>
              <div class="rounded-2xl border border-white/15 bg-black/30 p-2 shadow-2xl">
                <img :src="project.imageUrl" :alt="project.title" class="aspect-[16/10] w-full rounded-xl object-cover" />
              </div>
            </div>

            <!-- Meta row -->
            <dl class="relative mt-10 grid grid-cols-2 gap-6 border-t border-white/20 pt-6 md:grid-cols-4">
              <div v-for="m in meta" :key="m.label">
                <dt class="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">{{ m.label }}</dt>
                <dd class="mt-1.5 text-sm font-medium text-white">{{ m.value }}</dd>
              </div>
            </dl>
          </header>

          <div class="space-y-20 px-5 py-14 md:space-y-28 md:px-10 md:py-20">
            <!-- Metrics -->
            <section>
              <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
                <div v-for="m in study.metrics" :key="m.label" class="bg-ink p-6 md:p-8">
                  <div class="font-display text-3xl font-bold tracking-tight text-accent md:text-4xl">{{ m.value }}</div>
                  <div class="mt-2 text-sm font-light text-white/60">{{ m.label }}</div>
                </div>
              </div>
            </section>

            <!-- Challenge / Approach -->
            <section class="grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <SectionLabel n="01" text="The challenge" />
                <p class="mt-4 text-pretty text-lg font-light leading-relaxed text-white/75">{{ study.challenge }}</p>
              </div>
              <div>
                <SectionLabel n="02" text="My approach" />
                <p class="mt-4 text-pretty text-lg font-light leading-relaxed text-white/75">{{ study.approach }}</p>
              </div>
            </section>

            <!-- Architecture flow -->
            <section>
              <SectionLabel n="03" text="How it works" />
              <h3 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Solution architecture</h3>
              <ol class="mt-10 grid gap-4 md:grid-cols-5 md:gap-3">
                <li v-for="(step, i) in study.flow" :key="step.title"
                  class="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div class="flex items-center gap-3">
                    <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-ink">{{ i + 1 }}</span>
                    <span class="font-display text-lg font-semibold">{{ step.title }}</span>
                  </div>
                  <p class="mt-3 text-sm font-light leading-relaxed text-white/60">{{ step.detail }}</p>
                  <ArrowRight v-if="i < study.flow.length - 1"
                    class="absolute -right-[13px] top-1/2 z-10 hidden size-5 -translate-y-1/2 text-accent md:block" />
                </li>
              </ol>
            </section>

            <!-- Featured complex builds -->
            <section>
              <SectionLabel n="04" text="Featured builds" />
              <h3 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Complex work, shipped</h3>
              <div class="mt-10 grid gap-5 lg:grid-cols-3">
                <article v-for="(b, i) in study.builds" :key="b.title"
                  class="group flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition hover:border-accent/50 md:p-7">
                  <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">Build {{ String(i + 1).padStart(2, '0') }}</span>
                  <h4 class="mt-3 font-display text-xl font-semibold tracking-tight">{{ b.title }}</h4>
                  <p class="mt-3 text-sm font-light leading-relaxed text-white/65">{{ b.description }}</p>
                  <ul class="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                    <li v-for="pt in b.points" :key="pt" class="flex gap-2.5 text-sm text-white/80">
                      <Check class="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>{{ pt }}</span>
                    </li>
                  </ul>
                </article>
              </div>
            </section>

            <!-- Code sample -->
            <section>
              <SectionLabel n="05" text="Under the hood" />
              <h3 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{{ study.code.title }}</h3>
              <div class="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]">
                <div class="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <div class="flex items-center gap-1.5">
                    <span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
                    <span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
                    <span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{{ study.code.language }}</span>
                    <button type="button" @click="copyCode"
                      class="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-2.5 py-1 text-xs text-white/70 transition hover:border-white/40 hover:text-white">
                      <component :is="copied ? Check : Copy" class="size-3.5" />
                      {{ copied ? 'Copied' : 'Copy' }}
                    </button>
                  </div>
                </div>
                <pre class="max-h-[520px] overflow-auto p-5 text-[12.5px] leading-relaxed text-[#c9d1d9] md:p-6"><code class="font-mono">{{ study.code.snippet }}</code></pre>
              </div>
            </section>

            <!-- Gallery -->
            <section>
              <SectionLabel n="06" text="Gallery" />
              <h3 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Screens &amp; visuals</h3>
              <div class="mt-10 grid gap-5 md:grid-cols-2">
                <figure v-for="(g, i) in study.gallery" :key="g.src"
                  :class="['group cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]', i === 0 ? 'md:col-span-2' : '']"
                  @click="lightbox = g">
                  <div :class="['overflow-hidden', i === 0 ? 'aspect-[21/9]' : 'aspect-[4/3]']">
                    <img :src="g.src" :alt="g.caption" loading="lazy"
                      class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <figcaption class="flex items-center justify-between px-5 py-3.5 text-sm text-white/65">
                    {{ g.caption }}
                    <Maximize2 class="size-4 opacity-50 transition group-hover:opacity-100" />
                  </figcaption>
                </figure>
              </div>
            </section>

            <!-- Expertise + Stack -->
            <section class="grid gap-12 md:grid-cols-[1.3fr_1fr] md:gap-16">
              <div>
                <SectionLabel n="07" text="Expertise" />
                <h3 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">What this demonstrates</h3>
                <ul class="mt-8 divide-y divide-white/10 border-y border-white/10">
                  <li v-for="(e, i) in study.expertise" :key="e" class="flex items-baseline gap-5 py-4">
                    <span class="font-mono text-xs text-white/35">{{ String(i + 1).padStart(2, '0') }}</span>
                    <span class="text-base text-white/85">{{ e }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <SectionLabel n="08" text="Tech stack" />
                <div class="mt-8 flex flex-wrap gap-2.5">
                  <span v-for="s in study.stack" :key="s"
                    class="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85">{{ s }}</span>
                </div>
              </div>
            </section>

            <!-- Next project -->
            <section>
              <button type="button" @click="$emit('next')"
                class="group flex w-full items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-accent/60 md:p-10">
                <div>
                  <span class="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Next case study</span>
                  <div class="mt-2 font-display text-2xl font-bold tracking-tight transition group-hover:text-accent md:text-4xl">
                    {{ nextTitle }}
                  </div>
                </div>
                <ArrowRight class="size-8 shrink-0 text-accent transition-transform group-hover:translate-x-2" />
              </button>
            </section>
          </div>
        </div>

        <!-- Lightbox -->
        <Transition name="fade">
          <div v-if="lightbox" class="fixed inset-0 z-[110] grid place-items-center bg-black/90 p-4" @click="lightbox = null">
            <figure class="max-w-6xl">
              <img :src="lightbox.src" :alt="lightbox.caption" class="max-h-[85vh] w-auto rounded-xl object-contain" />
              <figcaption class="mt-3 text-center text-sm text-white/70">{{ lightbox.caption }}</figcaption>
            </figure>
            <button type="button" aria-label="Close image"
              class="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white text-ink">
              <X class="size-5" />
            </button>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount, h } from 'vue';
import { X, ChevronLeft, ChevronRight, ArrowRight, Check, Copy, Maximize2 } from 'lucide-vue-next';
import { caseStudies } from '../case-studies';

const props = defineProps({
  project: { type: Object, default: null },
  index: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  nextTitle: { type: String, default: '' }
});
const emit = defineEmits(['close', 'next', 'prev']);

const SectionLabel = (p) =>
  h('div', { class: 'flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/50' }, [
    h('span', { class: 'text-accent' }, p.n),
    h('span', { class: 'h-px w-8 bg-white/20' }),
    h('span', p.text)
  ]);
SectionLabel.props = ['n', 'text'];

const study = computed(() => (props.project ? caseStudies[props.project.slug] : null));
const meta = computed(() => [
  { label: 'Role', value: study.value.role },
  { label: 'Timeline', value: study.value.duration },
  { label: 'Client', value: study.value.client },
  { label: 'Domain', value: props.project.company }
]);

const panelRef = ref(null);
const closeRef = ref(null);
const lightbox = ref(null);
const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(study.value.code.snippet);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1600);
  } catch { /* clipboard unavailable */ }
};

const onKey = (e) => {
  if (e.key === 'Escape') {
    if (lightbox.value) lightbox.value = null;
    else emit('close');
  } else if (!lightbox.value && e.key === 'ArrowRight') emit('next');
  else if (!lightbox.value && e.key === 'ArrowLeft') emit('prev');
};

watch(
  () => props.project,
  async (p, old) => {
    if (p) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
      lightbox.value = null;
      await nextTick();
      if (panelRef.value) panelRef.value.scrollTop = 0;
      if (!old) closeRef.value?.focus({ preventScroll: true });
    } else {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    }
  }
);

onBeforeUnmount(() => {
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onKey);
});
</script>

<style scoped>
.cs-enter-active,
.cs-leave-active {
  transition: opacity 0.35s ease;
}
.cs-enter-active .cs-panel,
.cs-leave-active .cs-panel {
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease;
}
.cs-enter-from,
.cs-leave-to {
  opacity: 0;
}
.cs-enter-from .cs-panel,
.cs-leave-to .cs-panel {
  transform: translateY(40px) scale(0.98);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .cs-enter-active, .cs-leave-active,
  .cs-enter-active .cs-panel, .cs-leave-active .cs-panel {
    transition: none;
  }
}
</style>
