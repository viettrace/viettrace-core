import { VaultService } from '@src/config/vault/vault.service';

export default async () => {
  return process.env.NODE_ENV === 'production'
    ? {
        ...(await (async () => {
          const vaultService = new VaultService();
          const configuration = await vaultService.buildAppConfiguration();
          return configuration;
        })()),
      }
    : {
        app: {
          port: parseInt(process.env.PORT || '3000', 10),
        },
        db: {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'viettrace',
        },
      };
};
