import { z } from 'zod';
import { RouterKeyType } from '@/server/routers';
import { commonDataDtoSchema, filterQuery, params } from '@/server/schema/common';
import {
  Breakpoint,
  FormControlProps,
  SelectProps,
  TextFieldProps,
  ListItemTextProps,
  GridProps,
  CheckboxProps,
  FormControlLabelProps,
  BoxProps,
  AutocompleteProps,
  InputBaseComponentProps
} from '@mui/material';
import { ReactDatePickerProps } from 'react-datepicker';
import { CleaveOptions } from 'cleave.js/options';

export type ParamsInput = z.TypeOf<typeof params>;
export type CommonDataInputType = z.TypeOf<typeof commonDataDtoSchema>;
export type FilterQueryInputType = z.TypeOf<typeof filterQuery> & DynamicType;

export type DynamicType = {
  [key: string]: any | undefined;
};

export type FormDisplayType = 'normal' | 'dialog';
export type FormUIType = `${RouterKeyType}-form-${FormDisplayType}`;

export type FormPropsType = {
  formId: FormUIType;
  maxWidth?: Breakpoint;
};

export type TableHeaderPropsType = {
  searchFilter: DynamicType;
  handleSearchFilter: (...event: any[]) => void;
};

export type FormInputType =
  | 'textField'
  | 'dropDown'
  | 'dropDownNonEntityReference'
  | 'datePicker'
  | 'checkbox'
  | 'multi-checkbox'
  | 'auto-complete';

export type ExtendedPropsType = {
  formControlAttribute?: FormControlProps;
  formControlLabelAttribute?: FormControlLabelProps;
  textFieldAttribute?: TextFieldProps;
  dropDownAttribute?: SelectProps;
  gridAttribute?: GridProps;
  checkboxAttribute?: CheckboxProps;
  listItemTextAttribute?: ListItemTextProps;
  reactDatePickerAttribute?: Omit<ReactDatePickerProps, 'onChange'>;
  autoCompleteAttribute?: AutocompleteProps<any, boolean, boolean, boolean>;
  boxAttribute?: BoxProps;
  customInputComponent?: React.ElementType<InputBaseComponentProps>;
  cleaveOptions?: CleaveOptions;
  dropDownNonEntityReferenceAttribute?: {
    data: any[];
    menuItemTextPath: string[];
    dataIsloading: boolean;
  };
};

export type FormControlPropsType<TUnionField> = {
  label: string;
  dbField: TUnionField;
  type: FormInputType;
  width?: number;
  rows?: number;
  required?: boolean;
  autoFocus?: boolean;
  entityId?: number;
  disabledErrors?: boolean;
  extendedProps?: ExtendedPropsType;
};

// Form Store Types
export type FormAction = 'Add' | 'Edit';
export type FormStore = {
  id: number;
  dialogTitle: FormAction;
  showDialog: boolean;
  isSaving: boolean;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onSaving: (stat: boolean) => void;
  onClosing: () => void;
  searchFilter: DynamicType | undefined;
  setSearchFilter: (value: DynamicType) => void;
};
