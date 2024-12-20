import type { IConfigOption, Theme } from '@/types'

const defaultTheme: Theme = {
    base: {
        '--md-primary-color': `#000000`,
        'text-align': `left`,
        'line-height': `1.75`,
    },
    block: {
        // 一级标题
        h1: {
            'display': `table`,
            'padding': `0.5em 1em`,
            'margin': `0 auto 2.5em auto`,
            'color': `hsl(var(--foreground))`,
            'font-weight': `bold`,
            'text-align': `center`,
            'border-bottom': `2px solid var(--md-primary-color)`,
            'font-size': `1.4em`,
        },
        // 二级标题
        h2: {
            'margin': `3em 8px 1.5em 0`,
            'padding-left': `12px`,
            'color': `hsl(var(--foreground))`,
            'font-weight': `bold`,
            'font-size': `1.2em`,
            'border-left': `4px solid var(--md-primary-color)`,
            'border-bottom': `0`,
        },
        // 三级标题
        h3: {
            'color': `hsl(var(--foreground))`,
            'font-size': `1em`,
            'font-weight': `bold`,
            'margin': `0 0 1.5em 0`,
        },
        // 四级标题
        h4: {
            'color': `hsl(var(--foreground))`,
            'font-size': `1em`,
            'font-weight': `bold`,
            'margin': `0 0 1.5em 0`,
        },
        // 五级标题
        h5: {
            'color': `hsl(var(--foreground))`,
            'font-size': `1em`,
            'font-weight': `bold`,
            'margin': `0 0 1.5em 0`,
        },
        // 六级标题
        h6: {
            'color': `hsl(var(--foreground))`,
            'font-size': `1em`,
            'font-weight': `bold`,
            'margin': `0 0 1.5em 0`,
        },
        // 段落
        p: {
            'margin': `0 0 1.5em 0`,
            'letter-spacing': `0em`,
            'color': `hsl(var(--foreground))`,
            'text-align': `start`,
        },
        // 引用块
        blockquote: {
            'font-style': `normal`,
            'border-left-width': `4px`,
            'border-left-color': `rgb(221, 221, 221)`,
            'padding': `0.8em`,
            'border-radius': `4px`,
            'color': `rgb(119, 119, 119)`,
            'background': `var(--blockquote-background)`,
            'margin': `0 0 1.5em 0`,
        },
        blockquote_p: {
            'display': `block`,
            'font-size': `0.9em`,
            'color': `hsl(var(--foreground))`,
        },
        // 代码块
        code_pre: {
            'overflow-x': `auto`,
            'border-radius': `4px`,
            'margin': `-1em 0 1.5em 0`,
        },
        code: {
            'margin': `0`,
            'padding': `15px`,
            'white-space': `nowrap`,
            'font-size': `0.85em`,
            'line-height': `1.5`,
        },
        // 图片
        figure: {
            margin: `-1em 0 1.5em 0`,
            color: `hsl(var(--foreground))`,
        },
        image: {
            'display': `block`,
            'width': `100% !important`,
            'margin': `0.3em auto 0.5em`,
            'border-radius': `4px`,
            'border': `1px dashed #CCC`,
        },
        // 有序列表
        ol: {
            'color': `hsl(var(--foreground))`,
            'padding-left': `0`,
            'margin': `-1.5em 0 1.5em 0`,
        },
        // 无序列表
        ul: {
            'padding-left': `0`,
            'color': `hsl(var(--foreground))`,
            'margin': `-1.5em 0 1.5em 0`,
        },
        // 脚注
        footnotes: {
            'margin': `-1.5em 0 1.5em 0`,
            'font-size': `0.9em`,
            'color': `hsl(var(--foreground))`,
        },
        // 水平分割线
        hr: {
            'background': `transparent`,
            'color': `transparent`,
            'border': `none`,
            'border-bottom': `1px dashed #e9ebec`,
            'margin': `0 0 1.5em 0`,
        },
    },
    inline: {
        // 列表项
        listitem: {
            'display': `block`,
            'color': `hsl(var(--foreground))`,
            'list-style-position': `inside`,
        },
        // 行内代码
        codespan: {
            'font-size': `0.85em`,
            'color': `#d14`,
            'background': `rgba(27,31,35,.05)`,
            'padding': `3px 5px`,
            'border-radius': `4px`,
        },
        // 链接
        link: {
            color: `#576b95`,
        },
        wx_link: {
            'color': `#576b95`,
            'text-decoration': `none`,
        },
        // 表格
        table: {
            'border-collapse': `collapse`,
            'text-align': `left`,
            'margin': `-1em 0 1.5em 0`,
            'color': `hsl(var(--foreground))`,
            'max-width': `100%`,
            'overflow': `auto`,
        },
        thead: {
            'font-weight': `bold`,
            'color': `hsl(var(--foreground))`,
        },
        td: {
            'border': `1px solid #dfdfdf`,
            'padding': `0.25em 0.5em`,
            'word-break': `keep-all`,
        },
        // 图片说明
        figcaption: {
            'text-align': `center`,
            'color': `#888`,
            'font-size': `0.85em`,
        },
    },
}

export const themeMap = {
    default: defaultTheme,
}

export const themeOptions: IConfigOption<keyof typeof themeMap>[] = [
    {
        label: `默认主题`,
        value: `default`,
        desc: `by 多仔ヾ`,
    },
]
