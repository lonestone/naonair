import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  message: string;
  startDate: Date;
  endDate?: Date;
  link?: string;
  linkTitle?: string;
  displayPeriod: boolean;
}

export class CreateNewsDTO {
  @IsEnum(NewsType) type: NewsType;
  @IsString() message: string;
  @Type(() => Date) @IsDate() startDate: Date;
  @Type(() => Date) @IsDate() @IsOptional() endDate?: Date;
  @IsString() @IsOptional() link?: string;
  @IsString() @IsOptional() linkTitle?: string;
  @IsBoolean() displayPeriod: boolean;
}

export class UpdateNewsDTO {
  @IsEnum(NewsType) @IsOptional() type?: NewsType;
  @IsString() @IsOptional() message?: string;
  @Type(() => Date) @IsDate() @IsOptional() startDate?: Date;
  @Type(() => Date) @IsDate() @IsOptional() endDate?: Date;
  @IsString() @IsOptional() link?: string;
  @IsString() @IsOptional() linkTitle?: string;
  @IsBoolean() @IsOptional() displayPeriod?: boolean;
}
