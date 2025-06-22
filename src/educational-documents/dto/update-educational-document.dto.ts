import { PartialType } from '@nestjs/swagger';
import { CreateEducationalDocumentDto } from './create-educational-document.dto';

export class UpdateEducationalDocumentDto extends PartialType(CreateEducationalDocumentDto) {}
