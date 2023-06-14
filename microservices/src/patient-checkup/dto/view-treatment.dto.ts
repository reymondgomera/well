import { ApiProperty } from '@nestjs/swagger';

export class ViewTreatmentDto
 {
    //@ApiProperty()
    //id: string;

    @ApiProperty()
    ref_cd: string;

    @ApiProperty()
    ref_nm: string;
  }