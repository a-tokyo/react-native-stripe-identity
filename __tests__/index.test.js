import StripeIdentityDefault from '../src';

describe('index', () => {
  it('exports all values', () => {
    expect(StripeIdentityDefault).toEqual(expect.any(Function));
  });
});
