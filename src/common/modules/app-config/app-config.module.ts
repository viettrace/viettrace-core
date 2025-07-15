import { Global, Module } from '@nestjs/common';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';

@Global()
@Module({
  imports: [],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
