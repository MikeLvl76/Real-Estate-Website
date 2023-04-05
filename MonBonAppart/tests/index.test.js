const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const account = require('../models/account');

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect('mongodb://localhost/mon_bon_appart_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.log('CONNECT', err))
      .finally(console.log('Test database connected !'));
});

afterEach(async () => {
  await account.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Testing the index page', () => {
  test('The status code should be 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
  test('The header should be present', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('header');
  });
  test('The footer should be present', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('footer');
  });
  test('If there is no admin, there should be a form', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('form');
  });
  test('If there is an admin, there should be a picture', async () => {
    await account.create({
      admin: true,
      firstname: 'TestFirstName',
      lastname: 'TestLastName',
      username: 'TestUsername',
      email: 'Test@test.fr',
      password: 'TestPassword',
    });
    const response = await request(app).get('/');
    expect(response.text).toContain('background-image');
  });
});
