<script setup lang="ts">
import {
    MenubarCheckboxItem,
    MenubarContent,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from '@/components/CommonUI/menubar'
import { altSign, ctrlKey, ctrlSign, shiftSign } from '@/config'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'

defineEmits([`addFormat`, `formatContent`])

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
        label: `图片`,
        kbd: [ctrlSign, `P`],
        emitArgs: [`addFormat`, `${ctrlKey}-P`],
    },
    {
        label: `表格`,
        kbd: [ctrlSign, `T`],
        emitArgs: [`addFormat`, `${ctrlKey}-T`],
    },
    {
        label: `格式化`,
        kbd: [altSign, shiftSign, `F`],
        emitArgs: [`formatContent`],
    },
] as const

const store = useStore()

const { isEditOnLeft, isCiteStatus } = storeToRefs(store)
const { citeStatusChanged } = store
</script>

<template>
    <MenubarMenu>
        <MenubarTrigger> 编辑 </MenubarTrigger>
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
            <MenubarSeparator />
            <MenubarCheckboxItem v-model:checked="isEditOnLeft">
                左侧编辑
            </MenubarCheckboxItem>
        </MenubarContent>
    </MenubarMenu>
</template>
