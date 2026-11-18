<template>
  <section id="contact" ref="root" class="relative overflow-hidden border-t border-zinc-800 bg-ink pt-24 md:pt-32">
    <div class="relative mx-auto max-w-[1600px] px-5 md:px-12">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
          <span class="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_12px_rgba(198,255,61,0.8)]"></span>
          NODE_05 // OUTPUT
        </div>
        <span class="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:block [@media(hover:none)]:hidden">
          {{ particlesOn ? 'move · press to disturb the signal' : '' }}
        </span>
        <span class="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 [@media(hover:none)]:block">
          {{ particlesOn ? 'touch · drag the signal' : '' }}
        </span>
      </div>
    </div>

    <!-- PIXI particle headline -->
    <h2 class="sr-only">Let's build.</h2>
    <div ref="stage" class="relative mx-auto mt-6 h-[42vw] max-h-[520px] min-h-[220px] w-full max-w-[1600px] touch-pan-y" data-cursor="Disturb">
      <div v-if="!particlesOn" aria-hidden="true"
        class="flex h-full flex-col items-center justify-center font-display text-[clamp(3.5rem,17vw,16rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.05em]">
        <span>Let's</span><span>Build<span class="text-accent">.</span></span>
      </div>
    </div>

    <div class="relative mx-auto grid max-w-[1600px] gap-10 px-5 pb-16 pt-10 md:px-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20 [&>*]:min-w-0">
      <!-- channels -->
      <div class="space-y-8">
        <p class="max-w-[42ch] text-base font-light leading-relaxed text-bone/65">
          Zoho customisation, an API that needs building, or a full product from scratch — send the input, I'll handle the processing.
        </p>
        <div class="divide-y divide-zinc-800 border-y border-zinc-800">
          <a :href="'mailto:' + email" class="group flex items-center justify-between py-5" data-cursor="Mail">
            <span>
              <span class="block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">channel.email</span>
              <span class="mt-1 block text-lg text-bone transition-colors group-hover:text-accent md:text-xl">{{ email }}</span>
            </span>
            <span class="text-2xl text-zinc-600 transition-all group-hover:-rotate-45 group-hover:text-accent">→</span>
          </a>
          <a :href="linkedin" target="_blank" rel="noopener noreferrer" class="group flex items-center justify-between py-5">
            <span>
              <span class="block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">channel.linkedin</span>
              <span class="mt-1 block text-lg text-bone transition-colors group-hover:text-accent md:text-xl">Prawin K</span>
            </span>
            <span class="text-2xl text-zinc-600 transition-all group-hover:-rotate-45 group-hover:text-accent">→</span>
          </a>
          <div class="py-5">
            <span class="block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">location</span>
            <span class="mt-1 block text-lg text-bone md:text-xl">{{ location }} <span class="font-mono text-xs text-zinc-500">· IST (UTC+5:30)</span></span>
          </div>
        </div>
      </div>

      <!-- command-prompt form -->
      <form class="border border-zinc-800 bg-[#0c0c0e]" novalidate @submit.prevent="submit">
        <div class="flex items-center justify-between border-b border-zinc-800 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          <span>~/contact — send_message.sh</span>
          <span :class="statusColor">{{ statusLabel }}</span>
        </div>

        <div class="space-y-1 p-5 font-mono text-sm md:p-7">
          <label v-for="f in fields" :key="f.key" class="group block">
            <span class="flex items-start gap-3 border-b border-zinc-800/70 py-3 transition-colors focus-within:border-accent">
              <span class="shrink-0 pt-0.5 text-accent">&gt;</span>
              <span class="w-20 shrink-0 pt-0.5 text-zinc-500">{{ f.label }}:</span>
              <textarea v-if="f.key === 'message'" v-model="form[f.key]" :maxlength="f.max" rows="4" :placeholder="f.ph" required
                class="min-w-0 flex-1 resize-none bg-transparent text-bone placeholder-zinc-700 outline-none" />
              <input v-else v-model="form[f.key]" :type="f.type" :maxlength="f.max" :placeholder="f.ph" :autocomplete="f.auto" required
                class="min-w-0 flex-1 bg-transparent text-bone placeholder-zinc-700 outline-none" />
            </span>
          </label>

          <!-- honeypot: hidden from humans, bots fill it -->
          <input v-model="form.botcheck" type="checkbox" name="botcheck" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

          <p v-if="error" class="pt-3 text-xs text-signal" role="alert">! {{ error }}</p>
          <p v-if="status === 'success'" class="pt-3 text-xs text-accent" role="status">✓ Message delivered. I'll reply within 24 hours.</p>

          <div class="flex items-center justify-between pt-6">
            <span class="text-[10px] text-zinc-600">{{ form.message.length }}/{{ fields[2].max }}</span>
            <button type="submit" :disabled="status === 'sending'" data-cursor="Send"
              class="bg-accent px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-shadow hover:shadow-[0_0_24px_rgba(198,255,61,0.55)] disabled:opacity-50">
              {{ status === 'sending' ? 'Executing…' : '[ Execute → ]' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- footer -->
    <footer class="relative border-t border-zinc-800">
      <div class="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 md:flex-row md:items-center md:justify-between md:px-12">
        <span>© {{ year }} {{ name }} — designed &amp; engineered in India</span>
        <span>+11.1271° N  +78.6569° E</span>
        <a href="#input" class="text-bone transition-colors hover:text-accent">Back to input ↑</a>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { gsap, prefersReducedMotion, hasWebGL } from './motion';

const props = defineProps({
  name: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: { type: String, required: true },
  location: { type: String, required: true },
  web3formsKey: { type: String, required: true }
});

const year = new Date().getFullYear();
const root = ref(null);
const stage = ref(null);
const particlesOn = ref(false);
let particles = null;
let io = null;
let viewIo = null;
let loading = false;

/* ---------- form (validated, rate-limited, honeypot) ---------- */
const fields = [
  { key: 'name', label: 'name', type: 'text', max: 80, ph: 'your_name', auto: 'name' },
  { key: 'email', label: 'email', type: 'email', max: 120, ph: 'you@domain.com', auto: 'email' },
  { key: 'message', label: 'message', type: 'text', max: 2000, ph: 'describe the job…', auto: 'off' }
];
const form = reactive({ name: '', email: '', message: '', botcheck: false });
const status = ref('idle'); // idle | sending | success | error
const error = ref('');
const COOLDOWN_MS = 30_000;
let lastSent = 0;

const statusLabel = computed(() => ({ idle: '● ready', sending: '◌ running', success: '✓ exit 0', error: '✗ exit 1' }[status.value]));
const statusColor = computed(() => ({ idle: 'text-zinc-500', sending: 'text-bone', success: 'text-accent', error: 'text-signal' }[status.value]));

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]{1,190}\.[a-z]{2,24}$/i;
// strip control characters (keeps newlines/tabs in the message)
const clean = (s, keepNewlines = false) =>
  String(s).replace(keepNewlines ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, '').trim();

const submit = async () => {
  error.value = '';
  if (status.value === 'sending') return;
  if (form.botcheck) { status.value = 'success'; return; } // silently drop bots

  const payload = {
    name: clean(form.name).slice(0, 80),
    email: clean(form.email).slice(0, 120),
    message: clean(form.message, true).slice(0, 2000)
  };
  if (payload.name.length < 2) return (error.value = 'name: at least 2 characters');
  if (!EMAIL_RE.test(payload.email)) return (error.value = 'email: invalid address');
  if (payload.message.length < 10) return (error.value = 'message: at least 10 characters');
  if (Date.now() - lastSent < COOLDOWN_MS) return (error.value = 'rate limit: wait a few seconds before sending again');
  if (!props.web3formsKey) return (error.value = 'contact form not configured — email me directly');

  status.value = 'sending';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: props.web3formsKey, ...payload, botcheck: false, subject: 'Portfolio enquiry', from_name: 'Prawin Portfolio' }),
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin'
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error('send failed');
    status.value = 'success';
    lastSent = Date.now();
    form.name = form.email = form.message = '';
    particles?.scatter();
  } catch {
    status.value = 'error';
    error.value = 'could not send right now — please email me directly';
  } finally {
    clearTimeout(timeout);
  }
};

/* ---------- PIXI particles (lazy-loaded) ---------- */
onMounted(() => {
  if (prefersReducedMotion() || !hasWebGL()) return;
  io = new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting && !particles) {
      if (loading) return;
      loading = true;
      try {
        const { createParticleText } = await import('./particleText.js');
        particlesOn.value = true;
        particles = await createParticleText(stage.value);
      } catch {
        particlesOn.value = false;
      }
    } else if (particles) {
      entry.isIntersecting ? particles.start() : particles.stop();
    }
  }, { rootMargin: '200px 0px' });
  io.observe(stage.value);

  // Re-form the words each time the headline actually comes into view
  // (the loader above fires early, so the first assembly used to happen off-screen).
  let wasVisible = false;
  viewIo = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !wasVisible) particles?.assemble();
    wasVisible = entry.isIntersecting;
  }, { threshold: 0.45 });
  viewIo.observe(stage.value);

  gsap.from(root.value.querySelectorAll('form, .space-y-8 > *'), {
    y: 50, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: stage.value, start: 'bottom 85%' }
  });
});

onBeforeUnmount(() => {
  io?.disconnect();
  viewIo?.disconnect();
  particles?.destroy();
});
</script>
