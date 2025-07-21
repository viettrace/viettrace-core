import { Global, Module } from '@nestjs/common';
import { DbService } from '@src/db/db.service';

@Global()
@Module({
  imports: [],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
