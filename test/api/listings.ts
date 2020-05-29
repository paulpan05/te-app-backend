import * as request from 'supertest';
import app from '../../src';

export default () =>
  describe('Test the listings path', () => {
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
    it('Successful test', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/listings');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"Items":[]}');
      expect(response!.status).toBe(200);
    });
    it('Listings by ids', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/listings/byIds?ids=123,456&creationTimes=123,234');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('[]');
      expect(response!.status).toBe(200);
    });
    it('Search term query', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/listings/search?searchTerm=ase');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('[]');
      expect(response!.status).toBe(200);
    });
    it('Add a listing', async () => {
      let response: request.Response;
      try {
        response = await request(app).post('/users/make-listing').send({
          listingId: '12324',
          title: 'asdf',
          price: 1234,
          description: 'asdfsdaf',
          location: 'asdf',
          tags: [],
          pictures: [],
          creationTime: 12345,
        });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('Save a listing', async () => {
      let response: request.Response;
      try {
        response = await request(app)
          .post('/users/save-listing')
          .send({ listingId: '12324', creationTime: 12345 });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
  });
