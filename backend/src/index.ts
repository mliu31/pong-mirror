import server from './server';
import env from './util/env';

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
