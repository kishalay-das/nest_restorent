import { PartialType } from '@nestjs/mapped-types';
import { CreateRestorentDto } from './create-restorent.dto';

export class UpdateRestorentDto extends PartialType(CreateRestorentDto) {}
