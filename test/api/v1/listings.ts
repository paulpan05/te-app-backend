import * as request from 'supertest';
import app from '../../../src';

export default () =>
  describe('Test the listings path', () => {
    it('Successful test', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/api/v1/listings');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('[]');
      expect(response!.status).toBe(200);
    });
  });
