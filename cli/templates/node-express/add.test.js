const request = require('supertest');
const app = require('./index');

describe('add endpoint', () => {
  it('returns sum', async () => {
    const res = await request(app)
      .post('/add')
      .set('Authorization', 'Bearer test-token')
      .set('X-CSRF-Token', 'valid-token')
      .send({ a: 2, b: 3 });
    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(5);
  });
});
