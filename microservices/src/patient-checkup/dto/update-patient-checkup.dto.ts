import { PartialType } from '@nestjs/swagger';
import { PatientCheckupDto } from './create-patient-checkup.dto';


export class UpdatePatientCheckupDto extends PartialType(PatientCheckupDto) {}