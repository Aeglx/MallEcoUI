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

declare module 'js-cookie'

