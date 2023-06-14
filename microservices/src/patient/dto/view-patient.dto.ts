import { ApiProperty } from '@nestjs/swagger';

export class ViewPatientDto
 {
    @ApiProperty()
    id: string;

    @ApiProperty()
    Firstname: string;

    @ApiProperty()
    Lastname: string;
  }