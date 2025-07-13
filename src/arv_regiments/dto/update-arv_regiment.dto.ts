import { PartialType } from '@nestjs/mapped-types';
import { CreateArvRegimentDto, CriteriaDto, DrugRegiment } from './create-arv_regiment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RegimenType } from 'src/enums/all_enums';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArvRegimentDto extends PartialType(CreateArvRegimentDto) {
    @ApiPropertyOptional({ description: 'Tên của phác đồ ARV' })
  name?: string;

  @ApiPropertyOptional({ enum: RegimenType, description: 'Loại phác đồ ARV' })
  regimenType?: RegimenType;

  @ApiPropertyOptional({ description: 'Mô tả phác đồ' })
  description?: string;

  @ApiPropertyOptional({ description: 'Tác dụng phụ của phác đồ' })
  sideEffects?: string;

  @ApiPropertyOptional({
    description: 'Danh sách tiêu chí xét nghiệm để gợi ý phác đồ',
    type: [CriteriaDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CriteriaDto)
  criteria?: CriteriaDto[];

  @ApiPropertyOptional({
    description: 'Danh sách thuốc trong phác đồ',
    type: [DrugRegiment],
  })
  @ValidateNested({ each: true })
  @Type(() => DrugRegiment)
  drugs?: DrugRegiment[];

  @ApiPropertyOptional({ description: 'Phác đồ đang được kích hoạt hay không' })
  isActive?: boolean;
}
