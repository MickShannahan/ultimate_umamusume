<script setup>
import CharacterSelect from '@/components/CharacterSelect.vue'

import RacerElm from '@/components/Racer.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { logger } from '@/utils/Logger.js'
import { Racer } from '@/models/Racer.js'
import { RaceState } from '@/AppState.js'
import { seconds } from '@/utils/Timer.js'
import RaceMiniMap from '@/components/RaceMiniMap.vue'



const finishedRacers = ref([])

const racers = computed(() => RaceState.racers)
const currentlyRacing = ref(false)

const trackLength = 400
const raceTimer = ref(0)

const raceLanes = racers.value.length

const raceTrackElm = useTemplateRef('race-track')
let cameraX = ref(0)

const racersElms = ref([])


function startRace() {
  resetRace()
  currentlyRacing.value = true
  setTimeout(runRacers, 1000)
}

function resetRace() {
  finishedRacers.value = []
  currentlyRacing.value = false
  logger.log(racers.value)
  racers.value.forEach(racer => {
    racer.resetStats()
  })
}

function forceBurst() {
  RaceState.racers.forEach(r => r.enterBurst())
}

let gameSpeed = ref(1)

async function runRacers(ticksPerSecond = 60) {
  let tickInterval = 1 * seconds / ticksPerSecond
  let prevTime = performance.now()

  while (currentlyRacing.value) {
    let currentTime = performance.now()
    let delta = ((currentTime - prevTime) / (1 * seconds) * gameSpeed.value)
    prevTime = currentTime

    const racersSorted = RaceState.racers.toSorted((ar, br) => br.position - ar.position)
    RaceState.racers.forEach((racer, i) => racer.run(delta, i + 1))

    const elapsed = performance.now() - currentTime;
    raceTimer.value += Math.floor(elapsed * delta * seconds)
    const waitTime = Math.max(0, tickInterval - elapsed);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    checkForRaceEnd()
    scrollRacerToView(racersSorted[0], delta * gameSpeed.value)
  }
  logger.log('Race Ended')
}

function onRacerFinished(racer) {
  finishedRacers.value.push(racer)
}

function checkForRaceEnd() {
  if (finishedRacers.value.length == RaceState.racers.length) {
    currentlyRacing.value = false
  }
}

/** @argument {Racer} racer */
function scrollRacerToView(racer, deltaTime) {
  const CM_TO_PX = 37.7952755906
  const racerPosPx = racer.position * CM_TO_PX;

  const screenWidth = window.innerWidth;
  const targetX = racerPosPx - screenWidth / 2;

  const trackLengthPx = (trackLength + 5) * CM_TO_PX;
  const clampedX = Math.max(0, Math.min(targetX, trackLengthPx - screenWidth));

  const followSpeed = 5;
  const delta = clampedX - cameraX.value;
  cameraX.value += delta * (1 - Math.exp(-followSpeed * deltaTime));
}




</script>


<template>

  <section class="race-grid">
    <div class="track-info p-3">
      <div class="d-flex gap-1">
        <button class="btn btn-primary" @click="startRace">Start Race!</button>
        <button class="btn btn-teal" @click="resetRace">Reset Race</button>
        <button class="btn btn-orange" @click="forceBurst">🔥Burst!</button>
        <input v-model="gameSpeed" type="number" class="form-control" style="width: 8ch;" step=".25">
      </div>
      <span v-for="(racer, n) in finishedRacers" :key="`finished-racer-${racer.name}`" class="me-2">
        #{{ n + 1 }} {{ racer.name }}
      </span>
      ⏱️{{ raceTimer }}
      <div></div>
      <RaceMiniMap :racers :trackLength />
    </div>

    <div class="race-track" ref="race-track" :style="`--camera-x-position: -${cameraX}px;`">
      <div class="d-flex">
        <div class="tracks">
          <div class="fence"></div>
          <div v-for="(lane, n) in raceLanes" :key="`race-lane-${lane}`" :class="`race-lane ${racers[n].name}`">
            <RacerElm :racer="racers[n]" :trackLength @racer:finished="onRacerFinished" />
            <!-- :ref="(el) => { if (el && racers[n]) racersElms[n] = el }" -->
          </div>
          <div class="fence"></div>
          <div class="d-flex flex-row-reverse justify-content-between text-light opacity-50">
            <div class="distance-marker p-1"><i class="mdi mdi-flag-checkered"></i></div>
            <div class="distance-marker p-1" v-for="(num) in Math.round(trackLength / 20)">{{ num * 20 == 0 ? '' : num *
              20 }}
            </div>
          </div>
        </div>
        <div class="finish-line"></div>
      </div>
    </div>

    <div class="menu-bar">
      <button class="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#character-select-menu">
        Character Select<i class="mdi mdi-menu"></i>
      </button>
    </div>
  </section>

  <CharacterSelect />

</template>


<style lang="scss" scoped>
.race-grid {
  height: var(--main-height);
  display: grid;
  grid-template-rows: 100px 1fr 50px;
  background-color: var(--bs-success);
  background-image: url("https://www.transparenttextures.com/patterns/darth-stripe.png");
  background-size: 25%;

  --sprite-size: 100px;
}


.track-info {}

.race-track {
  --track-length: calc(v-bind(trackLength) *1cm);
  position: relative;
  display: flex;
  padding: 25px;
  align-items: center;
  width: 100%;
  overflow-x: hidden;


  .tracks {
    transform: translateX(var(--camera-x-position));
    position: relative;
    z-index: 99;
    --track-height: calc(var(--sprite-size) / 2);
    --track-gap: var(--track-gap, 5px);
    display: grid;
    padding: 10px;
    flex-grow: 1;
    // transition: transform .2s linear;
    gap: var(--track-gap);
    grid-auto-rows: var(--track-height);

    // background-image: url("https://www.transparenttextures.com/patterns/black-felt.png");
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-image: url("https://www.transparenttextures.com/patterns/black-felt.png");
      mix-blend-mode: exclusion;
      opacity: .25;
      border-radius: 10px;
    }

    .race-lane {
      --track-offset: calc(var(--sprite-size) / 2);
      width: calc(var(--track-length) + var(--track-offset));
      margin-top: calc(var(--track-height) - var(--sprite-size));
      border-bottom: 1px dashed rgba(255, 255, 255, 0.25);
    }

  }

  .finish-line {
    position: relative;
    right: 0;
    transform: translateX(var(--camera-x-position));
    width: 45px;
    background-image: linear-gradient(black 50%, white 50%), linear-gradient(white 50%, black 50%), linear-gradient(black 50%, white 50%);
    background-size: 15px 25px, 15px 25px, 15px 25px;
    background-position: 0px 0px, 15px 25px, 30px 25px;
    background-repeat: repeat-y;
    mix-blend-mode: soft-light;
  }

  .fence {
    height: 16px;
    width: 100%;
    background-image: url(@/assets/img/fence_post.png);
    background-size: 16px;
    filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, .2)) // position: absolute;
      // left: 0;
      // top: -16px;
  }
}

.menu-bar {}
</style>