<template>
  <section id="labs" class="bg-ink py-20 text-white md:py-32 overflow-hidden">
    <div class="mx-auto max-w-[1400px] px-6 md:px-12">
      <!-- Section Header -->
      <ScrollReveal>
        <div class="mb-12 flex flex-col items-start justify-between gap-5 md:mb-16 md:flex-row md:items-end">
          <div>
            <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">Labs</span>
            <h2 class="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Apps I shipped,<br/>
              <span class="text-accent">designed &amp; built.</span>
            </h2>
          </div>
          <p class="max-w-sm text-pretty text-white/60 font-light leading-relaxed">
            Little experiments and side quests where I do it all - design, code, copy, and ship. Kept small so they stay fun.
          </p>
        </div>
      </ScrollReveal>

      <!-- Carousel Container -->
      <ScrollReveal>
        <!-- Horizontal Scroll on Mobile, 3-Column Grid on Desktop -->
        <div 
          ref="carouselRef"
          @scroll="handleScroll"
          class="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 pb-6 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0"
        >
          <!-- Card Item -->
          <div 
            v-for="(lab, index) in labs" 
            :key="lab.title"
            class="group block w-[78vw] max-w-[280px] shrink-0 snap-start md:w-auto md:max-w-none"
          >
            <!-- Lab Image Card (images already contain phone frames) -->
            <a :href="lab.link" class="block group-hover:scale-[1.02] transition-transform duration-300">
              <div class="mx-auto w-full max-w-[240px] md:max-w-[260px]">
                <div class="relative w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] border border-white/8">
                  <img 
                    :src="lab.imageUrl" 
                    :alt="lab.title"
                    class="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </a>

            <!-- Text Content -->
            <div class="mt-6 text-center">
              <a 
                :href="lab.link" 
                class="inline-flex items-center gap-1 font-display text-lg sm:text-xl font-bold tracking-tight text-white transition-colors duration-300 hover:text-accent"
              >
                {{ lab.title }}
                <ArrowUpRight class="size-4 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
              </a>
              <p class="mt-2 text-xs sm:text-sm text-white/60 text-pretty font-light leading-relaxed max-w-[28ch] mx-auto">
                {{ lab.description }}
              </p>
              <div class="mt-3 font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
                {{ lab.tags }} · {{ lab.year }}
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Controls (Mobile only) -->
        <div class="mt-8 md:hidden">
          <div class="flex items-center justify-center gap-4">
            <!-- Prev Button -->
            <button 
              @click="scrollPrev"
              :disabled="isAtStart"
              type="button" 
              aria-label="Previous app" 
              class="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 hover:border-white/50 hover:text-white disabled:opacity-30 disabled:hover:border-white/20 active:scale-95 transition-all duration-200"
            >
              <ChevronLeft class="size-5" />
            </button>

            <!-- Dots -->
            <div class="flex items-center gap-1.5">
              <button 
                v-for="(_, index) in labs" 
                :key="index"
                @click="scrollToIndex(index)"
                type="button" 
                :aria-label="`Go to app ${index + 1}`" 
                class="group p-1"
              >
                <span 
                  :class="[
                    'block h-1.5 rounded-full transition-all duration-300',
                    currentIndex === index 
                      ? 'w-6 bg-accent' 
                      : 'w-1.5 bg-white/25 group-hover:bg-white/50'
                  ]"
                ></span>
              </button>
            </div>

            <!-- Next Button -->
            <button 
              @click="scrollNext"
              :disabled="isAtEnd"
              type="button" 
              aria-label="Next app" 
              class="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 hover:border-white/50 hover:text-white disabled:opacity-30 disabled:hover:border-white/20 active:scale-95 transition-all duration-200"
            >
              <ChevronRight class="size-5" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import ScrollReveal from './ScrollReveal.vue';

const props = defineProps({
  labs: {
    type: Array,
    required: true
  }
});

const carouselRef = ref(null);
const currentIndex = ref(0);
const isAtStart = ref(true);
const isAtEnd = ref(false);

const handleScroll = () => {
  const el = carouselRef.value;
  if (!el) return;
  
  const scrollLeft = el.scrollLeft;
  const maxScrollLeft = el.scrollWidth - el.clientWidth;
  
  isAtStart.value = scrollLeft <= 10;
  isAtEnd.value = scrollLeft >= maxScrollLeft - 10;
  
  // Calculate currentIndex based on scroll index
  const children = el.children;
  if (children.length > 0) {
    const childWidth = children[0].clientWidth;
    const index = Math.round(scrollLeft / (childWidth + 24)); // includes gap
    currentIndex.value = Math.max(0, Math.min(index, props.labs.length - 1));
  }
};

const scrollToIndex = (index) => {
  const el = carouselRef.value;
  if (!el) return;
  const children = el.children;
  if (children.length > 0) {
    const childWidth = children[0].clientWidth;
    el.scrollTo({
      left: index * (childWidth + 24),
      behavior: 'smooth'
    });
  }
};

const scrollPrev = () => {
  scrollToIndex(currentIndex.value - 1);
};

const scrollNext = () => {
  scrollToIndex(currentIndex.value + 1);
};

onMounted(() => {
  setTimeout(handleScroll, 100);
});
</script>
