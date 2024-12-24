import type { IConfigOption, Theme } from '@/types'
import { toMerged } from 'es-toolkit'

// 基础主题
const defaultTheme: Theme = {
    base: {
        '--md-primary-color': `#000000`,
        '--md-primary-lighter-color': `#000000`,
        'line-height': `1.75`,
        'text-shadow': `0.01em 0.01em 0.01em #999999`,
        '-webkit-text-stroke-width': `0.38px`,
        '-webkit-font-smoothing': `antialiased`,
        'text-rendering': `optimizeLegibility`,
        'word-break': `break-all`,
    },
    elements: {
        // 主体容器
        container: {
            'margin': `0px`,
        },
        // 一级标题容器
        h1box: {
            'text-align': `left`,
            'padding': `0`,
            'margin': `5em 0 2em 0`,
        },
        // 一级标题前缀
        h1prefix: {
            'display': `none`,
        },
        // 一级标题后缀
        h1suffix: {
            'display': `none`,
        },
        // 一级标题内容
        h1span: {
            'font-size': `2em`,
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
        // 二级标题容器
        h2box: {
            'padding': `0`,
            'margin': `3em 0 2em 0`,
        },
        // 二级标题前缀
        h2prefix: {
            'display': `none`,
        },
        // 二级标题后缀
        h2suffix: {
            'display': `none`,
        },
        // 二级标题内容
        h2span: {
            'font-size': `1.4em`,
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
        // 三级标题容器
        h3box: {
            'margin': `0 0 1.5em 0`,
        },
        // 三级标题前缀
        h3prefix: {
            'display': `none`,
        },
        // 三级标题后缀
        h3suffix: {
            'display': `none`,
        },
        // 三级标题内容
        h3span: {
            'font-size': `1em`,
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
        // 四级标题容器
        h4box: {
            'margin': `0 0 1.5em 0`,
        },
        // 四级标题前缀
        h4prefix: {
            'display': `none`,
        },
        // 四级标题后缀
        h4suffix: {
            'display': `none`,
        },
        // 四级标题内容
        h4span: {
            'font-size': `1em`,
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
        // 五级标题容器
        h5box: {
            'margin': `0 0 1.5em 0`,
        },
        // 五级标题前缀
        h5prefix: {
            'display': `none`,
        },
        // 五级标题后缀
        h5suffix: {
            'display': `none`,
        },
        // 五级标题内容
        h5span: {
            'font-size': `1em`,
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
        // 六级标题容器
        h6box: {
            'margin': `0 0 1.5em 0`,
        },
        // 六级标题前缀
        h6prefix: {
            'display': `none`,
        },
        // 六级标题后缀
        h6suffix: {
            'display': `none`,
        },
        // 六级标题内容
        h6span: {
            'font-size': `1em`,
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
        // 段落
        p: {
            'color': `hsl(var(--foreground))`,
            'margin': `0 0 1.5em 0`,
        },
        // 有序列表
        ol: {
            'color': `hsl(var(--foreground))`,
            'padding': `0`,
            'margin': `-1.2em 0 1.5em 0`,
        },
        // 无序列表
        ul: {
            'color': `hsl(var(--foreground))`,
            'padding': `0`,
            'margin': `-1.2em 0 1.5em 0`,
        },
        // 列表项
        li: {
            'display': `block`,
            'margin': `0.3em 0 0 0`,
        },
        // 普通链接
        a_link: {
            'color': `var(--md-primary-color)`,
        },
        // 微信链接
        wx_link: {
            'color': `var(--md-primary-color)`,
            'text-decoration': `none`,
        },
        // 微信链接底部引用
        footnotes: {
            'margin': `-1.5em 0 1.5em 0`,
            'font-size': `0.9em`,
            'color': `hsl(var(--foreground))`,
        },
        // 图片容器
        figure: {
            margin: `-1em 0 1.875em 0`,
        },
        // 图片内容
        image: {
            'display': `block`,
            'width': `100%`,
            'padding': `4px`,
            'margin': `0 auto 1.75em auto`,
            'border-radius': `4px`,
            'border': `1px dashed #CCC`,
        },
        // 图片说明
        figcaption: {
            'color': `#888888`,
            'font-size': `0.85em`,
            'line-height': `1`,
            'text-align': `center`,
            'margin': `-1.5em auto 0 auto`,
        },
        // 引用块容器
        blockquote: {
            'padding': `0.5em 0.8em`,
            'margin': `-1em 0 1.875em 0`,
            'border-left-width': `4px`,
            'border-left-color': `var(--md-primary-color)`,
            'border-radius': `4px`,
            'background-color': `var(--md-primary-lighter-color)`,
        },
        // 引用块内容
        blockquotep: {
            'color': `hsl(var(--foreground))`,
            'display': `block`,
            'font-size': `0.9em`,
            'line-height': `1.5`,
        },
        // 表格
        table: {
            'width': `auto!important`,
            'color': `hsl(var(--foreground))`,
            'text-align': `left`,
            'margin': `-1em 0 1.875em 0`,
            'border-collapse': `collapse`,
            'max-width': `100%`,
            'overflow': `auto`,
        },
        // 表头单元格
        th: {
            'padding': `0.2em 0.5em`,
            'vertical-align': `middle`,
            'border': `1px solid #CCCCCC`,
            'background-color': `rgba(0, 0, 0, 0.05)`,
            'word-break': `keep-all`,
        },
        // 表项单元格
        td: {
            'padding': `0.2em 0.5em`,
            'vertical-align': `middle`,
            'border': `1px solid #CCCCCC`,
            'word-break': `keep-all`,
        },
        // 水平分割线
        hr: {
            'color': `transparent`,
            'text-decoration': `line-through`,
            'margin': `1.875em 0`,
            'border': `none`,
            'border-bottom': `1px dashed #e9ebec`,
            'background': `transparent`,
        },
        // 代码块容器
        pre: {
            'margin': `-1em 0 1.875em 0`,
            'border-radius': `4px`,
            'overflow-x': `auto`,
        },
        // 代码块内容
        code: {
            'font-family': `Consolas, Monaco, Menlo, monospace`,
            'margin': `0`,
            'padding': `15px`,
            'white-space': `nowrap`,
            'font-size': `0.85em`,
            'line-height': `1.5`,
            'text-shadow': `none`,
            '-webkit-text-stroke-width': `0.2px`,
        },
        // 行内代码
        codespan: {
            'font-family': `Consolas, Monaco, Menlo, monospace`,
            'font-size': `0.85em`,
            'line-height': `1`,
            'color': `#AB1942`,
            'padding': `3px 5px`,
            'border-radius': `4px`,
            'background-color': `var(--blockquote-background)`,
            'text-shadow': `none`,
            '-webkit-text-stroke-width': `0.2px`,
        },
        // 加粗文本
        strong: {
            'font-weight': `bold`,
            'color': `var(--md-primary-color)`,
        },
    },
}
// 轻简主题
const lightlyTheme: Theme = toMerged(defaultTheme, {
    base: {
    },
    elements: {
        // 一级标题内容
        h1span: {
            'padding': `0 0 0 14px`,
            'border-left': `8px solid var(--md-primary-color)`,
        },
        // 二级标题内容
        h2span: {
            'padding': `0 0 0 12px`,
            'border-left': `6px solid var(--md-primary-color)`,
        },
        // 三级标题容器
        h3box: {
            'padding': `0`,
        },
        // 三级标题内容
        h3span: {
            'padding': `0 0 0 10px`,
            'margin': `0`,
            'border-left': `4px solid var(--md-primary-color)`,
        },
    },
})
// 极简主题
const liteTheme: Theme = toMerged(defaultTheme, {
    base: {
    },
    elements: {
        // 一级标题容器
        h1box: {
            'border-bottom': `1px solid #D1D9E0B3`,
        },
        // 二级标题容器
        h2box: {
            'border-bottom': `1px solid #D1D9E0B3`,
        },
        // 三级标题容器
        h3box: {
            'border-bottom': `1px solid #D1D9E0B3`,
        },
        // 普通链接
        a_link: {
            'color': `#0969DA`,
        },
        // 微信链接
        wx_link: {
            'color': `#0969DA`,
            'text-decoration': `none`,
        },
        // 图片内容
        image: {
            'padding': `0px`,
            'border-radius': `0px`,
            'border': `0`,
        },
        // 引用块容器
        blockquote: {
            'padding': `0 0.8em 0 0.8em`,
            'margin': `-1em 0 1.75em 0`,
            'border-left-width': `4px`,
            'border-left-color': `#D1D9E0`,
            'border-radius': `0px`,
            'background-color': `transparent`,
        },
        // 引用块内容
        blockquotep: {
            'color': `#59636E`,
        },
    },
})
// 优雅主题
const elegantTheme: Theme = toMerged(defaultTheme, {
    base: {
    },
    elements: {
        // 一级标题容器
        h1box: {
            'border-bottom': `2px solid var(--md-primary-color)`,
        },
        // 二级标题容器
        h2box: {
            'border-bottom': `2px solid var(--md-primary-color)`,
        },
        // 二级标题内容
        h2span: {
            'display': `inline-block`,
            'color': `#FFFFFF`,
            'padding': `3px 10px 1px`,
            'margin': `0`,
            'border-radius': `4px 4px 0 0`,
            'background-color': `var(--md-primary-color)`,
        },
        // 三级标题容器
        h3box: {
            'padding': `0 0 0 12px`,
            'border-left': `4px solid var(--md-primary-color)`,
        },
    },
})
// 极客主题
const geekTheme: Theme = toMerged(defaultTheme, {
    base: {
    },
    elements: {
        // 一级标题容器
        h1box: {
            'border-bottom': `2px solid var(--md-primary-color)`,
        },
        // 二级标题容器
        h2box: {
            'background-color': `rgb(251, 251, 251)`,
        },
        // 二级标题内容
        h2span: {
            'display': `inline-block`,
            'color': `#FFFFFF`,
            'padding': `0 1.5em 0 1em`,
            'margin': `0`,
            'border-bottom-right-radius': `100px`,
            'background-color': `var(--md-primary-color)`,
        },
        // 三级标题容器
        h3box: {
            'padding': `0`,
            'border-bottom': `1px solid rgb(221, 221, 221)`,
        },
        // 三级标题内容
        h3span: {
            'padding': `0.1em 0em`,
            'margin': `0 0 -1px 0`,
            'border-bottom': `2px solid var(--md-primary-color)`,
        },
    },
})

export const themeMap = {
    default: defaultTheme,
    lightly: lightlyTheme,
    elegant: elegantTheme,
    geek: geekTheme,
    lite: liteTheme,
}

export const themeOptions: IConfigOption<keyof typeof themeMap>[] = [
    {
        label: `默认主题`,
        value: `default`,
        desc: `by 多仔ヾ`,
    },
    {
        label: `轻简主题`,
        value: `lightly`,
        desc: `by 多仔ヾ`,
    },
    {
        label: `极简主题`,
        value: `lite`,
        desc: `by 多仔ヾ`,
    },
    {
        label: `优雅主题`,
        value: `elegant`,
        desc: `by 多仔ヾ`,
    },
    {
        label: `极客主题`,
        value: `geek`,
        desc: `by 多仔ヾ`,
    },
]
