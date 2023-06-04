import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    name: "Service Status Indicator Client",
    executableName: "service-status-indicator-client",
    icon: 'src/assets/server-ok',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: "src/assets/server-ok.ico",
      iconUrl: "https://res.cloudinary.com/dpyznz7dm/image/upload/v1685806431/service-status-indicator/server-ok_tqqujk.ico"
    }),
    new MakerZIP({}, ['darwin', 'linux']),
    new MakerRpm({}),
    new MakerDeb({})
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: 'RemiZlatinis',
          name: 'service-status-indicator-client'
        },
        prerelease: true,
        draft: true
      }
    }
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
