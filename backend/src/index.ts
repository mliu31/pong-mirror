import env from './util/env';
import server from './server';

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
