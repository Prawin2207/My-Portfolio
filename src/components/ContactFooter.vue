<template>
  <footer 
    ref="footerRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    class="relative overflow-hidden bg-ink text-white border-t border-white/10 transition-colors duration-500 py-24 md:py-32"
  >
    <!-- Interactive Radial Mouse-Follow Glow -->
    <div 
      :style="glowStyle"
      class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px] transition-all duration-300 ease-out"
    ></div>

    <!-- Abstract court markings backdrop lines -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
      <div class="absolute left-1/4 inset-y-0 w-px bg-white"></div>
      <div class="absolute right-1/4 inset-y-0 w-px bg-white"></div>
      <div class="absolute top-1/3 inset-x-0 h-px bg-white"></div>
      <div class="absolute inset-x-0 bottom-1/4 h-px bg-white"></div>
    </div>

    <div class="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        
        <!-- Left Column: Contact Text Info -->
        <div class="lg:col-span-5 space-y-8">
          <ScrollReveal>
            <h3 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white select-none">
              Say hello<span class="text-accent">.</span>
            </h3>
            <p class="mt-4 text-white/60 font-light leading-relaxed text-pretty">
              Have a project, freelance work, Zoho customization request, or just want to connect? Send a message here or reach out via email.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div class="space-y-6 pt-6 border-t border-white/10">
              <!-- Email Item -->
              <div class="group/item flex items-center gap-4">
                <div class="flex size-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50">
                  <Mail class="size-4" />
                </div>
                <div>
                  <div class="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Email</div>
                  <a 
                    :href="`mailto:${email}`" 
                    class="mt-1 block text-sm sm:text-base text-white/90 hover:text-accent transition-colors duration-300 font-light"
                  >
                    {{ email }}
                  </a>
                </div>
              </div>

              <!-- Elsewhere Item -->
              <div class="group/item flex items-center gap-4">
                <div class="flex size-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50">
                  <Globe class="size-4" />
                </div>
                <div>
                  <div class="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Elsewhere</div>
                  <div class="mt-1 flex gap-4">
                    <a 
                      :href="linkedin" 
                      target="_blank" 
                      rel="noreferrer noopener"
                      class="text-sm sm:text-base text-white/90 hover:text-accent transition-colors duration-300 font-light"
                    >
                      LinkedIn
                    </a>
                    <a 
                      v-if="github"
                      :href="github" 
                      target="_blank" 
                      rel="noreferrer noopener"
                      class="text-sm sm:text-base text-white/90 hover:text-accent transition-colors duration-300 font-light"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>

              <!-- Based in Item -->
              <div class="group/item flex items-center gap-4">
                <div class="flex size-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50">
                  <MapPin class="size-4 text-accent" />
                </div>
                <div>
                  <div class="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Based in</div>
                  <div class="mt-1 text-sm sm:text-base text-white/90 font-light">
                    {{ location }}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <!-- Right Column: Interactive Contact Form -->
        <div class="lg:col-span-7">
          <ScrollReveal>
            <div class="bg-white/[0.01] border border-white/5 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-xl">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                
                <!-- Name -->
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">Name</label>
                  <input 
                    v-model="form.name" 
                    type="text" 
                    required 
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-white/[0.08] transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">Email</label>
                  <input 
                    v-model="form.email" 
                    type="email" 
                    required 
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-white/[0.08] transition-all duration-300"
                    placeholder="your@email.com"
                  />
                </div>

                <!-- Message -->
                <div>
                  <label class="block text-xs font-mono uppercase tracking-wider text-white/50 mb-2">Message</label>
                  <textarea 
                    v-model="form.message" 
                    required 
                    rows="4" 
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-accent focus:bg-white/[0.08] transition-all duration-300 resize-none"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>

                <!-- Submit Button -->
                <div>
                  <button 
                    type="submit" 
                    :disabled="isSubmitting"
                    class="w-full group inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-ink font-semibold py-4 text-sm transition-all duration-300 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                  >
                    <span v-if="!isSubmitting">Send Message</span>
                    <span v-else class="animate-spin border-2 border-ink border-t-transparent rounded-full size-4"></span>
                    <ArrowUpRight v-if="!isSubmitting" class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

                <!-- Form status alerts -->
                <transition
                  enter-active-class="transition duration-300 ease-out"
                  enter-from-class="transform -translate-y-2 opacity-0"
                  enter-to-class="transform translate-y-0 opacity-100"
                >
                  <div v-if="submitStatus === 'success'" class="text-xs text-emerald-400 font-light mt-2 flex items-center gap-1.5">
                    <span>✓</span> Message sent successfully! I'll get back to you soon.
                  </div>
                  <div v-else-if="submitStatus === 'error'" class="text-xs text-rose-400 font-light mt-2 flex items-center gap-1.5">
                    <span>✗</span> Failed to submit. Please ensure your Access Key is set.
                  </div>
                </transition>
              </form>
            </div>
          </ScrollReveal>
        </div>

      </div>

      <!-- Bottom Credits / Copyright -->
      <div class="mt-20 flex flex-col gap-3 text-[11px] text-white/30 border-t border-white/10 pt-8 md:flex-row md:justify-between">
        <span>© {{ currentYear }} {{ name }}</span>
        <span class="font-mono uppercase tracking-[0.18em] text-white/40">
          Designed &amp; Developed in India
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ArrowUpRight, Mail, Globe, MapPin } from 'lucide-vue-next';
import ScrollReveal from './ScrollReveal.vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  linkedin: {
    type: String,
    required: true
  },
  github: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  web3formsKey: {
    type: String,
    required: true
  }
});

const footerRef = ref(null);
const mouseX = ref(0);
const mouseY = ref(0);
const showGlow = ref(false);

const form = ref({
  name: '',
  email: '',
  message: ''
});
const isSubmitting = ref(false);
const submitStatus = ref(null); // 'success' | 'error' | null

const handleMouseMove = (e) => {
  const el = footerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
  showGlow.value = true;
};

const handleMouseLeave = () => {
  showGlow.value = false;
};

const glowStyle = computed(() => {
  return {
    left: `${mouseX.value}px`,
    top: `${mouseY.value}px`,
    width: showGlow.value ? '400px' : '0px',
    height: showGlow.value ? '400px' : '0px',
    opacity: showGlow.value ? 1 : 0
  };
});

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  submitStatus.value = null;

  // Simple validation to ensure access key is configured
  if (!props.web3formsKey || props.web3formsKey === 'YOUR_ACCESS_KEY_HERE') {
    isSubmitting.value = false;
    submitStatus.value = 'error';
    return;
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: props.web3formsKey,
        name: form.value.name,
        email: form.value.email,
        message: form.value.message,
        from_name: 'Prawin Portfolio'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      submitStatus.value = 'success';
      // Reset form
      form.value.name = '';
      form.value.email = '';
      form.value.message = '';
    } else {
      submitStatus.value = 'error';
    }
  } catch (err) {
    submitStatus.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>
