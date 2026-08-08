<template>
  <section id="work" class="bg-gray-50 dark:bg-ink py-24 md:py-32 transition-colors duration-500">
    <div class="mx-auto max-w-[1400px] px-6 md:px-12">
      <!-- Section Header -->
      <ScrollReveal>
        <div class="mb-14 flex items-end justify-between gap-6 border-b border-gray-200 dark:border-white/10 pb-6 md:mb-20">
          <div>
            <span class="font-mono text-[11px] uppercase tracking-[0.25em] text-gray-500 dark:text-white/50">Portfolio</span>
            <h2 class="mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink dark:text-white">
              Selected work
            </h2>
          </div>
          <p class="hidden max-w-[34ch] text-right text-sm text-gray-500 dark:text-white/50 md:block font-light">
            Featured projects and shipped solutions - products built and scaled for millions of users.
          </p>
        </div>
      </ScrollReveal>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-x-12">
        <ScrollReveal 
          v-for="(project, index) in projects" 
          :key="project.title"
          :class="index % 2 !== 0 ? 'md:translate-y-8' : ''"
        >
          <a :href="project.link" class="group/card block">
            <!-- Dynamic Gradient Card Container -->
            <div 
              :class="[
                'relative aspect-[4/3] w-full overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-500 bg-gradient-to-br shadow-lg hover:shadow-xl dark:shadow-none hover:scale-[1.01]',
                project.gradient
              ]"
            >
              <!-- Card Mesh Overlay -->
              <div class="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_25%_15%,white,transparent_55%)]"></div>
              
              <!-- Mockup Frames inside the card -->
              <div class="relative z-[1] flex h-full w-full items-center justify-center transition-transform duration-700 ease-out group-hover/card:scale-[1.03]">
                
                <!-- Tablet Frame Mockup -->
                <div 
                  v-if="project.mockupType === 'tablet'" 
                  class="w-[85%] sm:w-[80%] max-w-[380px]"
                >
                  <div class="rounded-[1.2rem] bg-slate-950 p-[7px] shadow-2xl border border-white/10">
                    <div class="relative aspect-[16/10] w-full overflow-hidden rounded-[0.9rem] bg-zinc-900">
                      <!-- Camera lens dot -->
                      <div class="absolute left-1/2 top-1 z-10 h-[3px] w-8 -translate-x-1/2 rounded-full bg-white/20"></div>
                      <img 
                        :src="project.imageUrl" 
                        :alt="project.title" 
                        class="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <!-- Phone Frame Mockup -->
                <div 
                  v-else-if="project.mockupType === 'phone'" 
                  class="w-[45%] sm:w-[40%] max-w-[200px] translate-y-4"
                >
                  <div class="rounded-[2rem] bg-slate-950 p-[6px] shadow-2xl border border-white/15">
                    <div class="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.7rem] bg-zinc-900">
                      <!-- Speaker pill/notch -->
                      <div class="absolute left-1/2 top-2 z-10 h-3 w-12 -translate-x-1/2 rounded-full bg-black border border-white/5"></div>
                      <img 
                        :src="project.imageUrl" 
                        :alt="project.title" 
                        class="absolute inset-0 h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <!-- Cover / Full Card Frame -->
                <div 
                  v-else 
                  class="absolute inset-0 h-full w-full p-4"
                >
                  <img 
                    :src="project.imageUrl" 
                    :alt="project.title" 
                    class="h-full w-full object-cover rounded-2xl border border-white/10 shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              <!-- Case Study Interactive Hover Overlay -->
              <div class="pointer-events-none absolute inset-0 bg-black/40 opacity-0 backdrop-blur-[1.5px] transition-opacity duration-500 group-hover/card:opacity-100 flex items-center justify-center">
                <span class="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white text-ink px-5 py-2.5 text-sm font-semibold shadow-xl transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:scale-105">
                  View case study
                  <ArrowUpRight class="size-4" />
                </span>
              </div>
            </div>

            <!-- Card Meta Text Content -->
            <div class="group/meta mt-5">
              <div class="flex items-center justify-between gap-4">
                <!-- Meta tags and logo icon -->
                <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gray-500 dark:text-white/50">
                  <img 
                    :src="project.logoUrl" 
                    :alt="project.company" 
                    class="h-4 w-auto self-center object-contain rounded-sm opacity-80"
                    loading="lazy"
                  />
                  <span>·</span>
                  <span>{{ project.tags.join(', ') }}</span>
                </div>
                <!-- Year -->
                <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-white/40">
                  {{ project.year }}
                </span>
              </div>
              
              <!-- Hover dynamic heading -->
              <h3 class="mt-2 flex items-center justify-between font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink dark:text-white transition-colors duration-300 group-hover/card:text-accent">
                <span class="flex-1 text-pretty">{{ project.title }}</span>
                <ArrowUpRight class="size-5 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-all duration-500 group-hover/card:translate-x-0 group-hover/card:opacity-100 text-accent" />
              </h3>
              
              <!-- Description -->
              <p class="mt-1.5 max-w-[56ch] text-pretty text-sm text-gray-500 dark:text-white/60 leading-relaxed font-light">
                {{ project.description }}
              </p>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ArrowUpRight } from 'lucide-vue-next';
import ScrollReveal from './ScrollReveal.vue';

defineProps({
  projects: {
    type: Array,
    required: true
  }
});
</script>
