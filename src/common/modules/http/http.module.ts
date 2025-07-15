import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from '@src/common/modules/http/http.module-definition';
import { HttpService } from '@src/common/modules/http/http.service';

@Module({
  imports: [],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule extends ConfigurableModuleClass {}
