import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from './schemas/banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerSchema: Model<Banner>,
    private readonly uploadService: UploadService
  ) { }
  async create(createBannerDto: CreateBannerDto, file: any) {
    const upload = await this.uploadService.upload(file)
    const banner = await this.bannerSchema.create({
      name: createBannerDto.name,
      image: upload.secure_url,
      imageId: upload.public_id
    });
    return {
      message: 'Banner created successfully',
      banner
    };
  }

  async findAll() {
    const banners = await this.bannerSchema.find();
    return {
      banners
    };
  }

  async findOne(id: number) {
    const banner = await this.bannerSchema.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return {
      banner
    };
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannerSchema.findByIdAndUpdate(
      id,
      updateBannerDto,
      { new: true }
    );
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return {
      message: 'Banner updated successfully',
      banner
    };
  }

  async remove(id: number) {
    const banner = await this.bannerSchema.findByIdAndDelete(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return {
      message: 'Banner deleted successfully'
    };
  }
}
