import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PageController } from './page.controller';
import { PageModel, PageSchema } from './page.model/page.model';

@Module({
  controllers: [PageController],
  imports: [
    MongooseModule.forFeature([
      {
        name: PageModel.name,
        schema: PageSchema,
      },
    ]),
  ],
})
export class PageModule {}
