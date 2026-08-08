<template>
  <section class="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white">
    <!-- Interactive Canvas Flow Field Background -->
    <canvas 
      ref="bgCanvas" 
      class="absolute inset-0 size-full object-cover opacity-80"
    ></canvas>
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/70"></div>
    
    <!-- Main Content Container -->
    <div 
      class="relative z-10 flex h-full flex-col justify-end px-6 pb-16 pt-28 md:px-12 md:pb-20"
    >
      <div class="max-w-[1400px] mx-auto w-full">
        <h1 class="font-display text-[9vw] sm:text-[8vw] md:text-[6.5vw] font-bold leading-[0.95] tracking-tight">
          <!-- First line slide-up -->
          <span class="block overflow-hidden pb-1">
            <span 
              :class="[
                'block transition-transform duration-[1200ms] cubic-bezier-out',
                animateTitle ? 'translate-y-0' : 'translate-y-[110%]'
              ]"
            >
              {{ headline }}
            </span>
          </span>
          <!-- Second line slide-up -->
          <span class="block overflow-hidden pb-1">
            <span 
              :class="[
                'block text-white/50 transition-transform duration-[1200ms] delay-200 cubic-bezier-out',
                animateTitle ? 'translate-y-0' : 'translate-y-[110%]'
              ]"
            >
              {{ subHeadline }}
            </span>
          </span>
        </h1>
        
        <!-- Bio and CTA buttons -->
        <div 
          :class="[
            'mt-8 flex max-w-xl flex-col items-start gap-6 transition-all duration-[1000ms] delay-500',
            animateTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          ]"
        >
          <p class="text-pretty text-base text-white/70 sm:text-lg md:text-xl font-light leading-relaxed">
            {{ heroBio }}
          </p>
          
          <div class="flex flex-wrap gap-4 items-center">
            <a 
              href="#work" 
              class="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-ink px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-accent hover:text-ink hover:scale-[1.02] active:scale-95"
            >
              View my work
              <ArrowDown class="size-4 animate-bounce group-hover:text-ink" />
            </a>
            <a 
              href="#about" 
              class="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-white hover:text-ink hover:border-white hover:scale-[1.02] active:scale-95"
            >
              About me
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ArrowDown } from 'lucide-vue-next';

defineProps({
  headline: {
    type: String,
    required: true
  },
  subHeadline: {
    type: String,
    required: true
  },
  heroBio: {
    type: String,
    required: true
  }
});

const animateTitle = ref(false);
const bgCanvas = ref(null);

let animationId = null;
let width = 0;
let height = 0;

// Canvas dynamic visual wave animation setup
const initCanvas = () => {
  const canvas = bgCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  
  window.addEventListener('resize', resize);
  resize();
  
  // Custom Flow field wave particles
  const particleCount = 60;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 0.5 + 0.2,
      angle: Math.random() * Math.PI * 2,
      thickness: Math.random() * 1.5 + 0.5,
      color: `rgba(118, 227, 215, ${Math.random() * 0.15 + 0.05})` // accent color transparency
    });
  }
  
  const draw = () => {
    ctx.fillStyle = 'rgba(11, 12, 16, 0.08)'; // trails matching bg-ink
    ctx.fillRect(0, 0, width, height);
    
    for (let p of particles) {
      // Flow updates
      p.angle += 0.002 * (Math.sin(p.x * 0.005) + Math.cos(p.y * 0.005));
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      
      // Draw wave segment
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - Math.cos(p.angle) * p.length, p.y - Math.sin(p.angle) * p.length);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.thickness;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Reset offscreen particles
      if (p.x < -p.length || p.x > width + p.length || p.y < -p.length || p.y > height + p.length) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      }
    }
    
    animationId = requestAnimationFrame(draw);
  };
  
  draw();
  
  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
};

onMounted(() => {
  // Trigger text entry animation shortly after mount
  setTimeout(() => {
    animateTitle.value = true;
  }, 100);
  
  initCanvas();
});
</script>

<style scoped>
.cubic-bezier-out {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
