import root from './root';
import user from './user';

export default () =>
  describe('Controller Tests', () => {
    root();
    user();
  });
