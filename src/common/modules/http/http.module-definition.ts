import { ConfigurableModuleBuilder } from '@nestjs/common';
import { HttpModuleOptions } from '@src/common/modules/http/http.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<HttpModuleOptions>().build();
