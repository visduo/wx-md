<script setup lang="ts">
import {
    MenubarContent,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/CommonUI/menubar'
import { useStore } from '@/stores'
import { hexToRGBA, mergeCss, solveWeChatImage } from '@/utils'
import { Copy } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { toast } from 'vue-sonner'

const emit = defineEmits([`startCopy`, `endCopy`])

const store = useStore()

const { output, primaryColor } = storeToRefs(store)

const { editorRefresh } = store

function copy() {
    emit(`startCopy`)
    setTimeout(() => {
        function modifyHtmlStructure(htmlString: string) {
            // 创建一个 div 元素来暂存原始 HTML 字符串
            const tempDiv = document.createElement(`div`)
            tempDiv.innerHTML = `${htmlString}`

            const originalItems = tempDiv.querySelectorAll(`li > ul, li > ol`)

            originalItems.forEach((originalItem) => {
                originalItem.parentElement!.insertAdjacentElement(`afterend`, originalItem)
            })

            // 返回修改后的 HTML 字符串
            return tempDiv.innerHTML
        }

        nextTick(() => {
            solveWeChatImage()

            const clipboardDiv = document.getElementById(`output`)!
            clipboardDiv.innerHTML = mergeCss(clipboardDiv.innerHTML)
            clipboardDiv.innerHTML = modifyHtmlStructure(clipboardDiv.innerHTML)
            clipboardDiv.innerHTML = clipboardDiv.innerHTML
                // 公众号不支持 position， 转换为等价的 translateY
                .replace(/top:(.*?)em/g, `transform: translateY($1em)`)
                // 适配主题中的颜色变量
                .replaceAll(`hsl(var(--foreground))`, `#3F3F3F`)
                .replaceAll(`var(--blockquote-background)`, `#F7F7F7`)
                .replaceAll(`var(--md-primary-color)`, primaryColor.value)
                .replaceAll(`var(--md-primary-lighter-color)`, hexToRGBA(primaryColor.value, 0.2))
                .replaceAll(/--md-primary-color:.+?;/g, ``)
                .replaceAll(/--md-primary-lighter-color:.+?;/g, ``)
                .replace(/<span class="nodeLabel"([^>]*)><p[^>]*>(.*?)<\/p><\/span>/g, `<span class="nodeLabel"$1>$2</span>`)

            clipboardDiv.focus()

            // edge case: 由于 svg 无法复制， 在前面插入一个空节点
            const p = document.createElement(`p`)
            p.style.fontSize = `0` // 设置字体大小为 0
            p.style.lineHeight = `0` // 行高也为 0
            p.style.margin = `0` // 避免外边距干扰
            p.innerHTML = `&nbsp;`
            clipboardDiv.insertBefore(p, clipboardDiv.firstChild)

            // 兼容 Mermaid
            const nodes = clipboardDiv.querySelectorAll(`.nodeLabel`)
            nodes.forEach((node) => {
                const parent = node.parentElement!
                const xmlns = parent.getAttribute(`xmlns`)!
                const style = parent.getAttribute(`style`)!
                const section = document.createElement(`section`)
                section.setAttribute(`xmlns`, xmlns)
                section.setAttribute(`style`, style)
                section.innerHTML = parent.innerHTML

                const grand = parent.parentElement!
                grand.innerHTML = ``
                grand.appendChild(section)
            })

            window.getSelection()!.removeAllRanges()
            const range = document.createRange()

            range.setStartBefore(clipboardDiv.firstChild!)
            range.setEndAfter(clipboardDiv.lastChild!)
            window.getSelection()!.addRange(range)
            document.execCommand(`copy`)
            window.getSelection()!.removeAllRanges()
            clipboardDiv.innerHTML = output.value

            toast.success(`已复制`)

            editorRefresh()
            emit(`endCopy`)
        })
    }, 350)
}
</script>

<template>
    <MenubarMenu>
        <MenubarTrigger>
            复制
        </MenubarTrigger>
        <MenubarContent align="start">
            <MenubarItem @click="copy">
                <Copy class="mr-2 size-4" />
                复制到微信公众号文章编辑器
            </MenubarItem>
        </MenubarContent>
    </MenubarMenu>
</template>
