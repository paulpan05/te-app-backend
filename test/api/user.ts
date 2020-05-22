import * as request from 'supertest';
import app from '../../src';

export default () =>
  describe('Test the user path', () => {
    it('Unauthorized test', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/users');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.status).toBe(401);
    });
  });
