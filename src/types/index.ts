import type { PropertiesHyphen } from 'csstype'

import type { Token } from 'marked'

export type Elements = `container` | `h1box` | `h1predix` | `h1suffix` | `h1span` |
  `h2box` | `h2predix` | `h2suffix` | `h2span` |
  `h3box` | `h3predix` | `h3suffix` | `h3span` |
  `h4box` | `h4predix` | `h4suffix` | `h4span` |
  `h5box` | `h5predix` | `h5suffix` | `h5span` |
  `h6box` | `h6predix` | `h6suffix` | `h6span` |
  `p` | `blockquote` | `blockquotep` | `pre` | `code` | `image` | `ol` |
  `ul` | `footnotes` | `figure` | `hr` | `li` | `codespan` |
  `a_link` | `wx_link` | `table` | `th` | `td` | `figcaption` | `strong`

interface CustomCSSProperties {
    [`--md-primary-color`]?: string
    [key: `--${string}`]: string | undefined
}

export type ExtendedProperties = PropertiesHyphen & CustomCSSProperties

export interface Theme {
    base: ExtendedProperties
    elements: Record<Elements, ExtendedProperties>
}

export interface IOpts {
    theme: Theme
    fonts: string
    size: string
    isUseIndent: boolean
    legend?: string
    citeStatus?: boolean
}

export type ThemeStyles = Record<Elements, ExtendedProperties>

export interface IConfigOption<VT = string> {
    label: string
    value: VT
    desc: string
}

/**
 * Options for the `markedAlert` extension.
 */
export interface AlertOptions {
    className?: string
    variants?: AlertVariantItem[]
    styles?: ThemeStyles
}

/**
 * Configuration for an alert type.
 */
export interface AlertVariantItem {
    type: string
    icon: string
    title?: string
    titleClassName?: string
}

/**
 * Represents an alert token.
 */
export interface Alert {
    type: `alert`
    meta: {
        className: string
        variant: string
        icon: string
        title: string
        titleClassName: string
    }
    raw: string
    text: string
    tokens: Token[]
}
