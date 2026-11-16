<script setup>
import { portfolioData } from './portfolio-data';
import Navbar from './components/Navbar.vue';
import HeroSection from './components/HeroSection.vue';
import SelectedWork from './components/SelectedWork.vue';
import LabsCarousel from './components/LabsCarousel.vue';
import AboutSection from './components/AboutSection.vue';
import ContactFooter from './components/ContactFooter.vue';
</script>

<template>
  <main class="relative font-sans text-ink dark:text-white bg-white dark:bg-ink min-h-screen selection:bg-accent selection:text-ink transition-colors duration-500 overflow-x-hidden">
    <!-- Navigation header bar -->
    <Navbar :name="portfolioData.name" />

    <!-- Hero banner section with animated waves -->
    <HeroSection 
      :headline="portfolioData.headline"
      :subHeadline="portfolioData.subHeadline"
      :heroBio="portfolioData.heroBio"
    />

    <!-- Selected case studies -->
    <SelectedWork :projects="portfolioData.projects" />

    <!-- Snippets and side applications list -->
    <LabsCarousel :labs="portfolioData.labs" />

    <!-- About bio descriptions and pills -->
    <AboutSection 
      :aboutHeadline="portfolioData.aboutHeadline"
      :aboutText="portfolioData.aboutText"
      :statusBadges="portfolioData.statusBadges"
      :resumeUrl="portfolioData.resumeUrl"
      :linkedin="portfolioData.linkedin"
    />

    <!-- Contact mail triggers and location metadata -->
    <ContactFooter 
      :name="portfolioData.name"
      :email="portfolioData.email"
      :linkedin="portfolioData.linkedin"
      :github="portfolioData.github"
      :location="portfolioData.location"
      :web3formsKey="portfolioData.web3formsKey"
    />
  </main>
</template>
