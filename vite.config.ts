import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ViteCompression from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { viteDefine, createViteProxy, getProxyConfig } from './build'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
const path = require('path')

export default defineConfig(({ command, mode }) => {
  // 读取环境配置文件
  const viteEnv = loadEnv(mode, process.cwd())
  console.log(command, mode)

  const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'true'

  const proxyConfig = getProxyConfig(viteEnv)

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': path.resolve(process.cwd()),
        '@': path.resolve(process.cwd()) + '/src'
      }
    },
    // 在开发时会被定义为全局变量，而在构建时则是静态替换
    define: viteDefine,
    plugins: [
      vue(),
      vueJsx(),
      // 配置Naive UI的按需自动引入
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      // 生产环境开启压缩
      viteEnv.VITE_COMPRESS === 'true'
        ? ViteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz'
          })
        : null,
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/svg')],
        // 指定symbolId格式 dir是文件夹名 name 是svg文件名
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/style/main.scss","@/style/variable.scss";`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8000,
      open: false,
      proxy: createViteProxy(isOpenProxy, proxyConfig)
    },
    preview: {
      port: 5050
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false
      }
    }
  }
})
