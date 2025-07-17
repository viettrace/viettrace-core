import { ApiHideProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  statusCode!: number;
  message!: string;

  @ApiHideProperty()
  data!: T;

  success: boolean | undefined;
  requestDate!: Date;
}
