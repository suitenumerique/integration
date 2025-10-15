import { defineConfig } from 'vite'


export default defineConfig({
  server: {
    proxy: {
      '^/widgets/dist/(.+)\\.js$': {
        target: 'http://localhost:8931',
        rewrite: (path) => {
          const match = path.match(/^\/widgets\/dist\/(.+)\.js$/)
          if (match) {
            return `/src/widgets/${match[1]}/main.ts`
          }
          return path
        }
      }
    }
  }
})