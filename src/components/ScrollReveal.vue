<template>
  <div
    ref="revealTarget"
    :class="[
      'transition-all duration-[1000ms] ease-out',
      isRevealed 
        ? 'opacity-100 translate-y-0 blur-none scale-100' 
        : 'opacity-0 translate-y-12 blur-[6px] scale-[0.98]'
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const revealTarget = ref(null);
const isRevealed = ref(false);

let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isRevealed.value = true;
        // Optional: unobserve after reveal
        if (revealTarget.value) {
          observer.unobserve(revealTarget.value);
        }
      }
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px" // triggers slightly before entering
    }
  );
  
  if (revealTarget.value) {
    observer.observe(revealTarget.value);
  }
});

onUnmounted(() => {
  if (observer && revealTarget.value) {
    observer.unobserve(revealTarget.value);
  }
});
</script>
