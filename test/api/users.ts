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
        '{"activeListings":[],"phone":"123456","soldListings":[],"savedListings":[],"boughtListings":[],"ratings":[],"searchName":"abcd","name":"abcd","listingsToRate":[],"userId":"abcd","email":"abcd","picture":"abcd"}',
      );
      expect(response!.status).toBe(200);
    });
    it('Listing search by term', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/listings/search?searchTerm=asdf');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe(
        '[{"sold":false,"comments":[["12233","23344","12345"]],"soldTo":null,"creationTime":12345,"description":"asdfsdaf","listingId":"12324","searchTitle":"asdf","title":"asdf","userId":"abcd","pictures":[],"tags":[],"price":1234,"location":"asdf","savedCount":0}]',
      );
      expect(response!.status).toBe(200);
    });
    it('Remove the listing', async () => {
      let response: request.Response;
      try {
        response = await request(app)
          .delete('/users/delete-listing')
          .send({ listingId: '12324', creationTime: 12345, tags: [] });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('Listing search by term again', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/listings/search?searchTerm=asdf');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('[]');
      expect(response!.status).toBe(200);
    });
    it('Search user', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/users/search?name=abcd');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe(
        '[{"activeListings":[],"phone":"123456","soldListings":[],"savedListings":[],"boughtListings":[],"ratings":[],"searchName":"abcd","name":"abcd","listingsToRate":[],"userId":"abcd","email":"abcd","picture":"abcd"}]',
      );
      expect(response!.status).toBe(200);
    });
    it('Rate user', async () => {
      let response: request.Response;
      try {
        response = await request(app).post('/users/add-listing-to-rate').send({
          buyerId: 'abcd',
          listingId: '12324',
          creationTime: 12345,
        });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('User update', async () => {
      let response: request.Response;
      try {
        response = await request(app).put('/users/update').send({ name: 'Paul Pan' });
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe('{"message":"Success"}');
      expect(response!.status).toBe(200);
    });
    it('Search user Paul', async () => {
      let response: request.Response;
      try {
        response = await request(app).get('/users/search?name=Paul%20Pan');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(response!.text).toBe(
        '[{"activeListings":[],"phone":"123456","savedListings":[],"soldListings":[],"boughtListings":[],"ratings":[],"searchName":"paul pan","name":"Paul Pan","listingsToRate":[["12324",12345,"abcd"]],"userId":"abcd","email":"abcd","picture":"abcd"}]',
      );
      expect(response!.status).toBe(200);
    });
  });
