<template>
  <section id="about" class="bg-white dark:bg-ink py-24 md:py-32 transition-colors duration-500 border-t border-gray-100 dark:border-white/5">
    <div class="mx-auto max-w-[1400px] px-6 md:px-12">
      <!-- Section Tag -->
      <ScrollReveal>
        <div class="mb-8">
          <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 dark:text-white/50">About</span>
        </div>
      </ScrollReveal>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <!-- Left Column: Word-by-scroll highlight -->
        <div class="md:col-span-7">
          <ScrollHighlightText :text="aboutHeadline" />
          
          <!-- Status badges / pills -->
          <ScrollReveal>
            <div class="mt-8 flex flex-wrap gap-2.5">
              <span 
                v-for="badge in statusBadges" 
                :key="badge.text"
                class="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 px-4 py-2 text-xs font-medium text-gray-600 dark:text-white/70 transition-all duration-300 hover:border-accent hover:text-ink dark:hover:text-white"
              >
                <span class="text-sm leading-none">{{ badge.emoji }}</span>
                <span>{{ badge.text }}</span>
              </span>
            </div>
          </ScrollReveal>
        </div>

        <!-- Right Column: Paragraph and CTAs -->
        <div class="md:col-span-5 md:pt-4 flex flex-col justify-between">
          <ScrollReveal>
            <p class="text-pretty text-base sm:text-lg text-gray-500 dark:text-white/70 font-light leading-relaxed">
              {{ aboutText }}
            </p>
          </ScrollReveal>

          <!-- Action Buttons -->
          <ScrollReveal class="mt-8">
            <div class="flex flex-wrap gap-4 items-center">
              <a 
                href="#contact" 
                class="group inline-flex items-center gap-2 rounded-full border border-gray-300 dark:border-white/20 px-6 py-3 text-sm font-semibold text-ink dark:text-white transition-all duration-300 hover:border-accent hover:text-accent active:scale-95"
              >
                More about me
                <ArrowUpRight class="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              
              <a 
                :href="resumeUrl" 
                download
                class="group inline-flex items-center gap-2 rounded-full bg-ink dark:bg-white text-white dark:text-ink px-6 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Download class="size-4" />
                Download resume
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <!-- Professional Career & Education Timeline -->
      <CareerTimeline />
    </div>
  </section>
</template>

<script setup>
import { ArrowUpRight, Download } from 'lucide-vue-next';
import ScrollReveal from './ScrollReveal.vue';
import ScrollHighlightText from './ScrollHighlightText.vue';
import CareerTimeline from './CareerTimeline.vue';

defineProps({
  aboutHeadline: {
    type: String,
    required: true
  },
  aboutText: {
    type: String,
    required: true
  },
  statusBadges: {
    type: Array,
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  }
});
</script>
