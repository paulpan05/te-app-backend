import * as request from 'supertest';
import app from '../../src';

export default () =>
  describe('Test the root path', () => {
    it('Resource not found test', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.status).toBe(404);
    });
  });
