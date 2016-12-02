import path from 'path';
import boot from 'loopback-boot';
import loopback from 'loopback';

const app = loopback();

boot(app, path.resolve(__dirname, 'server'), (err) => {
  if (err) {
    throw err;
  }
});

export default app;
