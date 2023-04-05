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

describe('Testing the authentication page', () => {
  test('The status code should be 200', async () => {
    const response = await request(app).get('/authentication');

    expect(response.statusCode).toBe(200);
  });
  test('The header should be present', async () => {
    const response = await request(app).get('/authentication');
    expect(response.text).toContain('header');
  });
  test('The footer should be present', async () => {
    const response = await request(app).get('/authentication');
    expect(response.text).toContain('footer');
  });
  test('The form for signing in should be present', async () => {
    const response = await request(app).get('/authentication');
    expect(response.text).toContain('form action="/authentication/login"');
  });
  test('The form for signing up connection should be present', async () => {
    const response = await request(app).get('/authentication');
    expect(response.text).toContain('form action="/authentication/register"');
  });
});
