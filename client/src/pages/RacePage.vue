<script setup>
import CharacterSelect from '@/components/CharacterSelect.vue'
import speImg from '../../../imageData/imagesClean/01_specialweek_clean.webp'
import maruImg from '../../../imageData/imagesClean/04_maruzensky_clean.webp'
import taikiImg from '../../../imageData/imagesClean/10_taikishuttle_clean.webp'
import inesImg from '../../../imageData/imagesClean/32_inesfujin_clean.webp'
import eishinImg from '../../../imageData/imagesClean/37_eishinflash_clean.webp'
import RacerElm from '@/components/Racer.vue'
import { onMounted, ref, useTemplateRef } from 'vue'
import { logger } from '@/utils/Logger.js'
import { Racer } from '@/models/Racer.js'

const racers = [
  new Racer({ name: 'special week', sprite: speImg, stats: { speed: 120, power: 10, stamina: 20 } }),
  new Racer({ name: 'marunzensky', sprite: maruImg, stats: { speed: 50, power: 50, stamina: 50 } }),
  new Racer({ name: 'taiki shuttle', sprite: taikiImg, stats: { speed: 50, power: 20, stamina: 80 } }),
  new Racer({ name: 'ines fujin', sprite: inesImg, stats: { speed: 80, power: 38, stamina: 32 } }),
  // new Racer({ name: 'eishin flash', sprite: eishinImg, stats: { speed: 50, power: 50, stamina: 25 } }),
]

const finishedRacers = ref([])


const trackLength = 150

const raceLanes = racers.length

const racersElms = ref([])

let runLoop = null

function startRace() {
  finishedRacers.value = []
  runLoop = setInterval(runRacers, 250)
}

function runRacers() {
  racersElms.value.forEach(r => r.run())
}

function onRacerFinished(racer) {
  finishedRacers.value.push(racer)
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
          <div v-for="(lane, n) in raceLanes" :key="`race-lane-${lane}`" class="race-lane" ref="racers">
            <RacerElm :racer="racers[n]" :ref="(el) => { if (el && racers[n]) racersElms[n] = el }" :trackLength
              @racer:finished="onRacerFinished" />
          </div>
        </div>
        <div class="finish-line"></div>
      </div>
    </div>

    <div class="menu-bar">
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#character-select-menu">
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