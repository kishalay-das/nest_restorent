import { Test, TestingModule } from '@nestjs/testing';
import { RestorentController } from './restorent.controller';
import { RestorentService } from './restorent.service';

describe('RestorentController', () => {
  let controller: RestorentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestorentController],
      providers: [RestorentService],
    }).compile();

    controller = module.get<RestorentController>(RestorentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
