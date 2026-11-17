<script setup>
import { ref, onMounted } from 'vue';
import { portfolioData } from './portfolio-data';
import { ScrollTrigger } from './creative/motion';
import Preloader from './creative/Preloader.vue';
import SignalCursor from './creative/SignalCursor.vue';
import NavBar from './creative/NavBar.vue';
import PipelineSpine from './creative/PipelineSpine.vue';
import HeroEngine from './creative/HeroEngine.vue';
import TechMarquee from './creative/TechMarquee.vue';
import WorkRail from './creative/WorkRail.vue';
import CapabilityGraph from './creative/CapabilityGraph.vue';
import LogTerminal from './creative/LogTerminal.vue';
import ContactOutput from './creative/ContactOutput.vue';

const booting = ref(true);
const ready = ref(false);

const onBooted = () => {
  booting.value = false;
  ready.value = true;
  document.documentElement.style.overflow = '';
  ScrollTrigger.refresh();
};

onMounted(() => {
  // A deep link straight into a case study skips the boot sequence
  if (location.hash.startsWith('#work/')) return onBooted();
  document.documentElement.style.overflow = 'hidden';
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
});
</script>

<template>
  <Preloader v-if="booting" @done="onBooted" />
  <SignalCursor />
  <NavBar />
  <PipelineSpine />

  <main class="grain relative">
    <HeroEngine :bio="portfolioData.heroBio" :ready="ready" />
    <TechMarquee />
    <WorkRail :projects="portfolioData.projects" />
    <CapabilityGraph />
    <LogTerminal
      :about="portfolioData.aboutText"
      :resumeUrl="portfolioData.resumeUrl"
      :linkedin="portfolioData.linkedin"
    />
    <ContactOutput
      :name="portfolioData.name"
      :email="portfolioData.email"
      :linkedin="portfolioData.linkedin"
      :location="portfolioData.location"
      :web3formsKey="portfolioData.web3formsKey"
    />
  </main>
</template>
