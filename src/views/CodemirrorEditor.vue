<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import CssEditor from '@/components/CodemirrorEditor/CssEditor.vue'
import EditorHeader from '@/components/CodemirrorEditor/EditorHeader/index.vue'
import InsertFormDialog from '@/components/CodemirrorEditor/InsertFormDialog.vue'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { altKey, altSign, ctrlKey, shiftKey, shiftSign } from '@/config'
import { useDisplayStore, useStore } from '@/stores'
import {
    formatDoc,
} from '@/utils'
import CodeMirror from 'codemirror'
import { storeToRefs } from 'pinia'
import { onMounted, ref, toRaw, watch } from 'vue'

const store = useStore()
const displayStore = useDisplayStore()
const { isDark, output, editor, editorContent } = storeToRefs(store)
const { isShowCssEditor } = storeToRefs(displayStore)

const {
    editorRefresh,
    exportEditorContent2HTML,
    exportEditorContent2MD,
    formatContent,
    importMarkdownContent,
} = store

const {
    toggleShowInsertFormDialog,
} = displayStore

const timeout = ref<NodeJS.Timeout>()

const preview = ref<HTMLDivElement | null>(null)

// 使浏览区与编辑区滚动条建立同步联系
function leftAndRightScroll() {
    const scrollCB = (text: string) => {
        let source: HTMLElement
        let target: HTMLElement

        clearTimeout(timeout.value)
        if (text === `preview`) {
            source = preview.value!
            target = document.querySelector<HTMLElement>(`.CodeMirror-scroll`)!

            editor.value!.off(`scroll`, editorScrollCB)
            timeout.value = setTimeout(() => {
                editor.value!.on(`scroll`, editorScrollCB)
            }, 300)
        }
        else {
            source = document.querySelector<HTMLElement>(`.CodeMirror-scroll`)!
            target = preview.value!

            target.removeEventListener(`scroll`, previewScrollCB, false)
            timeout.value = setTimeout(() => {
                target.addEventListener(`scroll`, previewScrollCB, false)
            }, 300)
        }

        const percentage
            = source.scrollTop / (source.scrollHeight - source.offsetHeight)
        const height = percentage * (target.scrollHeight - target.offsetHeight)

        target.scrollTo(0, height)
    }

    function editorScrollCB() {
        scrollCB(`editor`)
    }

    function previewScrollCB() {
        scrollCB(`preview`)
    }

    (preview.value!).addEventListener(`scroll`, previewScrollCB, false)
    editor.value!.on(`scroll`, editorScrollCB)
}

onMounted(() => {
    setTimeout(() => {
        leftAndRightScroll()
    }, 300)
})

// 更新编辑器
function onEditorRefresh() {
    editorRefresh()
}

const backLight = ref(false)
const isCoping = ref(false)

function startCopy() {
    isCoping.value = true
    backLight.value = true
}

// 拷贝结束
function endCopy() {
    backLight.value = false
    setTimeout(() => {
        isCoping.value = false
    }, 800)
}

const changeTimer = ref<NodeJS.Timeout>()

// 监听暗色模式并更新编辑器
watch(isDark, () => {
    const theme = isDark.value ? `darcula` : `xq-light`
    toRaw(editor.value)?.setOption?.(`theme`, theme)
})

// 初始化编辑器
function initEditor() {
    const editorDom = document.querySelector<HTMLTextAreaElement>(`#editor`)!

    if (!editorDom.value) {
        editorDom.value = editorContent.value
    }
    editor.value = CodeMirror.fromTextArea(editorDom, {
        mode: `text/x-markdown`,
        theme: isDark.value ? `darcula` : `xq-light`,
        lineNumbers: false,
        lineWrapping: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        extraKeys: {
            [`${shiftKey}-${altKey}-F`]: function autoFormat(editor) {
                formatDoc(editor.getValue()).then((doc) => {
                    editor.setValue(doc)
                })
            },
            [`${ctrlKey}-B`]: function bold(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`**${selected}**`)
            },
            [`${ctrlKey}-I`]: function italic(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`*${selected}*`)
            },
            [`${ctrlKey}-D`]: function del(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`~~${selected}~~`)
            },
            [`${ctrlKey}-K`]: function italic(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`[${selected}]()`)
            },
            [`${ctrlKey}-E`]: function code(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`\`${selected}\``)
            },
            // 预备弃用
            [`${ctrlKey}-L`]: function code(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`\`${selected}\``)
            },
        },
    })

    editor.value.on(`change`, (e) => {
        clearTimeout(changeTimer.value)
        changeTimer.value = setTimeout(() => {
            onEditorRefresh()
            editorContent.value = e.getValue()
        }, 300)
    })
}

