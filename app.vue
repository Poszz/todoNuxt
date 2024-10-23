<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout/>
    <Button>Click Me</Button>
    <range-calendar />
      <badge>Badge</badge>
      
  </div>


</template>
