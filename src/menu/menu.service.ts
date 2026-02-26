import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MenuItem } from './schema/menu.schema';
import { Model } from 'mongoose';
import { UploadService } from 'src/upload/upload.service';
import { IPaginationResponseFormat } from 'common/interface/pagination-interface';
import { Restaurant } from 'src/restorent/schema/restorent.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuItem.name) private menuSchema: Model<MenuItem>,
    @InjectModel(Restaurant.name) private restorentSchema: Model<Restaurant>,
    private uploadservice: UploadService
  ) { }
  async create(createMenuDto: CreateMenuDto, restorentId: string, file: any, userId: string) {    
    const restorent = await this.restorentSchema.findById(restorentId)

    if (restorent?.ownerId.toString() !== userId.toString()) {
      throw new UnauthorizedException('You are not have the permissin to do so!')
    }
    const upload = await this.uploadservice.upload(file)
    
    const menuItem = await this.menuSchema.create({
      restaurantId: restorent._id,
      name: createMenuDto.name,
      description: createMenuDto.description,
      price: createMenuDto.price,
      discountPrice: createMenuDto.discountPrice,
      itemType: createMenuDto.itemType,
      image: upload.secure_url,
      imageId: upload.public_id
    })
    return {
      message:`menu added to ${restorentId.toString()}`,
      menuItem
    }
  }

  async findAll(id: string, page: number, limit: number): Promise<IPaginationResponseFormat<MenuItem>> {
    const skip = (page - 1) * limit
    const [MenuItems, totalItems] = await Promise.all([
      this.menuSchema.find().skip(skip).limit(limit).lean(),
      this.menuSchema.countDocuments()
    ])
    const totalPages = Math.ceil(totalItems / limit);
    return {
      items: MenuItems,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
      }
    }
  }

  async findOne(id: string) {
    const item = await this.menuSchema.findById(id)
    if (!item) {
      throw new NotFoundException(`iten not available!`)
    }
    return {
      item
    }
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    const menuItem = await this.menuSchema.findByIdAndUpdate(
      id,
      updateMenuDto,
      { new: true }
    );
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }
    return {
      message: 'Menu item updated successfully',
      menuItem
    };
  }

  async remove(id: string) {
    await this.menuSchema.findByIdAndDelete(id)
    return `This action removes a #${id} menu`;
  }
}
