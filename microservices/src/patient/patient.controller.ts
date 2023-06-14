import { Controller ,Get, Param, Post, Put, Patch , ParseIntPipe, UseGuards} from '@nestjs/common';
import { Body, Delete } from '@nestjs/common/decorators';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ViewPatientDto } from './dto/view-patient.dto';
import { PatientService } from './patient.service';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { PatientEntity } from './entities/patient.entity';

@UseGuards(JwtAuthGuard)
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService, private prisma: PrismaService ){}

  
  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    const createPatient = await this.patientService.createPatient(createPatientDto);
    return createPatient;
  /*create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }*/
}
  
  @Get()
  @ApiResponse({ status: 200, type: [ViewPatientDto] })
  async getPatients(): Promise<ViewPatientDto[]> {
    const patients = await this.patientService.getPatients();
    
    return patients.map((patient) => ({
      id: patient.id,
      // @ts-ignore
      Firstname: patient.First_Name,
      // @ts-ignore
      Lastname: patient.Last_Name
    }));

  }

  
  @Patch(':id')
  @ApiCreatedResponse({ type: PatientEntity })
  update( @Param('id') id: string,  @Body() updatepatientdto: UpdatePatientDto,) 
  {
    return this.patientService.update(id, updatepatientdto);
  }
  
  
  @Delete(':id')
    async deleteExample(@Param('id') id: string): Promise<any> {
      return this.prisma.patient.delete(
        {
        where: {id}
      }
    );
  }
}


