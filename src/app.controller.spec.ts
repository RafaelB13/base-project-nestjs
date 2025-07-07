import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('should return info about the system', async () => {
      const result = await appController.healthCheck();
      expect(result).toEqual(
        expect.objectContaining({
          status: 'ok',
          platform: expect.any(String),
          arch: expect.any(String),
          uptime: expect.any(Number),
          cpu: expect.objectContaining({
            model: expect.any(String),
            cores: expect.any(Number),
            speedGHz: expect.anything(),
            usagePercent: expect.any(Number),
          }),
          memory: expect.objectContaining({
            totalGB: expect.any(Number),
            freeGB: expect.any(Number),
            usedGB: expect.any(Number),
            usagePercent: expect.any(Number),
          }),
        }),
      );
    });
  });
});
