import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PatientCheckupController } from './patient-checkup.controller';
import { PatientCheckupService } from './patient-checkup.service';

@Module({
    imports: [PrismaModule],
    controllers: [PatientCheckupController],
    providers:[PatientCheckupService]
})
export class PatientCheckupModule {}
