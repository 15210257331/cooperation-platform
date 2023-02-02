<template>
  <div class="position-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.position-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
