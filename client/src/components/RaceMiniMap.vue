<script setup>
import { computed } from 'vue';

const { racers, trackLength } = defineProps({ racers: { type: Array, default: () => [] }, trackLength: { type: Number, default: 1 } })

function calculatPercent(position) {
  return ((position / trackLength) * 100) + '%'
}

</script>


<template>
  <div class="px-3">
    <div class="mini-map my-2">
      <span v-for="racer in racers" :key="`mini-map-dot-${racer.id}`" class="racer-dot"
        :style="`--calculated-distance: ${calculatPercent(racer.position)}; --dot-color: ${racer.color1 || 'rgba(255,255,255,0.25)'}`"></span>
      <div class="d-flex justify-content-between">
        <span v-for="n in Math.round(trackLength / 100)" :key="`mm-marker-${n}`" class="distance-marker"></span>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.mini-map {
  width: 100%;
  border-top: 2px solid rgba(255, 255, 255, .25);
  position: relative;
}

span.racer-dot {
  position: absolute;
  top: -6px;
  left: var(--calculated-distance);
  display: inline-block;
  height: 10px;
  width: 10px;
  background-color: var(--dot-color);
  border: 1px solid white;
  border-radius: 50%;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, .25);
}

.distance-marker {
  height: 12px;
  width: 2px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, .25);

  &:last-of-type,
  &:first-of-type {
    height: 8px;
  }
}
</style>