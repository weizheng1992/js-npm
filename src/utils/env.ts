enum EnvTestConfig {
  URL = 'https://opentest.kaikeba.com',
}

enum EnvProdConfig {
  URL = 'https://open2.kaikeba.com',
}

export function getAppEnvConfig(env: string) {
  return env === 'test' ? EnvTestConfig : EnvProdConfig;
}
