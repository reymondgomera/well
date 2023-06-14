import { Controller } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PatientCheckupDto } from './dto/create-patient-checkup.dto';
import { PatientCheckupService } from './patient-checkup.service';
import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common/decorators';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { ViewTreatmentDto } from './dto/view-treatment.dto';
import { UpdatePatientCheckupDto } from './dto/update-patient-checkup.dto';
import { PatientCheckupEntity } from './entities/patient-checkup.entity';
import { ViewPatientCheckupDto } from './dto/view-patient-checkup.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('patient-checkup')
export class PatientCheckupController {
    constructor(private readonly patientCheckupService: PatientCheckupService, private prisma: PrismaService ){}
   
        @Post()
        async createpatientCheckup(@Body() createPatientCheckupDto: PatientCheckupDto) {
        const createPatientCheckup = await this.patientCheckupService.createpatientCheckup(createPatientCheckupDto);
        return createPatientCheckup;
        }

        @Get()
        @ApiResponse({ status: 200, type: [ViewPatientCheckupDto] })
        async getpatientCheckup(): Promise<ViewPatientCheckupDto[]> {
        const patientCheckUp = await this.patientCheckupService.getpatientCheckup();
            
        // @ts-ignore
        return patientCheckUp.map((physicalCheckup) => ({
            id: physicalCheckup.id,
            patientId: physicalCheckup.patientId,
            physicianId: physicalCheckup.physicianId,
            vitalSigns: physicalCheckup.Vital_Signs,
            diagnosis: physicalCheckup.Diagnosis,
            treatment: physicalCheckup.Treatment,
            dietaryAdvise: physicalCheckup.Dietary_Advise,
            followUp: physicalCheckup.Follow_up,

        }));
        }


        @Get('medicines')
        @ApiResponse({ status: 200, type: [ViewTreatmentDto] })
        async getTreatment(): Promise<ViewTreatmentDto[]> {
        const treatments = await this.patientCheckupService.getTreatment();
        // @ts-ignore
        return treatments.map((treatment) => ({
            // id: treatment.id,
            refcd: treatment.ref_cd,
            refnm: treatment.ref_nm
        }));
        }

        @Patch(':id')
        @ApiCreatedResponse({ type: PatientCheckupEntity })
        update( @Param('id') id: string,  @Body() updatepatientdto: UpdatePatientCheckupDto,) 
        {
        return this.patientCheckupService.update(id, updatepatientdto);
        }


        @Delete(':id')
        async deleteExample(@Param('id') id: string): Promise<any> {
        return this.prisma.physicalCheckup.delete(
        {
        where: {id}
        }
        );
        }

}
