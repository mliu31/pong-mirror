import env from './env';
import server from './server';
import './io';

server.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
