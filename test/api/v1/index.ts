import root from './root';
import user from './user';

export default () =>
  describe('API Tests', () => {
    root();
    user();
  });
