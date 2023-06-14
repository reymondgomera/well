import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PhysicalCheckup } from '@prisma/client';
  //@ts-ignore
  export class PatientCheckupEntity implements PhysicalCheckup{

  @ApiProperty()
  id: string;

    @IsString()
    @IsNotEmpty()
    //@ts-ignore
    patientId: String;
  
    @IsNotEmpty()
    @IsObject()
    Vital_Signs: any;

    @IsNotEmpty()
    @IsObject()
    Diagnosis: any;
    
    @IsNotEmpty()
    @IsObject()
    Treatment: any;

    @IsString()
    //@ts-ignore
    Dietary_Advise: String;

    @IsString()
    @IsNotEmpty()
    Follow_up: Date;
  }