const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const advertisement = require('../models/advertisement');

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect('mongodb://localhost/mon_bon_appart_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.log('CONNECT', err))
      .finally(console.log('Test database connected !'));
});

afterEach(async () => {
  await advertisement.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Testing the ads page', () => {
  test('The status code should be 200', async () => {
    const response = await request(app).get('/ad');

    expect(response.statusCode).toBe(200);
  });
  test('The header should be present', async () => {
    const response = await request(app).get('/ad');
    expect(response.text).toContain('header');
  });
  test('The footer should be present', async () => {
    const response = await request(app).get('/ad');
    expect(response.text).toContain('footer');
  });
  test('If there is no ads, there should be a h2', async () => {
    const response = await request(app).get('/ad');
    expect(response.text).toContain('h2');
  });
  test('If there is ads, there should be a list', async () => {
    await advertisement.create({
      title: 'TestTitle',
      type: 'Vente',
      publication_status: 'Publiée',
      publication_property: 'Disponible',
      description: 'TestDescription',
      price: 10000,
      date: '1982-01-30T00:00:00.000+00:00',
    });
    const response = await request(app).get('/ad');
    expect(response.text).toContain('li');
  });
});
