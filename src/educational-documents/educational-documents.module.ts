import { Module } from '@nestjs/common';
import { EducationalDocumentsService } from './educational-documents.service';
import { EducationalDocumentsController } from './educational-documents.controller';
import {
  EducationalDocument,
  EducationalDocumentSchema,
} from './schemas/educational-document.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: EducationalDocument.name,
        schema: EducationalDocumentSchema,
      },
    ]),
  ],
  controllers: [EducationalDocumentsController],
  providers: [EducationalDocumentsService],
  exports: [EducationalDocumentsService],
})
export class EducationalDocumentsModule {}
