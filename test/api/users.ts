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
    it('Test make listing', async () => {
      let response: request.Response;
      try {
        response = await request(app).post('/users/make-listing').send({
          listingId: '123456',
          creationTime: 2352352,
          title: 'asdfsdaf',
          price: 123123,
          description: '1231232143',
          location: '112423543452',
          tags: [],
          pictures: [],
        });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
  });
