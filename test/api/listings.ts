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
    it('Unsave a listing', async () => {
      let response: request.Response;
      try {
        response = await request(app)
          .delete('/users/unsave-listing')
          .send({ listingId: '12324', creationTime: 12345 });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('Listings by ids', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/listings/byIds?ids=12324&creationTimes=12345');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe(
        '[{"sold":false,"comments":[],"soldTo":null,"creationTime":12345,"description":"asdfsdaf","listingId":"12324","searchTitle":"asdf","title":"asdf","userId":"abcd","pictures":[],"tags":[],"price":1234,"location":"asdf","savedCount":0}]',
      );
      expect(response!.status).toBe(200);
    });
    it('Listing update', async () => {
      let response: request.Response;
      try {
        response = await request(app)
          .put('/listings/update')
          .send({
            listingId: '12324',
            creationTime: 12345,
            comments: [['12233', '23344', '12345']],
            tags: ['hello', 'world'],
            pictures: ['asdfb', 'ewfgsfd'],
          });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('Listing update remove tags', async () => {
      let response: request.Response;
      try {
        response = await request(app)
          .put('/listings/update')
          .send({
            listingId: '12324',
            creationTime: 12345,
            tags: ['hello', 'world'],
            pictures: ['asdfb', 'ewfgsfd'],
            deletePictures: true,
            deleteTags: true,
          });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
  });
