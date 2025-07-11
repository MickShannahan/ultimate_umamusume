<script setup>
import { AppState } from '@/AppState.js';
import { umasService } from '@/services/UmasService.js';
import { logger } from '@/utils/Logger.js';
import { computed, ref, useTemplateRef, watch, nextTick } from 'vue';


const uma = computed(() => AppState.activeUma)
const isFavorite = computed(() => AppState.favorites.includes(uma.value?.id))

const audioElm = useTemplateRef('voice')

const imageLoaded = ref(false)
const allImages = computed(() => uma.value.allImages)
const activeImage = ref(null)

const showInfo = ref(false)

const isBouncing = ref(false)

watch(uma, () => {
  imageLoaded.value = false
  activeImage.value =
    allImages.value.racingOutfit ||
    allImages.value.uniform ||
    allImages.value.conceptArt ||
    allImages.value.startingFuture ||
    allImages.value.default
  setTimeout(() => {
    audioElm.value.play()
  }, 100)

  document.body.parentElement.style = `--uma-color-2: ${uma.value.colorSub};`
})

function bounceImage() {
  logger.log('⚽')
  isBouncing.value = false
  audioElm.value.play()
  nextTick(() => {
    isBouncing.value = true
  })
}

function handleAnimationEnd() {
  isBouncing.value = false
}

function changeImage(image) {
  logger.log('changing to', image)
  if (activeImage.value == image) return
  imageLoaded.value = false
  activeImage.value = image
}

function favoriteUma() {
  umasService.favoriteUma(uma.value.id)
}

</script>


