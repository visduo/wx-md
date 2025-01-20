import type { Elements, ExtendedProperties, Theme } from '@/types'

import type { PropertiesHyphen } from 'csstype'
import { prefix } from '@/config'
import juice from 'juice'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import * as prettierPluginMarkdown from 'prettier/plugins/markdown'
import * as prettierPluginCss from 'prettier/plugins/postcss'
import { format } from 'prettier/standalone'

export function addPrefix(str: string) {
    return `${prefix}__${str}`
}

export function customizeTheme(theme: Theme, options: {
    fontSize?: number
    color?: string
}) {
    const newTheme = JSON.parse(JSON.stringify(theme))
    const { fontSize, color } = options
    if (fontSize) {
        for (let i = 1; i <= 6; i++) {
            const v = newTheme.elements[`h${i}span`][`font-size`]
            newTheme.elements[`h${i}span`][`font-size`] = `${fontSize * Number.parseFloat(v)}px`
        }
    }
    if (color) {
        newTheme.base[`--md-primary-color`] = color
        newTheme.base[`--md-primary-lighter-color`] = hexToRGBA(color, 0.2)
    }
    return newTheme as Theme
}

export function customCssWithTemplate(jsonString: Partial<Record<Elements, PropertiesHyphen>>, color: string, theme: Theme) {
    const newTheme = customizeTheme(theme, { color })

    const mergeProperties = <T extends Elements = Elements>(target: Record<T, PropertiesHyphen>, source: Partial<Record<Elements | string, PropertiesHyphen>>, keys: T[]) => {
        keys.forEach((key) => {
            if (source[key]) {
                target[key] = Object.assign(target[key] || {}, source[key])
            }
        })
    }

    const elementKeys: Elements[] = [
        `h1box`,
        `h1prefix`,
        `h1suffix`,
        `h1span`,
        `h2box`,
        `h2prefix`,
        `h2suffix`,
        `h2span`,
        `h3box`,
        `h3prefix`,
        `h3suffix`,
        `h3span`,
        `h4box`,
        `h4prefix`,
        `h4suffix`,
        `h4span`,
        `h5box`,
        `h5prefix`,
        `h5suffix`,
        `h5span`,
        `h6box`,
        `h6prefix`,
        `h6suffix`,
        `h6span`,
        `p`,
        `blockquote`,
        `blockquotep`,
        `pre`,
        `code`,
        `image`,
        `ol`,
        `ul`,
        `footnotes`,
        `figure`,
        `hr`,
        `li`,
        `codespan`,
        `a_link`,
        `wx_link`,
        `table`,
        `th`,
        `td`,
        `figcaption`,
        `strong`,
        `container`,
    ]

    mergeProperties(newTheme.elements, jsonString, elementKeys)
    return newTheme
}

/**
 * 将 CSS 字符串转换为 JSON 对象
 *
 * @param {string} css - CSS 字符串
 * @returns {object} - JSON 格式的 CSS
 */
