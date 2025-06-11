import { PartialType } from '@nestjs/mapped-types';
import { CreateArvRegimentDto } from './create-arv_regiment.dto';

export class UpdateArvRegimentDto extends PartialType(CreateArvRegimentDto) {}
