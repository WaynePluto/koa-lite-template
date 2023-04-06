const esbuild = require('esbuild');

const options = {
  entryPoints: ['src/lib.ts'],
  outdir: 'dist',
  sourcemap: true,
  bundle: true,
  platform: 'node',
  minify: true,
  external: ['koa', 'koa-compose']
};

esbuild.build(options).catch(err => {
  console.error(err);
  process.exit(1);
});
