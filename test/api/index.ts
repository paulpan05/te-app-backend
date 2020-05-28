import root from './root';
import listings from './listings';
import users from './users';

export default () =>
  describe('Controller Tests', () => {
    root();
    listings();
    users();
  });
