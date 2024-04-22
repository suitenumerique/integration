/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_LASUITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
