<template>
  <main>
    <PageHeader 
      title="Nossos Planos" 
      subtitle="Encontre a opção perfeita para sua jornada no tatame." 
    />
    
    <PrecoSection />
    
    <FaqSection />
    
    <AcaoSection @openTrialModal="$emit('openTrialModal')" />
  </main>
</template>

<script setup>
import PageHeader from '@/components/PageHeader.vue';
import FaqSection from '@/components/FaqSection.vue';
import PrecoSection from '@/components/PrecoSection.vue';
import AcaoSection from '@/components/CtaSection.vue';

defineEmits(['openTrialModal']);
</script>