import root from './root';
import listings from './listings';

export default () =>
  describe('Controller Tests', () => {
    root();
    listings();
  });
