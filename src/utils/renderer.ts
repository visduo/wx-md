import type { ExtendedProperties, IOpts, ThemeStyles } from '@/types'
import type { PropertiesHyphen } from 'csstype'
import type { Renderer, RendererObject, Tokens } from 'marked'
import { cloneDeep, toMerged } from 'es-toolkit'
import hljs from 'highlight.js'

import { marked } from 'marked'
import { getStyleString } from '.'

marked.use()

function buildTheme({ theme: _theme, fonts, size, isUseIndent }: IOpts): ThemeStyles {
    const theme = cloneDeep(_theme)
    const base = toMerged(theme.base, {
        'font-family': fonts,
        'font-size': size,
    })

    if (isUseIndent) {
        theme.elements.p = {
            'text-indent': `2em`,
            ...theme.elements.p,
        }
    }

    const mergeStyles = (styles: Record<string, PropertiesHyphen>): Record<string, ExtendedProperties> =>
        Object.fromEntries(
            Object.entries(styles).map(([ele, style]) => [ele, toMerged(base, style)]),
        )
    return {
        ...mergeStyles(theme.elements),
    } as ThemeStyles
}

function buildAddition(): string {
    return `
    <style>
      .preview-wrapper pre::before {
        position: absolute;
        top: 0;
        right: 0;
        color: #ccc;
        text-align: center;
        font-size: 0.8em;
        padding: 5px 10px 0;
        line-height: 15px;
        height: 15px;
        font-weight: 600;
      }
    </style>
  `
}

function getStyles(styleMapping: ThemeStyles, tokenName: string, addition: string = ``): string {
    const dict = styleMapping[tokenName as keyof ThemeStyles]
    if (!dict) {
        return ``
    }
    const styles = getStyleString(dict)
    return `style="${styles}${addition}"`
}

function buildFootnoteArray(footnotes: [number, string, string][]): string {
    return footnotes
        .map(([index, title, link]) =>
            link === title
                ? `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code>: <i style="word-break: break-all">${title}</i><br/>`
                : `<code style="font-size: 90%; opacity: 0.6;">[${index}]</code> ${title}: <i style="word-break: break-all">${link}</i><br/>`,
        )
        .join(`\n`)
}

function transform(legend: string, text: string | null, title: string | null): string {
    const options = legend.split(`-`)
    for (const option of options) {
        if (option === `alt` && text) {
            return text
        }
        if (option === `title` && title) {
            return title
        }
    }
    return ``
}

const macCodeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" width="45px" height="13px" viewBox="0 0 450 130">
    <ellipse cx="50" cy="65" rx="50" ry="52" stroke="rgb(220,60,54)" stroke-width="2" fill="rgb(237,108,96)" />
    <ellipse cx="225" cy="65" rx="50" ry="52" stroke="rgb(218,151,33)" stroke-width="2" fill="rgb(247,193,81)" />
    <ellipse cx="400" cy="65" rx="50" ry="52" stroke="rgb(27,161,37)" stroke-width="2" fill="rgb(100,200,86)" />
  </svg>
