import * as request from 'supertest';
import app from '../../src';

export default () =>
  describe('Test the users path', () => {
    it('Add user test', async () => {
      let response: request.Response;
      try {
        response = await request(app).post('/users/signup').send({ phone: '123456' });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('Retrieve user test', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/users/profile');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe(
        '{"activeListings":[],"phone":"123456","soldListings":[],"savedListings":[],"boughtListings":[],"ratings":[],"name":"abcd","userId":"abcd","email":"abcd","picture":"abcd"}',
      );
      expect(response!.status).toBe(200);
    });
  });