export function css2json(css: string): Partial<Record<Elements, PropertiesHyphen>> {
    // 去除所有 CSS 注释
    css = css.replace(/\/\*[\s\S]*?\*\//g, ``)

    const json: Partial<Record<Elements, PropertiesHyphen>> = {}

    // 辅助函数：将声明数组转换为对象
    const toObject = (array: any[]) =>
        array.reduce<{ [k: string]: string }>((obj, item) => {
            const [property, value] = item.split(`:`).map((part: string) => part.trim())
            if (property)
                obj[property] = value
            return obj
        }, {})

    while (css.includes(`{`) && css.includes(`}`)) {
        const lbracket = css.indexOf(`{`)
        const rbracket = css.indexOf(`}`)

        // 获取声明块并转换为对象
        const declarations = css.substring(lbracket + 1, rbracket)
            .split(`;`)
            .map(e => e.trim())
            .filter(Boolean)

        // 获取选择器并去除空格
        const selectors = css.substring(0, lbracket)
            .split(`,`)
            .map(selector => selector.trim()) as (Elements)[]

        const declarationObj = toObject(declarations)

        // 将声明对象关联到相应的选择器
        selectors.forEach((selector) => {
            json[selector] = { ...(json[selector] || {}), ...declarationObj }
        })

        // 处理下一个声明块
        css = css.slice(rbracket + 1).trim()
    }

    return json
}

/**
 * 将样式对象转换为 CSS 字符串
 * @param {ExtendedProperties} style - 样式对象
 * @returns {string} - CSS 字符串
 */
export function getStyleString(style: ExtendedProperties) {
    return Object.entries(style ?? {}).map(([key, value]) => `${key}: ${value}`).join(`; `)
}

/**
 * 格式化内容
 * @param {string} content - 要格式化的内容
 * @param {'markdown' | 'css'} [type] - 内容类型，决定使用的解析器，默认为'markdown'
 * @returns {Promise<string>} - 格式化后的内容
 */
export async function formatDoc(content: string, type: `markdown` | `css` = `markdown`) {
    const plugins = {
        markdown: [prettierPluginMarkdown, prettierPluginBabel, prettierPluginEstree],
        css: [prettierPluginCss],
    }

    const parser = type in plugins ? type : `markdown`
    return await format(content, {
        parser,
        plugins: plugins[parser],
    })
}

/**
 * 格式化排版
 * @param {string} content - 要格式化的内容
 * @returns {Promise<string>} - 格式化后的内容
 */
export async function formatTypesetting(content: string) {
    // 匹配代码块区域
    const codeBlockPattern = /```([\s\S]*?)```/g
    const codeBlocks: string[] = []
    let index = 0
    content = content.replace(codeBlockPattern, (match) => {
        codeBlocks[index] = match
        return `__CODEBLOCK_${index++}__`
    })

    // 匹配英文和中文相邻的情况
    const enZhPattern1 = /([a-z])([\u4E00-\u9FA5])/gi
    const enZhPattern2 = /([\u4E00-\u9FA5])([a-z])/gi
    // 匹配中文和数字相邻的情况
    const zhNumPattern1 = /([\u4E00-\u9FA5])(\d)/g
    const zhNumPattern2 = /(\d)([\u4E00-\u9FA5])/g
    // 匹配中文和标点相邻的情况
    const zhPunctuationPattern1 = /([\u4E00-\u9FA5])([“”‘’"'])/g
    const zhPunctuationPattern2 = /([“”‘’"'])([\u4E00-\u9FA5])/g

    // 处理中英文相邻情况
    content = content.replace(enZhPattern1, (match, p1, p2) => {
        if (p1 && p2) {
            return `${p1} ${p2}`
        }
        return match
    })
    content = content.replace(enZhPattern2, (match, p1, p2) => {
        if (p1 && p2) {
            return `${p1} ${p2}`
        }
        return match
    })
    // 处理中文和数字相邻情况
    content = content.replace(zhNumPattern1, (match, p1, p2) => {
        if (p1 && p2) {
            return `${p1} ${p2}`
        }
        return match
    })
    content = content.replace(zhNumPattern2, (match, p1, p2) => {
        if (p1 && p2) {
            return `${p1} ${p2}`
        }
        return match
    })
    // 处理中文和标点相邻情况
    content = content.replace(zhPunctuationPattern1, (match, p1, p2) => {
        if (p1 && p2) {
            return `${p1} ${p2}`
        }
        return match
    })
    content = content.replace(zhPunctuationPattern2, (match, p1, p2) => {
        if (p1 && p2) {
            return `${p1} ${p2}`
        }
        return match
    })

    // 将代码块替换回去
    index = 0
    content = content.replace(/__CODEBLOCK_(\d+)__/g, (match, p1) => {
        return codeBlocks[Number.parseInt(p1)]
    })

    return content
}

/**
 * 导出原始 Markdown 文档
 * @param {string} doc - 文档内容
 */
export function downloadMD(doc: string) {
    const downLink = document.createElement(`a`)

    downLink.download = `content.md`
    downLink.style.display = `none`
    const blob = new Blob([doc])

    downLink.href = URL.createObjectURL(blob)
    document.body.appendChild(downLink)
    downLink.click()
    document.body.removeChild(downLink)
}

/**
 * 根据数据生成 Markdown 表格
 *
 * @param {object} options - 选项
 * @param {object} options.data - 表格数据
 * @param {number} options.rows - 行数
 * @param {number} options.cols - 列数
 * @returns {string} 生成的 Markdown 表格
 */
export function createTable({ data, rows, cols }: { data: { [k: string]: string }, rows: number, cols: number }) {
    let table = ``
    for (let i = 0; i < rows + 2; ++i) {
        table += `| `
        const currRow = []
        for (let j = 0; j < cols; ++j) {
            const rowIdx = i > 1 ? i - 1 : i
            currRow.push(i === 1 ? `---` : data[`k_${rowIdx}_${j}`] || `     `)
        }
        table += currRow.join(` | `)
        table += ` |\n`
    }

    return table
}

export function toBase64(file: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve((reader.result as string).split(`,`).pop()!)
        reader.onerror = error => reject(error)
    })
}

/**
 * 移除左边多余空格
 * @param {string} str
 * @returns string
 */
export function removeLeft(str: string) {
    const lines = str.split(`\n`)
    // 获取应该删除的空白符数量
    const minSpaceNum = lines
        .filter(item => item.trim())
        .map(item => (item.match(/(^\s+)?/)!)[0].length)
        .sort((a, b) => a - b)[0]
    // 删除空白符
    return lines.map(item => item.slice(minSpaceNum)).join(`\n`)
}

export function solveWeChatImage() {
    const clipboardDiv = document.getElementById(`output`)!
    const images = clipboardDiv.getElementsByTagName(`img`)
    for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const width = image.getAttribute(`width`)!
        const height = image.getAttribute(`height`)!
        image.removeAttribute(`width`)
        image.removeAttribute(`height`)
        image.style.width = width
        image.style.height = height
    }
}

export function mergeCss(html: string) {
    return juice(html, {
        inlinePseudoElements: true,
        preserveImportant: true,
    })
}

export function hexToRGBA(hex: string, alpha: number) {
    hex = hex.replace(`#`, ``)
    if (hex.length === 3) {
        hex = hex.split(``).map(char => char + char).join(``)
    }
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
