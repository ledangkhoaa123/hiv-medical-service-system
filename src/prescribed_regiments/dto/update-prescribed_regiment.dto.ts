import { PartialType } from '@nestjs/mapped-types';
import { CreatePrescribedRegimentDto } from './create-prescribed_regiment.dto';

export class UpdatePrescribedRegimentDto extends PartialType(CreatePrescribedRegimentDto) {}
