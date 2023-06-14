import { ClinicsType, UsersType } from '@/utils/db.type';
import UserViewClinicsTableList from './UserViewClinicsTableList';

interface UserViewClinicsPropsType {
  clinicsData: ClinicsType[];
  userData: UsersType;
}

const UserViewClinics = ({ clinicsData, userData }: UserViewClinicsPropsType) => {
  return clinicsData ? <UserViewClinicsTableList clinicsData={clinicsData} userData={userData} /> : null;
};

export default UserViewClinics;
