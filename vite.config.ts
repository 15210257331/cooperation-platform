import { defineConfig, loadEnv } from 'vite';
import { viteDefine, createViteProxy, getProxyConfig } from './build';
import { getRootPath, getSrcPath } from './src/utils/index';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ViteCompression from 'vite-plugin-compression';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(({ command, mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  console.log(mode);

  const rootPath = getRootPath();
  const srcPath = getSrcPath();

  const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'true';
  const envConfig = getProxyConfig(viteEnv);

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath
      }
    },
    define: viteDefine,
    plugins: [
      vue(),
      vueJsx(),
      // Naive UI  按需引入
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      viteEnv.VITE_COMPRESS === 'true'
        ? ViteCompression({
            verbose: true,
            disable: false,
            threshold: 10240,
            algorithm: 'gzip',
            ext: '.gz'
          })
        : null
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/style/main.scss";`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8000,
      open: true,
      proxy: createViteProxy(isOpenProxy, envConfig)
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
  };
});
