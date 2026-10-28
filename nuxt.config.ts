// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: [
    '@nuxt/eslint',
  ],

  // https://devtools.nuxt.com
  devtools: { enabled: false },

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens

  compatibilityDate: '2026-10-15',

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      // Génère .output/server/wrangler.json à partir de wrangler.jsonc : `wrangler deploy` le prend
      // depuis ce dossier.
      deployConfig: true,
      // Nitro s'appuie sur des API Node (Buffer…) : nodejs_compat les fournit, sans polyfills dans le bundle.
      nodeCompat: true,
      wrangler: {
        ai: {
          binding: 'AI',
          remote: true,
        },
      },
    },
  },

  // https://eslint.nuxt.com
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },

})
