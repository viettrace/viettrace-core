import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/modules/app/app.controller';
import { AppService } from '../../../src/modules/app/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "pong!"', () => {
      expect(appController.ping()).toBe('pong!');
    });
  });
});
