<script setup lang="ts">
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/CommonUI/hover-card'
import { MenubarCheckboxItem } from '@/components/CommonUI/menubar'
import {
    codeBlockThemeOptions,
    colorOptions,
    fontFamilyOptions,
    fontSizeOptions,
    legendOptions,
    themeOptions,
} from '@/config'
import { useDisplayStore, useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { ref, useTemplateRef } from 'vue'
import PickColors, { type Format } from 'vue-pick-colors'
import StyleOptionMenu from './StyleOptionMenu.vue'

const store = useStore()
const { toggleShowCssEditor } = useDisplayStore()

const {
    theme,
    fontFamily,
    fontSize,
    primaryColor,
    codeBlockTheme,
    legend,
    isMacCodeBlock,
    cssEditor,
} = storeToRefs(store)

const {
    resetStyleConfirm,
    themeChanged,
    fontChanged,
    sizeChanged,
    colorChanged,
    codeBlockThemeChanged,
    legendChanged,
    macCodeBlockChanged,
} = store

const colorPicker = ref<HTMLElement & { show: () => void } | null>(null)

function showPicker() {
    colorPicker.value?.show()
}

// 自定义CSS样式
function customStyle() {
    toggleShowCssEditor()
    setTimeout(() => {
        cssEditor.value!.refresh()
    }, 50)
}

const pickColorsContainer = useTemplateRef(`pickColorsContainer`)
const format = ref<Format>(`rgb`)
const formatOptions = ref<Format[]>([`rgb`, `hex`, `hsl`, `hsv`])
</script>

<template>
    <MenubarMenu>
        <MenubarTrigger> 样式 </MenubarTrigger>
        <MenubarContent class="w-56" align="start">
            <StyleOptionMenu
                title="排版主题"
                :options="themeOptions"
                :current="theme"
                :change="themeChanged"
            />
            <StyleOptionMenu
                title="代码块主题"
                :options="codeBlockThemeOptions"
                :current="codeBlockTheme"
                :change="codeBlockThemeChanged"
            />
            <MenubarCheckboxItem :checked="isMacCodeBlock" @click="macCodeBlockChanged">
                Mac 代码块
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <StyleOptionMenu
                title="字体"
                :options="fontFamilyOptions"
                :current="fontFamily"
                :change="fontChanged"
            />
            <StyleOptionMenu
                title="字号"
                :options="fontSizeOptions"
                :current="fontSize"
                :change="sizeChanged"
            />
            <MenubarCheckboxItem :checked="store.isUseIndent" @click="store.useIndentChanged()">
                首行缩进
            </MenubarCheckboxItem>
            <StyleOptionMenu
                title="图注格式"
                :options="legendOptions"
                :current="legend"
                :change="legendChanged"
            />
            <MenubarSeparator />
            <StyleOptionMenu
                title="主题色"
                :options="colorOptions"
                :current="primaryColor"
                :change="colorChanged"
            />
            <MenubarCheckboxItem @click.self.prevent="showPicker">
                <HoverCard :open-delay="100">
                    <HoverCardTrigger class="w-full flex">
                        自定义主题色
                    </HoverCardTrigger>
                    <HoverCardContent side="right" class="w-min">
                        <div ref="pickColorsContainer">
                            <PickColors
                                v-model:value="primaryColor"
                                show-alpha
                                :format="format" :format-options="formatOptions"
                                :popup-container="pickColorsContainer!"
                                @change="store.colorChanged"
                            />
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem @click="customStyle">
                自定义 CSS
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarCheckboxItem divided @click="resetStyleConfirm">
                重置样式
            </MenubarCheckboxItem>
        </MenubarContent>
    </MenubarMenu>
</template>
