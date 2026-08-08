<template>
  <header 
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-500 py-4',
      isScrolled 
        ? 'bg-white/70 dark:bg-ink/75 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm' 
        : 'bg-transparent border-b border-transparent'
    ]"
  >
    <div class="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
      <!-- Logo -->
      <a 
        href="#" 
        class="group flex items-center gap-2 text-ink dark:text-white"
      >
        <span class="inline-block text-xl leading-none transition-transform duration-300 group-hover:rotate-12">✦</span>
        <span class="font-display text-2xl font-bold tracking-tight">
          {{ name }}<span class="text-accent">.</span>
        </span>
      </a>

      <!-- Mid Navigation -->
      <nav class="hidden md:flex items-center gap-1 bg-gray-100/80 dark:bg-white/5 rounded-full p-1 border border-gray-200/20">
        <a 
          v-for="item in navItems" 
          :key="item.href"
          :href="item.href"
          :class="[
            'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
            activeSection === item.id 
              ? 'bg-white dark:bg-ink-light text-ink dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-white/60 hover:text-ink dark:hover:text-white'
          ]"
        >
          {{ item.name }}
        </a>
      </nav>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button 
          @click="toggleTheme" 
          type="button" 
          aria-label="Toggle theme" 
          class="relative flex size-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-ink dark:text-white backdrop-blur transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Sun v-if="isDark" class="size-4 text-amber-400" />
          <Moon v-else class="size-4 text-gray-700" />
        </button>

        <!-- Contact CTA -->
        <a 
          href="#contact" 
          class="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/15 bg-gray-900 dark:bg-white/10 text-white px-5 py-2 text-sm font-medium transition-all duration-300 hover:bg-gray-800 dark:hover:bg-white/20 hover:scale-[1.02]"
        >
          Say Hi <span class="animate-pulse">👋</span>
        </a>

        <!-- Mobile Menu Toggle -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          type="button" 
          aria-label="Open menu" 
          class="relative flex size-10 items-center justify-center rounded-full border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 md:hidden"
        >
          <Menu v-if="!isMobileMenuOpen" class="size-5 text-ink dark:text-white" />
          <X v-else class="size-5 text-ink dark:text-white" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden absolute top-full inset-x-0 bg-white dark:bg-ink border-b border-gray-200 dark:border-white/10 px-6 py-6 flex flex-col gap-4 shadow-xl"
      >
        <a 
          v-for="item in navItems" 
          :key="item.href"
          :href="item.href"
          @click="isMobileMenuOpen = false"
          class="text-lg font-medium py-2 border-b border-gray-100 dark:border-white/5 text-gray-800 dark:text-white/80"
        >
          {{ item.name }}
        </a>
        <a 
          href="#contact" 
          @click="isMobileMenuOpen = false"
          class="mt-2 inline-flex justify-center items-center gap-1.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-ink py-3 text-base font-semibold"
        >
          Say Hi 👋
        </a>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Sun, Moon, Menu, X } from 'lucide-vue-next';

defineProps({
  name: {
    type: String,
    required: true
  }
});

const isScrolled = ref(false);
const isDark = ref(false);
const isMobileMenuOpen = ref(false);
const activeSection = ref('home');

const navItems = [
  { name: 'Work', href: '#work', id: 'work' },
  { name: 'Lab', href: '#labs', id: 'labs' },
  { name: 'About', href: '#about', id: 'about' }
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
  
  // Update active section on scroll
  const sections = ['work', 'labs', 'about'];
  for (const section of sections) {
    const el = document.getElementById(section);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        activeSection.value = section;
        break;
      }
    }
  }
  if (window.scrollY < 100) {
    activeSection.value = 'home';
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  
  // Theme check
  isDark.value = document.documentElement.classList.contains('dark');
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
