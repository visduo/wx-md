<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/CommonUI/dialog'
import { Label } from '@/components/CommonUI/label'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/CommonUI/number-field'
import { useDisplayStore, useStore } from '@/stores'

import { createTable } from '@/utils'
import { ref, toRaw } from 'vue'

const store = useStore()
const displayStore = useDisplayStore()

const { toggleShowInsertTableDialog } = displayStore

const rowNum = ref(3)
const colNum = ref(3)
const tableData = ref<Record<string, string>>({})

function resetVal() {
    rowNum.value = 3
    colNum.value = 3
    tableData.value = {}
}

function insertTable() {
    const table = createTable({
        rows: rowNum.value,
        cols: colNum.value,
        data: tableData.value,
    })
    toRaw(store.editor!).replaceSelection(`\n${table}\n`, `end`)
    resetVal()
    toggleShowInsertTableDialog()
}

function onUpdate(val: boolean) {
    if (!val) {
        toggleShowInsertTableDialog(false)
    }
}
</script>

<template>
    <Dialog :open="displayStore.isShowInsertTableDialog" @update:open="onUpdate">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>插入表格</DialogTitle>
            </DialogHeader>
            <div class="space-x-2 flex justify-between">
                <NumberField v-model="rowNum" :min="1" :max="100">
                    <Label>行数</Label>
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
                <NumberField v-model="colNum" :min="1" :max="100">
                    <Label>列数</Label>
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
            <div class="space-y-2 border-1 rounded p-2">
                <div v-for="row in rowNum + 1" :key="row" :class="{ 'head-style': row === 1 }" class="space-x-2 flex">
                    <Input
                        v-for="col in colNum" :key="col"
                        v-model="tableData[`k_${row - 1}_${col - 1}`]"
                        :class="{
              'bg-gray-100 dark:bg-gray-900': row === 1,
            }"
                        :placeholder="row === 1 ? '表头' : ''"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" @click="toggleShowInsertTableDialog(false)">
                    取 消
                </Button>
                <Button @click="insertTable">
                    确 定
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<style lang="less" scoped>
</style>