<template>
  <transition name="active-transition">
    <section :key="uma.id" class="active-grid" v-if="uma"
      :style="`--uma-color: ${uma.colorMain}; --uma-color-2: ${uma.colorSub}`">

      <section class="uma-img" @animationend="handleAnimationEnd"
        :style="`--bg-url: url(${uma.pictures.conceptArt[0] || uma.pictures.racingOutfit[0] || uma.pictures.uniform[0] || uma.pictures.startingFuture[0]});`">
        <img @load="imageLoaded = true" :src="activeImage?.url" :class="{ 'loaded': imageLoaded, 'bounce': isBouncing }"
          @click="bounceImage">
      </section>

      <section class="row uma-name">
        <div class="angled-box rounded p-1 px-3 bg-uma shadow-sm d-flex justify-content-between">
          <h2 class="fw-bold text-outline">{{ uma.nameEn }} <i class="mdi mdi-circle-small"></i> {{ uma.nameJp }}</h2>
          <span role="button" @click="favoriteUma">
            <i v-if="isFavorite" class="text-white mdi mdi-star fs-3"></i>
            <i v-else class="text-white mdi mdi-star-outline fs-3"></i>
          </span>
        </div>
        <span class="slogan bg-white rounded">{{ uma.slogan }}</span>
      </section>

      <section class="uma-stats text-dark" :class="{ hide: showInfo }">
        <span class="toggle-button" @click="showInfo = !showInfo"><i class="mdi mdi-eye"></i></span>

        <article class="uma-card bg-white rounded">
          <div class="card-header bg-uma d-flex text-white ">
            <span class="d-flex gap-1 ms-2">
              <i role="button" @click="changeImage(image)" v-for="(image, key) in allImages" :key
                :class="`mdi mdi-tshirt-v${image == activeImage ? '' : '-outline'}`"></i>
            </span>
            <span class="ms-2">
              {{ activeImage?.text }}
            </span>
          </div>
          <div class="card-text p-2">
            <section class="row">
              <div class="col-md-6">
                <div>
                  <b class="me-2">Strengths:</b>
                  <span>{{ uma.strengths }}</span>
                </div>
                <div>
                  <b class="me-2">Weaknesses:</b>
                  <span>{{ uma.weaknesses }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div>
                  <b class="me-2">Birthday:</b><span>{{ uma.birthMonth }}/{{ uma.birthDay }}</span>
                </div>
                <div>
                  <b class="me-2">School:</b><span>{{ uma.grade }}/{{ uma.residence }}</span>
                </div>
              </div>
            </section>
            <div class="card-text">
              {{ uma.profile }}
            </div>
          </div>
        </article>
      </section>
      <audio ref="voice" :src="uma.voice"></audio>
    </section>
    <section class="active-grid" v-else>

    </section>
  </transition>
</template>


<style lang="scss">
:root {
  --site-bg-color: var(--uma-color-2) !important;
}

.active-grid {
  height: var(--main-height);
  display: grid;
  grid-template-rows: 100px 1fr 200px;
  grid-template-columns: 100%;
  padding: 3rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-uma {
  background-color: var(--uma-color);
}

.uma-name {
  display: flex;
  align-items: start;
  justify-content: start;
  grid-area: 1/1 / 2/2;
  max-width: 70ch;
  justify-self: center;

  filter: drop-shadow(4px 4px 0px var(--uma-color-2));

  .slogan {
    margin-top: -28px;
    width: auto;
    position: relative;
  }
}

.uma-img {
  grid-area: 1 / 1 / 4 / 2;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
  opacity: 0;
  overflow: hidden;

  &:has(.loaded.bounce) {
    transform-origin: bottom;
    animation: bounce-img 1.5s ease-in-out;
  }

  &:has(.loaded) {
    opacity: 1;
    transition: opacity 0s ease .1s;
  }

  @keyframes bounce-img {
    0% {
      transform: translateY(0) scale3d(1, 1, 1);
    }

    10% {
      transform: translateY(0) scale3d(1.1, 0.9, 1);
    }

    20% {
      transform: translateY(-30px) scale3d(0.9, 1.1, 1);
    }

    30% {
      transform: translateY(-60px) scale3d(1.15, 0.85, 1);
    }

    50% {
      transform: translateY(0) scale3d(0.95, 1.05, 1);
    }

    65% {
      transform: translateY(-15px) scale3d(1.05, 0.95, 1);
    }

    75% {
      transform: translateY(0) scale3d(0.98, 1.02, 1);
    }

    85% {
      transform: translateY(-5px) scale3d(1.02, 0.98, 1);
    }

    100% {
      transform: translateY(0) scale3d(1, 1, 1);
    }
  }

  img {
    object-fit: contain;
    object-position: center;
    height: 110%;
    width: 100%;
    position: relative;
    top: -10%;
    opacity: 1;
    // filter: drop-shadow(0px 0px 4px black);
    transition: all .3s ease;
    filter: brightness(1) drop-shadow(2px 0px 0px white) drop-shadow(-10px 0px 0px white) drop-shadow(-15px 0px 0px var(--uma-color)) drop-shadow(0px 0px 5px var(--shadow-color));
    transform: translateX(0);

    &.loaded {
      // opacity: 1;
      animation: load-img .5s cubic-bezier(0.175, 0.885, 0.32, 1.275) .1s forwards;
    }
  }
}

.uma-stats {
  // grid-row: 3/4;
  grid-area: 3/1 / 4/2;
  place-self: center;
  position: relative;
  max-width: 60ch;
  justify-self: center;

  .uma-card {
    position: relative;
    box-shadow: 4px 4px 0px var(--uma-color-2), 0px 2px 4px var(--shadow-color);
    overflow: hidden;
    width: 100%;
    animation: grow-card .2s ease forwards;



    .card-header {
      padding: .25em .5em;
    }
  }

  .toggle-button {
    position: absolute;
    z-index: 999;
    top: .25em;
    right: .5em;
    cursor: pointer;
    color: white;
    padding: .1em .45em;
    display: flex;
  }

  &.hide {
    .uma-card {
      animation: shrink-card .2s ease forwards;
    }

    .toggle-button {
      background-color: var(--uma-color);
      border-radius: 8px;
      box-shadow: 4px 4px 0px var(--uma-color-2), 0px 2px 4px var(--shadow-color);
    }
  }
}


@keyframes load-img {
  0% {
    opacity: 0;
    filter: brightness(0) drop-shadow(2px 2px 0px white) drop-shadow(-200px 0px 0px white) drop-shadow(-300px 0px 0px var(--uma-color)) drop-shadow(3px 0px 0px white);
    transform: translateX(-300px);
  }

  20% {
    opacity: 0;
    filter: brightness(0) drop-shadow(2px 2px 0px white) drop-shadow(-160px 0px 0px white) drop-shadow(-140px 0px 0px var(--uma-color)) drop-shadow(3px 0px 0px white);
    transform: translateX(-140px);
  }

  100% {
    opacity: 1;
    filter: brightness(1) drop-shadow(2px 0px 0px white) drop-shadow(-10px 0px 0px white) drop-shadow(-15px 0px 0px var(--uma-color)) drop-shadow(0px 0px 5px var(--shadow-color));
    transform: translateX(0);
  }
}

@keyframes shrink-card {
  0% {
    opacity: 1;
    transform: scaleX(1);
    transform-origin: right;
  }

  100% {
    opacity: .5;
    transform: scaleX(0);
    transform-origin: right;
  }
}

@keyframes grow-card {

  0% {
    opacity: .5;
    transform: scaleX(0);
    transform-origin: right;
  }

  100% {
    opacity: 1;
    transform: scaleX(1);
    transform-origin: right;
  }
}

.active-transition-enter-active,
.active-transition-leave-active {
  transition: all .2s cubic-bezier(0.55, 0, 0.1, 1);
  // position: absolute;
}

.active-transition-leave-to,
.active-transition-enter-from {
  transform: translateX(-50%);
  opacity: 0;
}

.active-transition-leave-from,
.active-transition-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
</style>