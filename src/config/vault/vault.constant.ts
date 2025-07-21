export const SECRET_PATH = {
  app: 'app',
  db: 'db',
};

export const VAULT_API = {
  APP_ROLE_LOGIN: '/v1/auth/approle/login',
  READ_SECRET: (vaultName: string, secretPath: string) => `/v1/kv/data/${vaultName}/${secretPath}`,
};
