import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRestorentDto } from './dto/create-restorent.dto';
import { UpdateRestorentDto } from './dto/update-restorent.dto';
import { Restaurant, RestaurantSchema } from './schema/restorent.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class RestorentService {
  constructor(
    @InjectModel(Restaurant.name) private resturentSchema: Model<Restaurant>,
    private uploadservice: UploadService
  ) { }
  async create(createRestorentDto: CreateRestorentDto, ownerId: string, file: any, lat: number, lng: number) {
    const own = await this.resturentSchema.findOne({ ownerId })
    if (own) {
      throw new ConflictException("you already have an restorent!")
    }
    const upload = await this.uploadservice.upload(file)
    const restorent = await this.resturentSchema.create({
      ownerId: ownerId,
      name: createRestorentDto.name,
      description: createRestorentDto.description,
      image: upload.secure_url,
      imageId: upload.public_id,
      addressLine: createRestorentDto.addressLine,
      city: createRestorentDto.city,
      state: createRestorentDto.state,
      country: createRestorentDto.country,
      pincode: createRestorentDto.pincode,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      }
    })
    return {
      message: "resturent register successfully!",
      restorent
    }
  }

  async findAllNearBy(lat: number, lng: number, radiusKm = 50) {
    return await this.resturentSchema.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: radiusKm * 1000,
        },
      },
      isVerified: true,
      isOpen: true,
    });
    
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid restaurant id');
    }
    const restaurant = await this.resturentSchema.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async update(id: number, updateRestorentDto: UpdateRestorentDto) {
    const restaurant = await this.resturentSchema.findByIdAndUpdate(
      id,
      updateRestorentDto,
      { new: true }
    );
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return {
      message: 'Restaurant updated successfully',
      restaurant
    };
  }

  async remove(id: string, ownerId: string) {
    const restaurant = await this.resturentSchema.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    if (restaurant.ownerId.toString() !== ownerId) {
      throw new ForbiddenException('You are not allowed to delete this restaurant');
    }
    await this.resturentSchema.findByIdAndDelete(id)
    return {
      message: 'Restaurant deleted successfully',
    };
  }

  async availability(id: string, isOpen: boolean, ownerId: string) {
    const restaurant = await this.resturentSchema.findById(id);
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.ownerId.toString() !== ownerId.toString()) {
      throw new ForbiddenException('You are not the owner of this restaurant');
    }
    restaurant.isOpen = isOpen;
    await restaurant.save();

    return {
      success: true,
      message: `Restaurant is now ${isOpen ? 'OPEN' : 'CLOSED'}`,
      data: {
        id: restaurant._id.toString(),
        isOpen: restaurant.isOpen,
      },
    };
  }


}
