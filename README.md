# curly-tac-toe

## Technic
- [Nuxt V4](https://nuxt.com)
- [pnpm](https://pnpm.io)
- [Cloudflare Workers](https://www.cloudflare.com/products/workers/)
- [Cloudflare Workers AI](https://www.cloudflare.com/products/workers-ai/)

## Setup

Make sure to install the dependencies with [pnpm](https://pnpm.io/installation#using-corepack):

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

## Deploy

Make sure your cloudflare account is linked to terminal
```bash
npx wrangler login
```

Deploying project on cloudflare workers
```bash
npx wrangler deploy
```

[Cloudflare Pages CI](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci).

