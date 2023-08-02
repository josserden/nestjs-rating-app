import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PageLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class CourseData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;
}

export class Advantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

@Schema({
  timestamps: true,
  _id: true,
})
export class PageModel {
  @Prop({
    enum: PageLevelCategory,
  })
  firstCategory: PageLevelCategory;

  @Prop({
    unique: true,
  })
  alias: string;

  @Prop()
  secondCategory: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop({
    type: () => CourseData,
  })
  course?: CourseData;

  @Prop({
    type: () => [Advantage],
  })
  advantages: Advantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop({
    type: () => [String],
  })
  tags: string[];
}

export const PageSchema = SchemaFactory.createForClass(PageModel);
