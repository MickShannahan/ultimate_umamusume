<script setup>
import { AppState } from '@/AppState.js';
import ActiveUma from '@/components/ActiveUma.vue';
import UmaCard from '@/components/UmaCard.vue';
import { umasService } from '@/services/UmasService.js';
import { logger } from '@/utils/Logger.js';
import { Pop } from '@/utils/Pop.js';
import { computed, onMounted } from 'vue';


const umas = computed(() => {
  let umas = [...AppState.umas]
  umas.sort((ua, ub) => {
    if (AppState.favorites.includes(ua.id)) return -1
    return 0
  })
  return umas
})

onMounted(getAllUmas)

async function getAllUmas() {
  try {
    await umasService.getUmas()
  } catch (error) {
    Pop.error(error, "Could not get Umas 🥲")
    logger.error(error)
  }
}

async function getOneUma(umaId) {
  try {
    await umasService.getOneUma(umaId)
  } catch (error) {
    Pop.error(error, "Could not get Uma")
    logger.error(error)
  }
}

</script>

<template>
  <section class="uma-grid">
    <ActiveUma />
    <div class="uma-list">
      <TransitionGroup name="list">
        <div v-for="uma in umas" :key="`uma-card-${uma.id}`">
          <UmaCard :uma @selected="getOneUma" />
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped lang="scss">
.uma-grid {
  margin-inline: auto;
  height: 100%;
  display: grid;
  grid-template-rows: var(--main-height);
  grid-template-columns: 1fr 450px;
  padding: 0 1rem;
}

.uma-list {
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: .75em;
  padding: 1em;
  padding-left: 3em;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}

.list-leave-to,
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-from,
.list-enter-to {
  opacity: 1;
  transform: translateX(0);
}


.list-move {
  transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
