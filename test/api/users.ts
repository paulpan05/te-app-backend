import * as request from 'supertest';
import app from '../../src';

export default () =>
  describe('Test the users path', () => {
    it('Successful test', async () => {
      let response: request.Response;
      try {
        response = await request(app)
          .post('/users/signup')
          .send({ phone: '123456', location: 'Los Angeles' });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
  });
