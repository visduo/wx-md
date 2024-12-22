<script setup lang="ts">
import { useStore } from '@/stores'
import { Download, PanelLeftClose, PanelLeftOpen, Upload } from 'lucide-vue-next'

const store = useStore()

const {
    exportEditorContent2MD,
    importMarkdownContent,
} = store
</script>

<template>
    <MenubarMenu>
        <MenubarTrigger>
            文件
        </MenubarTrigger>
        <MenubarContent align="start">
            <MenubarItem @click="importMarkdownContent()">
                <Upload class="mr-2 size-4" />
                导入 .md
            </MenubarItem>
            <MenubarItem @click="exportEditorContent2MD()">
                <Download class="mr-2 size-4" />
                导出 .md
            </MenubarItem>
            <MenubarItem v-if="!store.isOpenPostSlider" variant="outline" @click="store.isOpenPostSlider = true">
                <PanelLeftOpen class="mr-2 size-4" />
                文章列表
            </MenubarItem>
            <MenubarItem v-else @click="store.isOpenPostSlider = false">
                <PanelLeftClose class="mr-2 size-4" />
                文章列表
            </MenubarItem>
        </MenubarContent>
    </MenubarMenu>
</template>
