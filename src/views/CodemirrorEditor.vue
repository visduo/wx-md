<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import InsertTableDialog from '@/components/CodemirrorEditor/Dialog/InsertTableDialog.vue'
import EditorHeader from '@/components/CodemirrorEditor/Header/index.vue'
import CssEditor from '@/components/CodemirrorEditor/Sidebar/CssEditor.vue'
import PostSlider from '@/components/CodemirrorEditor/Sidebar/PostSlider.vue'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/CommonUI/alert-dialog'
import { BackTop } from '@/components/CommonUI/back-top'
import {
    ContextMenu,
    ContextMenuTrigger,
} from '@/components/CommonUI/context-menu'
import { altKey, ctrlKey, shiftKey } from '@/config'
import { useDisplayStore, useStore } from '@/stores'
import {
    formatDoc,
} from '@/utils'
import CodeMirror from 'codemirror'
import { List, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

const store = useStore()
const displayStore = useDisplayStore()
const { output, editor } = storeToRefs(store)
const { isShowCssEditor } = storeToRefs(displayStore)

const {
    editorRefresh,
    formatContent,
} = store

const {
    toggleShowInsertTableDialog,
} = displayStore

const timeout = ref<NodeJS.Timeout>()

const preview = ref<HTMLDivElement | null>(null)

// 使浏览区与编辑区滚动条建立同步联系
function leftAndRightScroll() {
    const scrollCB = (text: string) => {
        if (!store.isLeftAndRightScroll) {
            return
        }
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

const charCount = ref(0)

// 初始化编辑器
function initEditor() {
    const editorDom = document.querySelector<HTMLTextAreaElement>(`#editor`)!

    if (!editorDom.value) {
        editorDom.value = store.posts[store.currentPostIndex].content
        charCount.value = store.posts[store.currentPostIndex].content.replace(/\s/g, ``).length
    }
    editor.value = CodeMirror.fromTextArea(editorDom, {
        mode: `text/x-markdown`,
        theme: `xq-light`,
        lineNumbers: false,
        lineWrapping: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        extraKeys: {
            [`${shiftKey}-${altKey}-F`]: function extra(editor) {
                formatDoc(editor.getValue()).then((doc) => {
                    editor.setValue(doc)
                })
            },
            [`${ctrlKey}-B`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`**${selected}**`)
            },
            [`${ctrlKey}-I`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`*${selected}*`)
            },
            [`${ctrlKey}-D`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`~~${selected}~~`)
            },
            [`${ctrlKey}-K`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`[${selected}]()`)
            },
            [`${ctrlKey}-E`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`\`${selected}\``)
            },
            [`${ctrlKey}-P`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`![${selected}]()`)
            },
            [`${ctrlKey}-G`]: function extra(editor) {
                const selected = editor.getSelection()
                editor.replaceSelection(`\`\`\`java\n${selected}\`\`\``)
            },
            [`${ctrlKey}-T`]: function extra() {
                toggleShowInsertTableDialog()
            },
        },
    })

    editor.value.on(`change`, (e) => {
        clearTimeout(changeTimer.value)
        changeTimer.value = setTimeout(() => {
            onEditorRefresh()
            store.posts[store.currentPostIndex].content = e.getValue()
            const value = e.getValue()
            store.posts[store.currentPostIndex].content = value
            charCount.value = value.replace(/\s/g, ``).length
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

const isOpenHeadingSlider = ref(false)
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
            <div class="container-main-section h-full flex border-1">
                <div class="flex flex-col border-r p-1">
                    <TooltipProvider :delay-duration="200">
                        <Tooltip>
                            <TooltipTrigger as-child>
                                <Button size="icon" variant="ghost" @click="store.isOpenPostSlider = !store.isOpenPostSlider">
                                    <PanelLeftOpen v-show="!store.isOpenPostSlider" class="size-4" />
                                    <PanelLeftClose v-show="store.isOpenPostSlider" class="size-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                {{ store.isOpenPostSlider ? "关闭" : "展开" }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <PostSlider />
                <div
                    ref="codeMirrorWrapper"
                    class="codeMirror-wrapper flex-1 border-r-1"
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
                    </ContextMenu>
                </div>
                <div class="relative flex-1">
                    <div
                        id="preview"
                        ref="preview"
                        :span="isShowCssEditor ? 8 : 12"
                        class="preview-wrapper flex-1 p-5"
                    >
                        <div id="output-wrapper" :class="{ output_night: !backLight }">
                            <div class="preview border shadow-xl">
                                <section id="output" v-html="output" />
                                <div v-if="isCoping" class="loading-mask">
                                    <div class="loading-mask-box">
                                        <div class="loading__img" />
                                        <span>正在生成</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-muted absolute bottom-0 left-0 p-2 text-xs shadow">
                        {{ charCount }} 个字符
                    </div>
                    <BackTop target="preview" :right="40" :bottom="40" />
                    <div
                        class="bg-background absolute left-0 top-0 border rounded-2 rounded-lt-none p-2 text-sm shadow"
                        @mouseenter="() => isOpenHeadingSlider = true"
                        @mouseleave="() => isOpenHeadingSlider = false"
                    >
                        <List class="size-6" />
                        <ul
                            class="overflow-auto transition-all"
                            :class="{
                'max-h-0 w-0': !isOpenHeadingSlider,
                'max-h-100 w-60 mt-2': isOpenHeadingSlider,
              }"
                        >
                            <li v-for="(item, index) in store.titleList" :key="index" class="line-clamp-1 py-1 leading-6 hover:bg-gray-300 dark:hover:bg-gray-600" :style="{ paddingLeft: `${item.level - 0.5}em` }">
                                <a :href="item.url">
                                    {{ item.title }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <CssEditor class="flex-1" />
            </div>
        </main>

        <InsertTableDialog />

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
            © 2025 多栈科技 | 基于开源项目 <a href="https://github.com/Doocs/md" target="_blank">Doocs/md</a> 定制、<a href="https://github.com/357929231/jtt" target="_blank">357929231/jtt</a> 定制 | <a href="https://github.com/visduo/wx-md" target="_blank">Github开源</a>
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
