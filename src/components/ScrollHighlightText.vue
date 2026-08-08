<template>
  <div 
    ref="containerRef" 
    class="font-display text-2xl sm:text-3xl md:text-[38px] font-bold leading-normal tracking-tight"
  >
    <!-- Highlight text blocks -->
    <span 
      v-for="(word, index) in words" 
      :key="index"
      :style="{
        opacity: getOpacity(index),
        color: getColor(index),
        transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }"
      class="inline-block mr-[0.22em] mb-1 select-none"
    >
      {{ word }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  }
});

const containerRef = ref(null);
const scrollProgress = ref(0);

const words = computed(() => {
  return props.text.split(' ');
});

const handleScroll = () => {
  const el = containerRef.value;
  if (!el) return;
  
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Custom scrolling ranges
  const triggerStart = windowHeight * 0.8;
  const triggerEnd = windowHeight * 0.2;
  
  const totalDistance = triggerStart - triggerEnd;
  const currentDistance = triggerStart - rect.top;
  
  let progress = currentDistance / (totalDistance + rect.height * 0.6);
  progress = Math.max(0, Math.min(1, progress));
  
  scrollProgress.value = progress;
};

const getOpacity = (index) => {
  const wordThreshold = index / words.value.length;
  // If progress is past this word's index, fade it in
  if (scrollProgress.value >= wordThreshold) {
    return 1.0;
  }
  // Base dim state
  return 0.18;
};

const getColor = (index) => {
  const wordThreshold = index / words.value.length;
  if (scrollProgress.value >= wordThreshold) {
    return 'inherit'; // default text color (black in light, white in dark)
  }
  return 'currentColor'; // fallback
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleScroll);
  // Initial check
  setTimeout(handleScroll, 100);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>
