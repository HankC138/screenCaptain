module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        "devContentSecurityPolicy": "default-src 'self' 'unsafe-eval' 'unsafe-inline' static: http: https: ws: data:",
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
            {
              html: './src/snipRender/index.html',
              js: './src/snipRender/index.js',
              name: 'snip_window',
              preload: {
                js: './src/snipRender/snipperPreload.js',
              },
            },
          ],
        },
      },
    },
  ],
};
