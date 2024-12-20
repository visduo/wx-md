<script setup lang="ts">
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from '@/components/ui/menubar'
import { Toaster } from '@/components/ui/sonner'
import {
    altSign,
    ctrlKey,
    ctrlSign,
    shiftSign,
} from '@/config'
import { useStore } from '@/stores'
import { mergeCss, solveWeChatImage } from '@/utils'
import { Copy } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'

import { toast } from 'vue-sonner'
import FileDropdown from './FileDropdown.vue'
import StyleDropdown from './StyleDropdown.vue'

const emit = defineEmits([`addFormat`, `formatContent`, `startCopy`, `endCopy`])

const formatItems = [
    {
        label: `加粗`,
        kbd: [ctrlSign, `B`],
        emitArgs: [`addFormat`, `${ctrlKey}-B`],
    },
    {
        label: `斜体`,
        kbd: [ctrlSign, `I`],
        emitArgs: [`addFormat`, `${ctrlKey}-I`],
    },
    {
        label: `删除线`,
        kbd: [ctrlSign, `D`],
        emitArgs: [`addFormat`, `${ctrlKey}-D`],
    },
    {
        label: `超链接`,
        kbd: [ctrlSign, `K`],
        emitArgs: [`addFormat`, `${ctrlKey}-K`],
    },
    {
        label: `行内代码`,
        kbd: [ctrlSign, `E`],
        emitArgs: [`addFormat`, `${ctrlKey}-E`],
    },
    {
        label: `格式化`,
        kbd: [altSign, shiftSign, `F`],
        emitArgs: [`formatContent`],
    },
] as const

const store = useStore()

const { isDark, isCiteStatus, output, primaryColor } = storeToRefs(store)

const { toggleDark, editorRefresh, citeStatusChanged } = store

// 复制到微信公众号
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

        // 如果是深色模式，复制之前需要先切换到白天模式
        const isBeforeDark = isDark.value
        if (isBeforeDark) {
            toggleDark()
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
                .replaceAll(`hsl(var(--foreground))`, `#3f3f3f`)
                .replaceAll(`var(--blockquote-background)`, `#f7f7f7`)
                .replaceAll(`var(--md-primary-color)`, primaryColor.value)
                .replaceAll(/--md-primary-color:.+?;/g, ``)
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

            if (isBeforeDark) {
                nextTick(() => toggleDark())
            }

            // 输出提示
            toast.success(`已复制`)

            editorRefresh()
            emit(`endCopy`)
        })
    }, 350)
}
</script>

<template>
    <header class="header-container h-15 flex items-center px-5">
        <Menubar class="menubar mr-auto">
            <FileDropdown />

            <MenubarMenu>
                <MenubarTrigger> 格式 </MenubarTrigger>
                <MenubarContent class="w-60" align="start">
                    <MenubarCheckboxItem
                        v-for="{ label, kbd, emitArgs } in formatItems" :key="label"
                        @click="emitArgs[0] === 'addFormat' ? $emit(emitArgs[0], emitArgs[1]) : $emit(emitArgs[0])"
                    >
                        {{ label }}
                        <MenubarShortcut>
                            <kbd v-for="item in kbd" :key="item" class="mx-1 bg-gray-2 dark:bg-stone-9">
                                {{ item }}
                            </kbd>
                        </MenubarShortcut>
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarCheckboxItem :checked="isCiteStatus" @click="citeStatusChanged()">
                        微信外链转底部引用
                    </MenubarCheckboxItem>
                </MenubarContent>
            </MenubarMenu>
            <StyleDropdown />
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
