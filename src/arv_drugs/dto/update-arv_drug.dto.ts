import { PartialType } from '@nestjs/mapped-types';
import { CreateArvDrugDto } from './create-arv_drug.dto';

export class UpdateArvDrugDto extends PartialType(CreateArvDrugDto) {}
