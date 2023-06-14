
import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
  type
} from 'class-validator';

export class CreatePatientDto {
    @IsString()
    @IsNotEmpty()
    First_Name: string;

    @IsString()
    @IsNotEmpty()
    Last_Name: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    middleinitial: string;

    @IsString()
    @IsNotEmpty()
    Address: string;

    @IsString()
    @IsNotEmpty()
    DateOfBirth: Date;

    @IsNumber()
    civilstatusId: number;

    @IsNumber()
    Age: number;

    @IsNumber()
    occupationId: number;

    @IsNumber()
    genderId: number;

    @IsString()
    @MaxLength(11)
    contactNumber: string;


    @ApiProperty()
	  @ValidateNested({ each: true })
	  @type(() => familyHistory_data)
    familyHistory: familyHistory_data;

    @IsObject()
    personalHistory: any;
    
    @IsObject()
    pastMedicalHistory: any;

    @IsObject()
    obGyne: any;

  }

  class familyHistory_data{
    
    @IsNumber()
	  @MaxLength(5)
    disease: number 
  }