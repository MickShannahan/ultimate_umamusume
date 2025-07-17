<script setup>
import { Racer } from '@/models/Racer.js';
import { logger } from '@/utils/Logger.js';
import { computed, reactive, ref, useTemplateRef } from 'vue';

const props = defineProps({ racer: { type: Racer }, trackLength: Number })
defineExpose({ run })
const emit = defineEmits(['racer:finished'])

const racerState = reactive({
  ...props.racer.stats,
  currentSpeed: 0,
  inRecovery: false
})

const spriteElm = useTemplateRef('racer-sprite')
const distance = ref(0)
const distanceRan = computed(() => distance.value + 'cm')
const finished = ref(false)
const speedBurst = ref(false)

function run() {
  if (finished.value) return
  if (distance.value >= props.trackLength) {
    logger.log('🏁🏇', props.racer.name,)
    finished.value = true
    distance.value = props.trackLength + 1.5;
    emitFinished()
    return
  }

  if (racerState.currentSpeed == 0) {
    const gateStartPower = racerState.power / 8 + Math.random() * 2
    racerState.currentSpeed += Math.trunc(gateStartPower)

  } else if (racerState.currentSpeed < racerState.speed && racerState.stamina > 0) {
    const accelPower = racerState.power / 20
    racerState.currentSpeed += accelPower

  }

  if (racerState.stamina > props.racer.stats.stamina * .75) {
    racerState.inRecovery = false

  } else if (racerState.stamina <= 0) {
    racerState.inRecovery = true
  }


  if (racerState.inRecovery) {
    racerState.currentSpeed -= props.racer.stats.speed * .085
    racerState.currentSpeed = Math.max(racerState.currentSpeed, racerState.speed / 3)
  }

  let randomVariance = Math.random() * .5
  let distanceToMove = racerState.currentSpeed / 50 + randomVariance
  distance.value += distanceToMove
  racerState.stamina -= racerState.inRecovery ? props.racer.stats.stamina * -.05 : (distanceToMove)

  speedEffects(racerState.currentSpeed)
}

function speedEffects(currentSpeed) {
  const characterSpeed = props.racer.stats.speed
  if (currentSpeed > characterSpeed / 1.5) {
    logger.log('🌨️')
    createLineEffect(500, 100, 100)
  } else if (currentSpeed > characterSpeed / 2) {
    createDustEffect(500, 600, 75)
  }
}

function createDustEffect(duration = 500, ttl = 200, delay = 50) {
  if (duration <= 0) return
  const dustParticle = document.createElement('i')
  dustParticle.classList.add('dust')
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
  dustParticle.addEventListener('animationend', (ev) => ev.target.remove())
  dustParticle.style = `--rand-h: ${Math.random() * 45 + 15}px; --ttl: ${ttl}ms;`
  spriteElm.value.parentElement.appendChild(dustParticle)
  setTimeout(() => {
    createLineEffect(duration - delay, ttl, delay)
  }, delay)
}

function emitFinished() {
  emit('racer:finished', props.racer)
}

</script>


<template>
  <div v-if="racer" class="sprite-wrapper">
    <div class="debug">{{ racerState.currentSpeed }} {{ racerState.stamina }} <span
        v-if="racerState.inRecovery">💚</span></div>
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
  transition: margin-left .5s linear;
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