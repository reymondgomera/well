import { ApiProperty } from '@nestjs/swagger';

export class ViewPatientCheckupDto
 {
    @ApiProperty()
    id: String;

    @ApiProperty()
    patientId: String;

    @ApiProperty()
    physicianId: String;

    @ApiProperty()
    Vital_Signs: any;

    @ApiProperty()
    Diagnosis: any;

    @ApiProperty()
    Treatment: any;

    @ApiProperty()
    Dietary_Advise: any;

    @ApiProperty()
    Follow_up: any;


  }