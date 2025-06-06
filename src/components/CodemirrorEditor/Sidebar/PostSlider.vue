<script setup lang="ts">
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
import { Button } from '@/components/CommonUI/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/CommonUI/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/CommonUI/dropdown-menu'
import { Input } from '@/components/CommonUI/input'
import { useStore } from '@/stores'
import { Edit3, Ellipsis, Plus, Trash } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const store = useStore()
const isOpen = ref(false)
const addPostInputVal = ref(``)
watch(isOpen, () => {
    if (isOpen.value) {
        addPostInputVal.value = ``
    }
})
function addPost() {
    if (addPostInputVal.value === ``) {
        toast.error(`文章标题不可为空`)
        return
    }
    store.addPost(addPostInputVal.value)
    isOpen.value = false
    toast.success(`文章新增成功`)
}
const editTarget = ref(-1)
const isOpenEditDialog = ref(false)
const renamePostInputVal = ref(``)
function startRenamePost(index: number) {
    editTarget.value = index
    renamePostInputVal.value = store.posts[index].title
    isOpenEditDialog.value = true
}
function renamePost() {
    if (renamePostInputVal.value === ``) {
        toast.error(`文章标题不可为空`)
        return
    }
    store.renamePost(editTarget.value, renamePostInputVal.value)
    isOpenEditDialog.value = false
    toast.success(`文章更名成功`)
}
const isOpenDelPostConfirmDialog = ref(false)
function startDelPost(index: number) {
    editTarget.value = index
    isOpenDelPostConfirmDialog.value = true
}
function delPost() {
    store.delPost(editTarget.value)
    isOpenDelPostConfirmDialog.value = false
    toast.success(`文章删除成功`)
}
</script>

<template>
    <div
        class="overflow-hidden border-r bg-gray/20 transition-width dark:bg-gray/40"
        :class="{
      'w-0': !store.isOpenPostSlider,
      'w-50': store.isOpenPostSlider,
    }"
    >
        <nav class="space-y-1 h-full overflow-auto p-2">
            <Dialog v-model:open="isOpen">
                <DialogTrigger as-child>
                    <Button variant="outline" class="w-full" size="xs">
                        <Plus /> 新增文章
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>新增文章</DialogTitle>
                        <DialogDescription>
                            请输入文章名称
                        </DialogDescription>
                    </DialogHeader>
                    <Input v-model="addPostInputVal" />
                    <DialogFooter>
                        <Button @click="addPost()">
                            确 定
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <a
                v-for="(post, index) in store.posts"
                :key="post.title"
                href="#"
                :class="{
          'bg-primary text-primary-foreground': store.currentPostIndex === index,
        }"
                class="hover:bg-primary/90 hover:text-primary-foreground dark:bg-muted dark:hover:bg-muted h-8 w-full inline-flex items-center justify-start gap-2 whitespace-nowrap rounded px-2 text-sm transition-colors dark:text-white dark:hover:text-white"
                @click="store.currentPostIndex = index"
            >
                <span class="line-clamp-1">{{ post.title }}</span>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button size="xs" variant="ghost" class="ml-auto px-1.5">
                            <Ellipsis class="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem @click.stop="startRenamePost(index)">
                            <Edit3 class="mr-2 size-4" />
                            更名
                        </DropdownMenuItem>
                        <DropdownMenuItem @click.stop="startDelPost(index)">
                            <Trash class="mr-2 size-4" />
                            删除
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </a>
            <!-- 重命名弹窗 -->
            <Dialog v-model:open="isOpenEditDialog">
                <DialogContent class="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>编辑文章名称</DialogTitle>
                        <DialogDescription>
                            请输入新的文章名称
                        </DialogDescription>
                    </DialogHeader>
                    <Input v-model="renamePostInputVal" />
                    <DialogFooter>
                        <Button variant="outline" @click="isOpenEditDialog = false">
                            取消
                        </Button>
                        <Button @click="renamePost()">
                            保存
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog v-model:open="isOpenDelPostConfirmDialog">
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>提示</AlertDialogTitle>
                        <AlertDialogDescription>
                            此操作将删除该文章，是否继续？
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction @click="delPost()">
                            确认
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </nav>
    </div>
</template>

<style scoped lang="less">

</style>
