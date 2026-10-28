export {}

declare global {
  namespace Cloudflare {
    interface Env {
      AI: Ai
    }
  }
}
