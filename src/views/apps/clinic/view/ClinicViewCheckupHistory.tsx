import { ClinicsType, CheckupsType } from '@/utils/db.type';
import ClinicViewCheckupHistoryTableList from './ClinicViewCheckupHistoryTableList';

interface ClinicViewCheckupHistoryPropsType {
  clinicData: ClinicsType;
  ClinicCheckupsData: CheckupsType[];
}

const ClinicViewCheckupHistory = ({ clinicData, ClinicCheckupsData }: ClinicViewCheckupHistoryPropsType) => {
  return clinicData ? (
    <ClinicViewCheckupHistoryTableList clinicData={clinicData} ClinicCheckupsData={ClinicCheckupsData} />
  ) : null;
};

export default ClinicViewCheckupHistory;
