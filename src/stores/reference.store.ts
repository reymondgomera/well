import { create } from 'zustand';
import type { FormStore } from '@/utils/common.type';

type ReferenceStoreType = FormStore & {
  entityId: number;
  setEntityId: (id: number) => void;
};

export const useReferenceFormStore = create<ReferenceStoreType>(set => ({
  entityId: 1,
  setEntityId: entityId => set({ entityId }),
  id: 0,
  dialogTitle: 'Add',
  showDialog: false,
  isSaving: false,
  onAdd: () => set({ id: 0, showDialog: true, dialogTitle: 'Add' }),
  onEdit: id => set({ id: id, showDialog: true, dialogTitle: 'Edit' }),
  onSaving: stat => set({ isSaving: stat }),
  onClosing: () => set({ id: 0, showDialog: false, isSaving: false }),
  searchFilter: undefined,
  setSearchFilter: value => set(() => ({ searchFilter: value }))
}));
