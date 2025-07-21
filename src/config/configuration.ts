import { configurationSchema } from '@src/config/schemas';
import { VaultService } from '@src/config/vault/vault.service';
import { NODE_ENV } from '@src/shared/constants/node-env.constant';

export default async () => {
  return process.env.NODE_ENV === NODE_ENV.PRODUCTION
    ? {
        ...(await (async () => {
          const vaultService = new VaultService();

          const configuration = await vaultService.buildAppConfiguration();

          return configurationSchema.parse(configuration);
        })()),
      }
    : configurationSchema.parse({
        app: {
          baseUrl: process.env.BASE_URL,
          port: process.env.PORT,
          logLevel: process.env.LOG_LEVEL,
          logDir: process.env.LOG_DIR,
          swaggerEnabled: process.env.SWAGGER_ENABLED,
          apiTimeoutMs: process.env.API_TIMEOUT_MS,
        },
        db: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        },
      });
};
