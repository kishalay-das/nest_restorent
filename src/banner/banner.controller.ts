import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'config/multer.config';
import { JwtAuthGuard } from 'src/auth/guards/Auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post()
  create(@Body() createBannerDto: CreateBannerDto, @UploadedFile() file: Express.Multer.File) {
    return this.bannerService.create(createBannerDto, file);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannerService.update(+id, updateBannerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}
