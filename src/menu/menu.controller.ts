import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { multerConfig } from 'config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQuaryDto } from 'common/dto/pagination-quary';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/Auth.guard';
import { RolesGuard } from 'src/auth/guards/Roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decoraters';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles(UserRole.Restorent)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post('create/:id')
  async create(@Body() createMenuDto: CreateMenuDto, @CurrentUser() user: any,@UploadedFile() file: Express.Multer.File, @Param() param: any) {
    return await this.menuService.create(createMenuDto, param.id, file, user.id);
  }

  @Get(':id')
  findAll(@Param() id: string, @Query() quary: PaginationQuaryDto) {
    const {page = 1, limit = 10} = quary
    return this.menuService.findAll(id, page, limit);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
