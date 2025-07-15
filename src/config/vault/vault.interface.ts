import { AppEnv, DbEnv } from '@src/shared/interfaces/env.interface';

export type EnvType = Record<string, any> & (AppEnv | DbEnv);

interface VaultResponseBase {
  request_id: string;
  lease_id: string;
  renewable: boolean;
  lease_duration: number;
  wrap_info: any;
  warnings: string[] | null;
  mount_type: string;
}

export interface VaultGetSecretsResponse<T extends EnvType> extends VaultResponseBase {
  data: {
    data: T;
    metadata: {
      created_time: string;
      custom_metadata: any;
      deletion_time: string;
      destroyed: boolean;
      version: number;
      [key: string]: any;
    };
  };
  auth: null;
}

export interface VaultAppRoleLoginResponse extends VaultResponseBase {
  data: null;
  auth: {
    client_token: string;
    accessor: string;
    policies: string[];
    token_policies: string[];
    metadata: {
      role_name: string;
      [key: string]: any;
    };
    lease_duration: number;
    renewable: boolean;
    entity_id: string;
    token_type: string;
    orphan: boolean;
    mfa_requirement: any;
    num_uses: number;
  };
}
