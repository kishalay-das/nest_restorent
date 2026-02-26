import { Test, TestingModule } from '@nestjs/testing';
import { RestorentService } from './restorent.service';

describe('RestorentService', () => {
  let service: RestorentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestorentService],
    }).compile();

    service = module.get<RestorentService>(RestorentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
