import root from './root';
import user from './user';
import listings from './listings';

export default () =>
  describe('Controller Tests', () => {
    root();
    user();
    listings();
  });