`.trim()

export function initRenderer(opts: IOpts) {
    const footnotes: [number, string, string][] = []
    let footnoteIndex: number = 0
    let styleMapping: ThemeStyles = buildTheme(opts)
    let listIndex: number = 0
    let isOrdered: boolean = false

    function styles(tag: string, addition: string = ``): string {
        return getStyles(styleMapping, tag, addition)
    }

    function styledContent(styleLabel: string, content: string, tagName?: string): string {
        const tag = tagName ?? styleLabel
        return `<${tag} ${styles(styleLabel)}>${content}</${tag}>`
    }

    function addFootnote(title: string, link: string): number {
        footnotes.push([++footnoteIndex, title, link])
        return footnoteIndex
    }

    function reset(newOpts: Partial<IOpts>): void {
        footnotes.length = 0
        footnoteIndex = 0
        setOptions(newOpts)
    }

    function setOptions(newOpts: Partial<IOpts>): void {
        opts = { ...opts, ...newOpts }
        styleMapping = buildTheme(opts)
        marked.use()
    }

    const buildFootnotes = () => {
        if (!footnotes.length) {
            return ``
        }

        return (
            styledContent(`h4`, `引用链接`)
            + styledContent(`footnotes`, buildFootnoteArray(footnotes), `p`)
        )
    }

    const renderer: RendererObject = {
        heading({ tokens, depth }: Tokens.Heading) {
            const text = this.parser.parseInline(tokens)
            const tag = `h${depth}`
            // return styledContent(tag, text)
            return `<${tag} ${styles(`${tag}box`)}>
                        <span ${styles(`${tag}prefix`)}></span>
                        <span ${styles(`${tag}span`)}>${text}</span>
                        <span ${styles(`${tag}suffix`)}></span>
                    </${tag}>`
        },

        paragraph({ tokens }: Tokens.Paragraph): string {
            const text = this.parser.parseInline(tokens)
            const isFigureImage = text.includes(`<figure`) && text.includes(`<img`)
            const isEmpty = text.trim() === ``
            if (isFigureImage || isEmpty) {
                return text
            }
            return styledContent(`p`, text)
        },

        blockquote({ tokens }: Tokens.Blockquote): string {
            let text = this.parser.parse(tokens)
            text = text.replace(/<p .*?>/g, `<p ${styles(`blockquotep`)}>`)
            return styledContent(`blockquote`, text)
        },

        code({ text, lang = `` }: Tokens.Code): string {
            const langText = lang.split(` `)[0]
            const language = hljs.getLanguage(langText) ? langText : `plaintext`
            let highlighted = hljs.highlight(text, { language }).value
            highlighted = highlighted
                .replace(/\t/g, `    `)
                .replace(/\r\n/g, `<br/>`)
                .replace(/\n/g, `<br/>`)
                .replace(/(>[^<]+)|(^[^<]+)/g, str => str.replace(/\s/g, `&nbsp;`))
            const span = `<span class="mac-sign" style="padding: 10px 14px 0; font-size: 0.8em" hidden>${macCodeSvg}</span>`
            const code = `<code class="language-${lang}" ${styles(`code`)}>${highlighted}</code>`
            return `<pre class="hljs code__pre" ${styles(`pre`)}>${span}${code}</pre>`
        },

        codespan({ text }: Tokens.Codespan): string {
            return styledContent(`codespan`, text, `code`)
        },

        listitem(item: Tokens.ListItem): string {
            const prefix = isOrdered ? `<span style="margin-right: 4px;">${listIndex + 1}.</span>` : `<span style="font-family: Consolas, Monaco, Menlo, monospace; margin-right: 6px;">•</span>`
            const content = item.tokens.map(t => (this[t.type as keyof Renderer] as <T>(token: T) => string)(t)).join(``)
            return styledContent(`li`, `<span>${prefix}${content}</span>`, `li`)
        },

        list({ ordered, items, start = 1 }: Tokens.List): string {
            const listItems = []
            for (let i = 0; i < items.length; i++) {
                isOrdered = ordered
                listIndex = Number(start) + i - 1
                const item = items[i]
                listItems.push(this.listitem(item))
            }
            const label = ordered ? `ol` : `ul`
            return styledContent(label, listItems.join(``))
        },

        image({ href, title, text }: Tokens.Image): string {
            let subText = ``
            if (text) {
                subText = styledContent(`figcaption`, transform(opts.legend!, text, title))
            }
            const figureStyles = styles(`figure`)
            const imgStyles = styles(`image`)
            return `<figure ${figureStyles}><img ${imgStyles} src="${href}" title="${title}" alt="${text}"/>${subText}</figure>`
        },

        link({ href, title, text, tokens }: Tokens.Link): string {
            const parsedText = this.parser.parseInline(tokens)
            if (href.startsWith(`https://mp.weixin.qq.com`)) {
                return `<a href="${href}" title="${title || text}" ${styles(`wx_link`)}>${parsedText}</a>`
            }
            if (href === text) {
                return parsedText
            }
            if (opts.citeStatus) {
                const ref = addFootnote(title || text, href)
                return `<span ${styles(`a_link`)}>${parsedText}<sup>[${ref}]</sup></span>`
            }
            return `<span ${styles(`a_link`)}>${parsedText}</span>`
        },

        strong({ tokens }: Tokens.Strong): string {
            return styledContent(`strong`, this.parser.parseInline(tokens))
        },

        em({ tokens }: Tokens.Em): string {
            return styledContent(`em`, this.parser.parseInline(tokens))
        },

        table({ header, rows }: Tokens.Table): string {
            const headerRow = header
                .map(cell => this.tablecell(cell))
                .join(``)

            const body = rows
                .map((row) => {
                    const rowContent = row
                        .map(cell => this.tablecell(cell))
                        .join(``)
                    return styledContent(`tr`, rowContent)
                })
                .join(``)
            return `
            <section ${styles(`table`)}>
            <table style="margin-bottom: 0!important;">
                <thead ${styles(`thead`)}>${headerRow}</thead>
                <tbody>${body}</tbody>
            </table>
            </section>
            `
        },

        tablecell(token: Tokens.TableCell): string {
            const text = this.parser.parseInline(token.tokens)
            if (token.header) {
                return `<th ${styles(`th`)}>${text}</th>`
            }
            return `<td ${styles(`td`)}>${text}</td>`
        },

        hr(token: Tokens.Hr): string {
            if (token.raw.includes(`***`)) {
                // return `<hr style="margin-top: 2.125em;">`
                return `<hr ${styles(`hr`, `;margin: 2.325em 0px 1.875em 0px;`)}>`
            }
            return styledContent(`hr`, ``)
        },
    }

    marked.use({ renderer })

    return {
        buildAddition,
        buildFootnotes,
        setOptions,
        reset,
        createContainer(content: string) {
            return styledContent(`container`, content, `section`)
        },
    }
}
