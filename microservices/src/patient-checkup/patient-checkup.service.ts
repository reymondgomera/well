import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PatientCheckupDto } from './dto/create-patient-checkup.dto';
import { UpdatePatientCheckupDto } from './dto/update-patient-checkup.dto';

@Injectable()
export class PatientCheckupService {
constructor(private prisma: PrismaService) {}

async createpatientCheckup(patientCheckupDto: PatientCheckupDto){
    const patientCheckup = await this.prisma.physicalCheckup.create({
        // @ts-ignore
        data: patientCheckupDto,
      });
      return patientCheckup;
}

async getpatientCheckup(){
    const patientCheckup = await this.prisma.physicalCheckup.findMany();
    return patientCheckup;
}

async getTreatment() {
    const treatments = await this.prisma.treatment.findMany();
    return treatments;
  }

update(id: string, updatePatientCheckupDto: UpdatePatientCheckupDto){
    return this.prisma.physicalCheckup.update({
        
        where: { id },
        // @ts-ignore
        data: updatePatientCheckupDto,
      });
}
}
