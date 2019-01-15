import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'app-todo',
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.css',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
