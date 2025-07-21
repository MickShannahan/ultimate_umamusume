<script setup>
import { RaceState } from '@/AppState.js';
import { Racer } from '@/models/Racer.js';
import { logger } from '@/utils/Logger.js';
import { computed, watch, ref, useTemplateRef } from 'vue';

const {racer, trackLength} = defineProps({ racer: { type: Racer }, trackLength: Number })
defineExpose({  })
const emit = defineEmits(['racer:finished'])


const spriteElm = useTemplateRef('racer-sprite')
const distance = ref(0)
const distanceRan = computed(() => racer.position + 'cm')
const finished = ref(false)
const speedBurst = ref(false)


watch(()=> racer.position, ()=>{

  if(finished.value)return
  if(racer.position >= trackLength){
    racerFinished()
  }
  
  speedEffects(racer.velocity)
})

function speedEffects(currentSpeed) {
  if (racer.velocity > 9) {
    logger.log('🌨️')
    createLineEffect(500, 100, 100)
  } 
  else if (racer.velocity > 6) {
    createDustEffect(500, 600, 75)
  }
}

function createDustEffect(duration = 500, ttl = 200, delay = 50) {
  if (duration <= 0) return
  const dustParticle = document.createElement('i')
  dustParticle.classList.add('dust')
  // @ts-ignore
  dustParticle.addEventListener('animationend', (ev) => ev.target.remove())
  dustParticle.style = `--rand-deg: ${Math.random() * 25}deg; --ttl: ${ttl}ms;`
  spriteElm.value.parentElement.appendChild(dustParticle)
  setTimeout(() => {
    createDustEffect(duration - delay, ttl, delay)
  }, delay)
}

function createLineEffect(duration = 500, ttl = 200, delay = 50) {
  if (duration <= 0) return
  const dustParticle = document.createElement('i')
  dustParticle.classList.add('line')
  // @ts-ignore
  dustParticle.addEventListener('animationend', (ev) => ev.target.remove())
  dustParticle.style = `--rand-h: ${Math.random() * 45 + 15}px; --ttl: ${ttl}ms;`
  spriteElm.value.parentElement.appendChild(dustParticle)
  setTimeout(() => {
    createLineEffect(duration - delay, ttl, delay)
  }, delay)
}

function racerFinished() {
  emit('racer:finished', racer)
  finished.value = true
  const racerRef = RaceState.racers.find(r => r == racer)
  racerRef.position = trackLength + 1
}

</script>


<template>
  <div v-if="racer" class="sprite-wrapper" :id="'racer-'+racer.id">
    <div class="debug"><i class="mdi mdi-horseshoe"></i>{{ racer.velocity.toFixed(1) }}  <i class="mdi mdi-heart"></i>{{ racer.staminaLeft.toFixed(1) }} 
      <span v-if="racer.inRecovery">💚</span>
      <span v-if="racer.inBurst">🔥</span>
    </div>
    <img ref="racer-sprite" :src="racer.sprite" alt="racer icon" class="racer-sprite" :class="{ finished, speedBurst }">
  </div>
</template>


<style lang="scss">
div.debug {
  position: absolute;
  font-size: 11px;
  color: white;
}

.sprite-wrapper {
  height: var(--sprite-size);
  width: var(--sprite-size);
  margin-left: v-bind(distanceRan);
  transition: margin-left .25s linear;
  position: relative;
}

.racer-sprite {
  transform: scaleX(-1);
  width: 100%;
  height: auto;
}

.racer-sprite.finished {
  animation: bounce-img .5s ease-in-out infinite;
}

i.dust {
  display: inline-block;
  height: 5px;
  width: 5px;
  background-color: rgb(196, 255, 173);
  border-radius: 50%;
  position: absolute;
  animation: dust var(--ttl) ease-out;
  bottom: 2px;
  left: calc(var(--sprite-size) / 2);
}

i.line {
  display: inline-block;
  height: 1px;
  width: 10px;
  background-color: rgba(255, 255, 255, 0.678);
  position: absolute;
  animation: lines var(--ttl) linear;
  bottom: var(--rand-h);
  left: calc(var(--sprite-size) /3);
}

@keyframes dust {
  0% {
    transform: scale(0) rotate(var(--rand-deg)) translate(0px, 0px);
    opacity: 1;
  }

  90% {
    transform: scale(2) rotate(var(--rand-deg)) translate(-25px, -3px);
    opacity: .5;
  }

  100% {
    opacity: 0;
  }

}

@keyframes lines {
  0% {
    transform: scaleX(1) translate(0px, 0px);
    opacity: 1;
  }

  99% {
    transform: scaleX(1.2) translate(-35px, 0px);
    opacity: .5;
  }

  100% {
    transform: scaleX(1.2) translate(-35px, 0px);
    opacity: 0;
  }

}
</style>