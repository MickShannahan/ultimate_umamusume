<script setup>
import { Sprite } from '@/models/Sprite.js';
import { seconds } from '@/utils/Timer.js';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const { sprite, facingRight, classList, speed } = defineProps({
  sprite: Sprite,
  speed: { type: Number, defualt: 1 },
  facingRight: { type: Boolean, default: false },
  classList: Array,
  filter: Array
})

const currentFrame = ref(0)
const currentSpritePosition = ref(0)

const spriteSize = computed(() => (100 / sprite.frameCount) * 100)
const flipSprite = computed(() => facingRight ? 1 : -1)
const transformProperties = computed(() => {
  let out = `scaleX(${flipSprite.value})`
  return out
})


function initAnimation() {
  currentFrame.value = 0
}

onMounted(initAnimation)

function advanceFrame() {

}

</script>


<template>
  <!-- <img :class="classList" :src="sprite.sprite" :style="`filter: ${filterProperties}`" :height="sprite.height || 'auto'"
    :width="sprite.width || 'auto'"> -->
  <div class="sprite-animator text-end" :style="`
      transform: ${transformProperties};
      --sprite-img: url(${sprite.sprite});
      --sprite-fps: ${Math.floor((seconds) / (sprite.fps * speed)) * 10 || 1}ms;
      --sprite-frame: -${currentSpritePosition}%; 
      --sprite-frame-end: -${100 * sprite.frameCount}%; 
      --sprite-size: ${spriteSize}%;
      `" :class="classList">

  </div>
  <span class="debug">{{ speed.toFixed(1) }}</span>
</template>


<style lang="scss" scoped>
.sprite-animator {
  width: 100%;
  height: 100%;
  background: var(--sprite-img);
  background-position: var(--sprite-frame);
  background-size: var(--sprite-size);
  object-fit: contain;
  animation: animate-sprite var(--sprite-fps) steps(v-bind('sprite.frameCount')) infinite;
}

.debug {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999999;
  cursor: pointer;

  &:hover {
    background-color: var(--bs-primary);
  }
}

@keyframes animate-sprite {
  from {
    background-position: 0%;
  }

  to {
    background-position: var(--sprite-frame-end);
  }
}
</style>