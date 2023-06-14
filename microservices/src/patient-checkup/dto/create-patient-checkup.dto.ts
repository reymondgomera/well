import {
  IsNotEmpty,
  IsObject,
  IsString,
} from 'class-validator';

export class PatientCheckupDto{
    
    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    patientId: String;
  
    @IsNotEmpty()
    @IsString()
    physicianId: String;

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
    @IsNotEmpty()
    Dietary_Advise: String;

    @IsString()
    @IsNotEmpty()
    Follow_up: Date;
  }