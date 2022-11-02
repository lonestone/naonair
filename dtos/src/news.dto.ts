import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

// export type NewsType = 'none' | 'goodPractice' | 'announcement' | 'info' | 'event' | 'warning' 
export enum NewsType {
  None = 'none',
  GoodPractice = 'goodPractice',
  Announcement = 'announcement',
  Info = 'info',
  Event = 'event',
  Warning = 'warning',
}

export class NewsDTO {
  uuid: string;
  type: NewsType;
  title?: string;
  message: string;
  startDate: Date;
  endDate: Date;
  link?: string;
  linkTitle?: string;
  displayPeriod: boolean;
  isCurrent: boolean;
}

export class CreateNewsDTO {
  // @IsString() type:  NewsType;
  @IsEnum(NewsType) type: NewsType;
  @IsString() @IsOptional() title?: string;
  @IsString() @Length(0, 200) message: string;
  @Type(() => Date) @IsDateString() startDate: Date;
  @Type(() => Date) @IsDateString() endDate: Date;
  @IsString() @IsOptional() link?: string;
  @IsString() @IsOptional() linkTitle?: string;
  @IsBoolean() displayPeriod: boolean;
}

export class UpdateNewsDTO {
  @IsUUID() @IsOptional() uuid: string;
  // @IsString()  @IsOptional() type?:  NewsType;
  @IsEnum(NewsType) type: NewsType;
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() message?: string;
  @Type(() => Date) @IsDateString() @IsOptional() startDate?: Date;
  @Type(() => Date) @IsDateString() @IsOptional() endDate?: Date;
  @IsString() @IsOptional() link?: string;
  @IsString() @IsOptional() linkTitle?: string;
  @IsBoolean() @IsOptional() displayPeriod?: boolean;
}
