<script setup>
import { Uma } from '@/models/Uma.js';

const props = defineProps({ uma: { type: Uma, required: true } })
defineEmits(['selected'])
</script>


<template>
  <div class="uma-card" @click="$emit('selected', uma.id)"
    :style="`--uma-bg: url(${uma.snsIcon}); --uma-color: ${uma.colorMain}; --uma-color-2: ${uma.colorSub};`">
    <div class="img-wrapper">
      <img :src="uma.snsIcon" alt="">
    </div>
    <span>
      {{ uma.nameEn }}
      <i class="mdi mdi-star-shooting fs-5" style="color: var(--uma-color-2)"></i>
    </span>
  </div>
</template>


<style lang="scss" scoped>
.uma-card {
  display: block;
  width: 100%;
  height: 50px;
  background-color: white;
  position: relative;
  z-index: 999;
  // background-image: var(--uma-bg);
  background-repeat: no-repeat;
  font-weight: bold;
  display: flex;
  align-items: center;
  transform: skew(-25deg);
  overflow: hidden;
  background-image: linear-gradient(90deg, white 138px, var(--uma-color) 138px);
  border-left: 15px solid var(--uma-color-2);
  transition: .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  .img-wrapper {
    height: 100%;
  }

  .img-wrapper::after {
    display: inline-block;
    content: '';
    position: relative;
    height: 100%;
    width: 20px;
    background-image: linear-gradient(90deg, transparent, var(--uma-color) 80%);
  }

  img {
    position: relative;
    top: -21px;
    height: 100%;
    width: 120px;
    transform: skew(25deg);
    object-fit: cover;
  }

  >span {
    transform: skew(25deg);
    color: white;
  }

  &:hover {
    transform: skew(-25deg) translateX(-10px) scale(1.1);
    filter: brightness(1.1) drop-shadow(0px 0px 6px var(--uma-color));
    cursor: pointer;
  }
}
</style>