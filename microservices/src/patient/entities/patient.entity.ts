import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Patient } from '@prisma/client';
  //@ts-ignore
  export class PatientEntity implements Patient {

  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  First_Name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Last_Name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  middleinitial: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  Address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  DateOfBirth: Date;

  @ApiProperty()
  @IsNumber()
  civilstatusId: number;

  @ApiProperty()
  @IsNumber()
  Age: number;

  @ApiProperty()
  @IsNumber()
  occupationId: number;

  @ApiProperty()
  @IsNumber()
  genderId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(11)
  contactNumber: string;

  @ApiProperty()
  @IsObject()
  familyHistory: any;

  @ApiProperty()
  @IsObject()
  personalHistory: any;

  @ApiProperty()
  @IsObject()
  pastMedicalHistory: any;

  @ApiProperty()
  @IsObject()
  obGyne: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  /* @IsString()
    @IsOptional()
    @MaxLength(300)
    @ApiProperty({ required: false })
    description?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    body: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false, default: false })
    published?: boolean = false;
    */
  }