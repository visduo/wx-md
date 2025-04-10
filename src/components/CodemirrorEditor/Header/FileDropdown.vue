<script setup lang="ts">
import { useStore } from '@/stores'
import { Download, Newspaper, Upload } from 'lucide-vue-next'
import { ref } from 'vue'
import ImportWxPostDialog from '../Dialog/ImportWxPostDialog.vue'

const store = useStore()

const {
    exportEditorContent2MD,
    importMarkdownContent,
} = store

const isShowImportWxPostDialog = ref(false)

function showImportWxPostDialog() {
    isShowImportWxPostDialog.value = true
}
</script>

<template>
    <MenubarMenu>
        <MenubarTrigger>
            文件
        </MenubarTrigger>
        <MenubarContent align="start">
            <MenubarItem @click="importMarkdownContent()">
                <Upload class="mr-2 size-4" />
                导入 .md 文档
            </MenubarItem>
            <MenubarItem @click="showImportWxPostDialog">
                <Newspaper class="mr-2 size-4" />
                导入公众号文章
            </MenubarItem>
            <MenubarItem @click="exportEditorContent2MD()">
                <Download class="mr-2 size-4" />
                导出 .md 文档
            </MenubarItem>
        </MenubarContent>
    </MenubarMenu>

    <ImportWxPostDialog v-model:show="isShowImportWxPostDialog" />
</template>
