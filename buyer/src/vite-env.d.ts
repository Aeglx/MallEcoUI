/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare const BASE: {
  API_DEV: {
    common: string
    buyer: string
    seller: string
    manager: string
  }
  API_PROD: {
    common: string
    buyer: string
    seller: string
    manager: string
  }
  PC_URL: string
  WAP_URL: string
  PREFIX: string
}

declare module 'js-cookie' {
  export interface CookieAttributes {
    expires?: number | Date
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  }

  export interface CookiesStatic {
    get(name: string): string | undefined
    getJSON(name: string): any
    set(name: string, value: string | object, options?: CookieAttributes): string | undefined
    remove(name: string, options?: CookieAttributes): void
    withAttributes(attributes: CookieAttributes): CookiesStatic
    withConverter(converter: any): CookiesStatic
  }

  const Cookies: CookiesStatic
  export default Cookies
}

