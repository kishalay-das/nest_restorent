import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, Req, BadRequestException, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { RestorentService } from './restorent.service';
import { CreateRestorentDto } from './dto/create-restorent.dto';
import { UpdateRestorentDto } from './dto/update-restorent.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'config/multer.config';
import { JwtAuthGuard } from 'src/auth/guards/Auth.guard';
import { RolesGuard } from 'src/auth/guards/Roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/schema/user.schema';
import { CurrentUser } from 'src/auth/decorators/current-user.decoraters';

@Controller('restorent')
export class RestorentController {
  constructor(private readonly restorentService: RestorentService) { }

  @Roles(UserRole.Restorent)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post('register')
  async create(@Body() createRestorentDto: CreateRestorentDto, @CurrentUser() user: any, @UploadedFile() file: Express.Multer.File, @Query('lat') lat: number, @Query('lng') lng: number) {
    return await this.restorentService.create(createRestorentDto,user.id.toString(), file, +lat, +lng);
  }

  @Get('nearby')
  async findNearBy(@Query('lat') lat: string, @Query('lng') lng: string) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('lat and lng must be valid numbers');
    }

    return await this.restorentService.findAllNearBy(latitude, longitude, 10);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.restorentService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRestorentDto: UpdateRestorentDto) {
    return await this.restorentService.update(+id, updateRestorentDto);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.restorentService.remove(id, user.id.toString());
  }

  @Roles(UserRole.Restorent)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('available/:id')
  async availability(
    @Query('open') open: string,
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const isOpen = open === 'true';
    return await this.restorentService.availability(id, isOpen, user.id);
  }

}

