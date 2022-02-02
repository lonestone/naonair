import { IsString } from 'class-validator';

export class AuthDTO {
  @IsString() token: string;
}
