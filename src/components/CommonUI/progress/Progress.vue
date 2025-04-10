<script setup lang="ts">
const props = defineProps<{
    value?: number
}>()
</script>

<template>
    <div
        class="bg-secondary relative h-2 w-full overflow-hidden rounded-full"
    >
        <div
            class="bg-primary h-full w-full flex-1 transition-all"
            :style="{
        transform: `translateX(-${100 - (props.value || 0)}%)`,
      }"
        />
    </div>
</template>
