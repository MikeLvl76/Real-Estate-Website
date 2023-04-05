const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect('mongodb://localhost/mon_bon_appart_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.log('CONNECT', err))
      .finally(console.log('Test database connected !'));
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Testing the error page', () => {
  test('The status code should be 200', async () => {
    const response = await request(app).get('/error');

    expect(response.statusCode).toBe(200);
  });
  test('The header should be present', async () => {
    const response = await request(app).get('/error');
    expect(response.text).toContain('header');
  });
  test('The footer should be present', async () => {
    const response = await request(app).get('/error');
    expect(response.text).toContain('footer');
  });
  test('There should be an error text', async () => {
    const response = await request(app).get('/error');
    expect(response.text).toContain('Erreur');
  });
});