const container = ref(null)

// 工具函数，添加格式
function addFormat(cmd: string | number) {
    (editor.value as any).options.extraKeys[cmd](editor.value)
}

const codeMirrorWrapper = ref<ComponentPublicInstance<HTMLDivElement> | null>(null)

onMounted(() => {
    initEditor()
    onEditorRefresh()
})
</script>

<template>
    <div ref="container" class="container flex flex-col">
        <EditorHeader
            @add-format="addFormat"
            @format-content="formatContent"
            @start-copy="startCopy"
            @end-copy="endCopy"
        />
        <main class="container-main flex-1">
            <div class="container-main-section grid h-full border-1" :class="isShowCssEditor ? 'grid-cols-3' : 'grid-cols-2'">
                <div
                    ref="codeMirrorWrapper"
                    class="codeMirror-wrapper border-r-1"
                    :class="{
            'order-1': !store.isEditOnLeft,
          }"
                >
                    <ContextMenu>
                        <ContextMenuTrigger>
              <textarea
                  id="editor"
                  type="textarea"
                  placeholder="Your markdown text here."
              />
                        </ContextMenuTrigger>
                        <ContextMenuContent class="w-64">
                            <ContextMenuItem inset @click="toggleShowInsertFormDialog()">
                                插入表格
                            </ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem inset @click="importMarkdownContent()">
                                导入 .md 文档
                            </ContextMenuItem>
                            <ContextMenuItem inset @click="exportEditorContent2MD()">
                                导出 .md 文档
                            </ContextMenuItem>
                            <ContextMenuItem inset @click="exportEditorContent2HTML()">
                                导出 .html
                            </ContextMenuItem>
                            <ContextMenuItem inset @click="formatContent()">
                                格式化
                                <ContextMenuShortcut>{{ altSign }} + {{ shiftSign }} + F</ContextMenuShortcut>
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </div>
                <div
                    id="preview"
                    ref="preview"
                    :span="isShowCssEditor ? 8 : 12"
                    class="preview-wrapper p-5"
                >
                    <div id="output-wrapper" :class="{ output_night: !backLight }">
                        <div class="preview border shadow-xl">
                            <section id="output" v-html="output" />
                            <div v-if="isCoping" class="loading-mask">
                                <div class="loading-mask-box">
                                    <div class="loading__img" />
                                    <span>正在渲染</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CssEditor />
            </div>
        </main>

        <InsertFormDialog />

        <AlertDialog v-model:open="store.isOpenConfirmDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>提示</AlertDialogTitle>
                    <AlertDialogDescription>
                        此操作将丢失本地自定义样式，是否继续？
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction @click="store.resetStyle()">
                        确认
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <footer style="color: hsl(var(--foreground)); margin: 0 20px 20px 20px; font-size: 0.8em">
            © 2024 多栈科技 | 基于开源项目 <a href="https://github.com/Doocs/md" target="_blank">Doocs/md</a> 定制
        </footer>
    </div>
</template>

<style lang="less" scoped>
@import url('../assets/less/app.less');
</style>

<style lang="less" scoped>
.container {
    height: 100vh;
    min-width: 100%;
    padding: 0;
}

.container-main {
    overflow: hidden;
    padding: 20px;
    padding-top: 0;
}

#output-wrapper {
    position: relative;
    user-select: text;
    height: 100%;
}

.loading-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    color: hsl(var(--foreground));
    background-color: hsl(var(--background));

    .loading-mask-box {
        position: sticky;
        top: 50%;
        transform: translateY(-50%);

        .loading__img {
            width: 75px;
            height: 75px;
            background: url('../assets/images/favicon.png') no-repeat;
            margin: 1em auto;
            background-size: cover;
        }
    }
}

:deep(.preview-table) {
    border-spacing: 0;
}

.codeMirror-wrapper,
.preview-wrapper {
    height: 100%;
}

.codeMirror-wrapper {
    overflow-x: auto;
}
</style>
