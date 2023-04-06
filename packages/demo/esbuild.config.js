const esbuild = require('esbuild');

const options = {
  entryPoints: ['src/app.ts'],
  outdir: 'dist',
  sourcemap: true,
  bundle: true,
  platform: 'node',
  minify: true,
  external: ['pg', 'better-sqlite3', 'tedious', 'mysql', 'oracledb', 'pg-query-stream', 'sqlite3']
};

esbuild.build(options).catch(err => {
  console.error(err);
  process.exit(1);
});
