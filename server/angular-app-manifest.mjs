
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 740, hash: 'e5452f49925c857379c5d8c25e1750c590237419162225f652ec76222aa7ae4b', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1008, hash: 'e37d0f8990f747b1b111d0c72f52ae80604ee136b2604552c9d6c65b2741fd7a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-SQQ46U2I.css': {size: 1082, hash: 'GdkzADGDkjE', text: () => import('./assets-chunks/styles-SQQ46U2I_css.mjs').then(m => m.default)}
  },
};
