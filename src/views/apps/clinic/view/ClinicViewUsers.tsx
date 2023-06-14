import { ClinicsType, UsersType } from '@/utils/db.type';
import ClinicViewUsersTableList from './ClinicViewUsersTableList';

interface ClinicViewUsersPropsType {
  clinicData: ClinicsType;
  usersData: UsersType[];
}

const ClinicViewUsers = ({ clinicData, usersData }: ClinicViewUsersPropsType) => {
  return usersData ? <ClinicViewUsersTableList clinicData={clinicData} usersData={usersData} /> : null;
};

export default ClinicViewUsers;
