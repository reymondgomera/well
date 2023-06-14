import { create } from 'zustand';
import { MedicationDtoSchemaType } from '@/server/schema/patient';
import type { FormStore } from '@/utils/common.type';

type PatientFormStoreType = FormStore & {
  steps: string[];
  activeStep: number;
  setActiveStep: (value: number) => void;
};

export const usePatientFormStore = create<PatientFormStoreType>(set => ({
  id: 0,
  dialogTitle: 'Add',
  showDialog: false,
  isSaving: false,
  onAdd: () => set({ showDialog: true, dialogTitle: 'Add' }),
  onEdit: id => set({ id, showDialog: true, dialogTitle: 'Edit' }),
  onSaving: stat => set({ isSaving: stat }),
  onClosing: () => set({ id: 0, showDialog: false, isSaving: false }),
  steps: [
    'Personal Information',
    'Family History',
    'Personal History',
    'Past Medical History',
    'Obstetrics & Gynecology',
    'Review'
  ],
  searchFilter: undefined,
  setSearchFilter: value => set(() => ({ searchFilter: value })),
  activeStep: 0,
  setActiveStep: value => set({ activeStep: value })
}));

type MedicationFormStoreType = {
  id: number;
  medications: MedicationDtoSchemaType[];
  add: (data: MedicationDtoSchemaType) => void;
  replaceAll: (data: MedicationDtoSchemaType[]) => void;
  remove: (index: number) => void;
  clear: () => void;
};

export const useMedicationFormStore = create<MedicationFormStoreType>(set => ({
  id: -1,
  medications: [],
  add: data => {
    set(state => ({ medications: [...state.medications, { ...data }] }));
  },
  replaceAll: data => set(() => ({ medications: data })),
  remove: index =>
    set(state => ({
      medications: state.medications.filter((medication, i) => i !== index)
    })),
  clear: () => set(() => ({ medications: [] }))
}));
