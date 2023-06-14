import { CheckupsType, PatientsType } from '@/utils/db.type';
import PatientViewCheckupHistoryTableList from './PatientViewCheckupHistoryTableList';

interface PatientViewCheckupHistoryPropsType {
  patientData: PatientsType;
  patientCheckupsData: CheckupsType[];
}

const PatientViewCheckupHistory = ({ patientData, patientCheckupsData }: PatientViewCheckupHistoryPropsType) => {
  return patientCheckupsData ? (
    <PatientViewCheckupHistoryTableList patientData={patientData} patientCheckupsData={patientCheckupsData} />
  ) : null;
};

export default PatientViewCheckupHistory;
