import { Injectable } from '@nestjs/common';
import { Configuration } from '@src/config/interfaces';
import { SECRET_PATH, VAULT_API } from '@src/config/vault/vault.constant';
import {
  EnvType,
  VaultAppRoleLoginResponse,
  VaultGetSecretsResponse,
} from '@src/config/vault/vault.interface';
import { ObjUtils } from '@src/shared/utils/obj';
import axios, { Axios, AxiosResponse } from 'axios';

@Injectable()
export class VaultService {
  private token: string | null = null;
  private vaultName: string = process.env.VAULT_NAME!;
  private axiosInstance: Axios;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.VAULT_ADDR,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async authenticateWithAppRole() {
    const response = await this.axiosInstance.post<
      VaultAppRoleLoginResponse,
      AxiosResponse<VaultAppRoleLoginResponse>
    >(VAULT_API.APP_ROLE_LOGIN, {
      role_id: process.env.VAULT_ROLE_ID!,
      secret_id: process.env.VAULT_SECRET_ID!,
    });

    this.token = response.data.auth.client_token;

    // Set default authorization header
    this.axiosInstance.defaults.headers.common['X-Vault-Token'] = this.token;

    return response.data.auth;
  }

  async readSecret<T extends EnvType>(path: string) {
    if (!this.token) {
      throw new Error('No token available. Please authenticate first.');
    }

    const response = await this.axiosInstance.get<VaultGetSecretsResponse<T>>(
      VAULT_API.READ_SECRET(this.vaultName, path),
    );

    return response.data.data.data;
  }

  async buildAppConfiguration() {
    const configuration: Configuration = {} as Configuration;

    await this.authenticateWithAppRole();

    await Promise.all(
      Object.entries(SECRET_PATH).map(async ([key, value]) => {
        const secrets = await this.readSecret(value);

        configuration[key] = ObjUtils.convertObjKeysToCamelCase<EnvType>(secrets);
      }),
    );

    return configuration;
  }
}
