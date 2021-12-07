import PaySdk from '../src/init';

describe('blah', () => {
  it('works', () => {
    PaySdk.init('3333');
  });
});

describe('env', () => {
  it('works', () => {
    expect(PaySdk.getEnv()).toBe('3333');
  });
});
