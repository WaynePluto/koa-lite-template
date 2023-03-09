import {IsString, IsNumber} from 'class-validator'
export class AddUserQuery{
  @IsString()
  name!:string;
  @IsNumber()
  year!:number
}