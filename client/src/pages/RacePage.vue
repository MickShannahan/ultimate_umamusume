<script setup>
import CharacterSelect from '@/components/CharacterSelect.vue'

import RacerElm from '@/components/Racer.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { logger } from '@/utils/Logger.js'
import { Racer } from '@/models/Racer.js'
import { RaceState } from '@/AppState.js'
import { seconds } from '@/utils/Timer.js'



const finishedRacers = ref([])

const racers = computed(()=> RaceState.racers)
const currentlyRacing = ref(false)

const trackLength = 150

const raceLanes = racers.value.length

const racersElms = ref([])

let runLoop = null

function startRace() {
  finishedRacers.value = []
  currentlyRacing.value = true
  logger.log(racers.value)
  racers.value.forEach(racer => {
    racer.resetStats()
  })
  setTimeout(runRacers, 1000)
}

async function runRacers(ticksPerSecond = 5 ) {
let tickInterval =  1 * seconds / ticksPerSecond
let prevTime = performance.now()

  while(currentlyRacing.value){
    let currentTime = performance.now()
    let delta = (currentTime - prevTime) / (1*seconds)
    prevTime = currentTime
    
    RaceState.racers.forEach(racer => racer.run(delta))
    
    const elapsed = performance.now() - currentTime;
    const waitTime = Math.max(0, tickInterval - elapsed);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    checkForRaceEnd()
  }
  logger.log('Race Ended')
}

function onRacerFinished(racer) {
  finishedRacers.value.push(racer)
}

function checkForRaceEnd(){
  if(finishedRacers.value.length == RaceState.racers.length){
    currentlyRacing.value = false
  }
}




</script>


<template>

  <section class="race-grid">
    <div class="track-info">
      <div><button class="btn btn-primary" @click="startRace">Start Race!</button></div>
      <span v-for="(racer, n) in finishedRacers" :key="`finished-racer-${racer.name}`" class="me-2">
        #{{ n + 1 }} {{ racer.name }}
      </span>
    </div>

    <div class="race-track">
      <div class="d-flex">
        <div class="tracks">
          <div v-for="(lane, n) in raceLanes" :key="`race-lane-${lane}`" :class="`race-lane ${racers[n].name}`" >
            <RacerElm :racer="racers[n]"  :trackLength
              @racer:finished="onRacerFinished" />
              <!-- :ref="(el) => { if (el && racers[n]) racersElms[n] = el }" -->
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
  display: flex;
  padding: 25px;
  align-items: center;
  width: 100%;
  overflow-x: auto;

  .tracks {
    position: relative;
    z-index: 99;
    --track-height: calc(var(--sprite-size) / 2);
    display: grid;
    flex-grow: 1;
    grid-auto-rows: var(--track-height);
    background-image: url("https://www.transparenttextures.com/patterns/black-felt.png");

    .race-lane {
      --track-offset: calc(var(--sprite-size) / 2);
      width: calc(var(--track-length) + var(--track-offset));
      margin-top: calc(var(--track-height) - var(--sprite-size));
      border-bottom: 1px dashed rgba(255, 255, 255, 0.25);
    }

  }

  .finish-line {
    width: 45px;
    background-image: linear-gradient(black 50%, white 50%), linear-gradient(white 50%, black 50%), linear-gradient(black 50%, white 50%);
    background-size: 15px 25px, 15px 25px, 15px 25px;
    background-position: 0px 0px, 15px 25px, 30px 25px;
    background-repeat: repeat-y;
    mix-blend-mode: soft-light;
  }
}

.menu-bar {}
</style>