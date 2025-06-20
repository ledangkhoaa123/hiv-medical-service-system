import { PartialType } from '@nestjs/swagger';
import { CreateFacilityInfoDto } from './create-facility-infos.dto';

export class UpdateFacilityInfoDto extends PartialType(CreateFacilityInfoDto) {}
