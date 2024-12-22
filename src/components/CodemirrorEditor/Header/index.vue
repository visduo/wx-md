<script setup lang="ts">
import {
    Menubar,
} from '@/components/CommonUI/menubar'
import { Toaster } from '@/components/CommonUI/sonner'

import CopyDropdown from './CopyDropdown.vue'
import EditDropdown from './EditDropdown.vue'
import FileDropdown from './FileDropdown.vue'
import StyleDropdown from './StyleDropdown.vue'

const emit = defineEmits([`addFormat`, `formatContent`, `startCopy`, `endCopy`])

function addFormat(cmd: string | number) {
    emit(`addFormat`, cmd)
}
</script>

<template>
    <header class="header-container h-15 flex items-center px-5">
        <Menubar class="menubar mr-auto">
            <FileDropdown />
            <EditDropdown
                @add-format="addFormat"
                @format-content="emit(`formatContent`)"
            />
            <StyleDropdown />
            <CopyDropdown
                @start-copy="emit('startCopy')"
                @end-copy="emit('endCopy')"
            />
        </Menubar>

        <Toaster rich-colors position="top-center" />
    </header>
</template>

<style lang="less" scoped>
.menubar {
    user-select: none;
}

kbd {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #a8a8a8;
    padding: 1px 4px;
    border-radius: 2px;
}
</style>
