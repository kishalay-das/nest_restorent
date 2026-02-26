import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/Auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decoraters';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/schema/user.schema';
import { RolesGuard } from 'src/auth/guards/Roles.guard';
import { OrderQuaryDto } from './dto/find-orderquary.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: any, @Query('lat') lat: string, @Query('lng') lng: string) {
    return await this.orderService.create(createOrderDto, user.id.toString(), +lat, +lng);
  }

  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  findAllOrder(@Query() quary: OrderQuaryDto) {
    const { page, limit } = quary
    return this.orderService.findAllOrder(page, limit);
  }

  @Roles(UserRole.Restorent)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('restorent/:id')
  findRestorentAllOrder(@Param() id: string) {
    return this.orderService.findRestaurantAllOrders(id);
  }

  @Roles(UserRole.Restorent)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('accept/:id')
  acceptOrder(@Param() param: any) {
    return this.orderService.acceptOrder(param.id);
  }

  @Roles(UserRole.Restorent)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('reject/:id')
  rejectOrder(@Param() param: any) {
    return this.orderService.rejectOrder(param.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('myorder')
  findUserAllOrder(@CurrentUser() user: any) {
    return this.orderService.findUserAllOrder(user.id.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:id')
  getOrderStatus(@Param('id') id: string) {
    return this.orderService.getOrderWithPaymentStatus(id);
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
