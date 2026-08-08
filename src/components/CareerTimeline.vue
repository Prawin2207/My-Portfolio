<template>
  <div class="mt-20 border-t border-gray-100 dark:border-white/5 pt-16">
    <ScrollReveal>
      <div class="mb-12">
        <h3 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white">
          Experience &amp; Education
        </h3>
        <p class="mt-2 text-sm text-gray-500 dark:text-white/50 font-light">
          A vertical timeline of my professional developer milestones and academic history.
        </p>
      </div>
    </ScrollReveal>

    <!-- Timeline Wrapper -->
    <div class="relative border-l border-gray-200 dark:border-white/10 ml-3 md:ml-6 space-y-12 pb-4">
      <ScrollReveal 
        v-for="item in timelineItems" 
        :key="item.title"
        class="relative pl-8 sm:pl-10 group"
      >
        <!-- Circle Node -->
        <span 
          class="absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-ink border-2 border-gray-300 dark:border-white/20 transition-all duration-500 group-hover:border-accent group-hover:scale-110"
        >
          <!-- Glowing inner bullet -->
          <span class="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-white/40 group-hover:bg-accent group-hover:animate-ping"></span>
        </span>

        <!-- Card Container -->
        <div class="bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-gray-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/[0.07] hover:shadow-md dark:shadow-none">
          <!-- Meta headers -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span class="font-mono text-xs uppercase tracking-wider text-accent font-semibold bg-accent/10 dark:bg-accent/5 px-2.5 py-1 rounded-md">
                {{ item.date }}
              </span>
              <h4 class="mt-2.5 font-display text-lg sm:text-xl font-bold text-ink dark:text-white group-hover:text-accent transition-colors duration-300">
                {{ item.title }}
              </h4>
            </div>
            <span class="font-mono text-xs sm:text-sm text-gray-400 dark:text-white/40 font-light shrink-0">
              {{ item.subtitle }}
            </span>
          </div>

          <!-- Bullet details -->
          <ul class="mt-4 space-y-2.5 text-sm text-gray-500 dark:text-white/60 font-light leading-relaxed">
            <li 
              v-for="bullet in item.bullets" 
              :key="bullet"
              class="flex items-start gap-2"
            >
              <span class="text-accent mt-1 leading-none select-none">✦</span>
              <span>{{ bullet }}</span>
            </li>
          </ul>
        </div>
      </ScrollReveal>
    </div>
  </div>
</template>

<script setup>
import ScrollReveal from './ScrollReveal.vue';

const timelineItems = [
  {
    date: "2023 - Present",
    title: "Software Developer (Full-Stack & Zoho)",
    subtitle: "Enterprise Solutions",
    bullets: [
      "Built and maintained responsive web applications end-to-end, connecting JavaScript interfaces with Node.js/Express.js back-ends and MySQL.",
      "Customized custom no-code business applications using Zoho Creator to streamline CRM operations, Book sales entries, and Desk customer ticketing.",
      "Wrote robust unit tests, completed technical documentations, and conducted code reviews to maintain platform deployment stability.",
      "Diagnosed and resolved production bugs, optimized query runtimes, and refactored codebases for maximum performance."
    ]
  },
  {
    date: "2023",
    title: "Video Editing Basics Certification",
    subtitle: "Great Learning Academy",
    bullets: [
      "Completed professional certification training focused on video composition and timeline alignment.",
      "Acquired core skills in video production, rendering formats, and creating clean engaging video presentations."
    ]
  },
  {
    date: "2021 - 2023",
    title: "Full-Stack Web Developer Projects",
    subtitle: "Freelance / Web Projects",
    bullets: [
      "Developed secure REST APIs utilizing Express and Node backend architectures connected with database tables.",
      "Designed clean, responsive web pages utilizing standard HTML5 semantic layouts, custom CSS animations, and modern JS variables."
    ]
  },
  {
    date: "Jan 2023",
    title: "Bachelor of Computer Science",
    subtitle: "HCAS College — GPA: 8.0 / 10",
    bullets: [
      "Graduated with distinction in core software engineering, database management structures, and algorithmic principles.",
      "Successfully led project teams as workload coordinator and technical lead for college application delivery."
    ]
  }
];
</script>
