import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

import {
  InputLabel,
  Select,
  MenuItem,
  TextField,
  FormControl,
  SelectProps,
  ListItemText,
  FormControlProps,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
  FormControlLabelProps,
  GridProps,
  Grid,
  ListItemTextProps,
  TextFieldProps,
  BoxProps,
  Autocomplete,
  Chip,
  FormHelperText,
  SelectChangeEvent,
  Typography
} from '@mui/material';

import moment from 'moment';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { Controller, ControllerFieldState, ControllerRenderProps, FieldErrors } from 'react-hook-form';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.ph';

import { getDependencyData } from '@/server/hooks/reference';
import { ExtendedPropsType, FormControlPropsType } from './common.type';
import { getFilterObjValue } from './helper';
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker';
import _ from 'lodash';

type FormContextType<TUnion> = {
  objFieldProp: FormControlPropsType<TUnion>;
  field: ControllerRenderProps;
  fieldState: ControllerFieldState;
  getValues?: any;
  setValue?: any;
  control: any;
  errors: FieldErrors;
};

export function FormObjectComponent<TUnion>(
  props: Pick<FormContextType<TUnion>, 'objFieldProp' | 'control' | 'errors' | 'getValues' | 'setValue'>
) {
  const { objFieldProp, control, errors, getValues, setValue } = props;

  const objControl = (
    <Controller
      name={objFieldProp.dbField as string}
      control={control}
      render={({ field, fieldState }) =>
        FormContextType<TUnion>({
          objFieldProp,
          control,
          errors,
          field,
          fieldState,
          getValues,
          setValue
        })
      }
    />
  );

  return (
    <>
      {objControl}
      {!objFieldProp.disabledErrors && getFormErrorMessage({ errors, dbField: objFieldProp.dbField })}
    </>
  );
}

export function FormContextType<TUnion>(props: FormContextType<TUnion>) {
  const { objFieldProp, field, fieldState, getValues, setValue } = props;
  const {
    boxAttribute,
    formControlAttribute,
    formControlLabelAttribute,
    textFieldAttribute,
    dropDownAttribute,
    reactDatePickerAttribute,
    gridAttribute,
    checkboxAttribute,
    autoCompleteAttribute,
    customInputComponent,
    cleaveOptions,
    dropDownNonEntityReferenceAttribute
  } = objFieldProp.extendedProps as ExtendedPropsType;

  const label = objFieldProp.required ? objFieldProp.label + '*' : objFieldProp.label;

  switch (objFieldProp.type) {
    case 'dropDown':
      return (
        <DropdownData
          type='control'
          id={objFieldProp.entityId!}
          objFieldProp={objFieldProp}
          field={field}
          fieldState={fieldState}
          label={label}
          setValue={setValue}
          getValues={getValues}
          handleSearchFilter={field.onChange}
          searchFilterValue={field.value}
          dropDownAttribute={dropDownAttribute}
          formControlAttribute={formControlAttribute}
        />
      );

    case 'dropDownNonEntityReference':
      return (
        <DropdownNonEntityReferenceData
          type='control'
          objFieldProp={objFieldProp}
          field={field}
          fieldState={fieldState}
          label={label}
          setValue={setValue}
          getValues={getValues}
          handleSearchFilter={field.onChange}
          searchFilterValue={field.value}
          dropDownAttribute={dropDownAttribute}
          formControlAttribute={formControlAttribute}
          dropDownNonEntityReferenceAttribute={dropDownNonEntityReferenceAttribute!}
        />
      );

    case 'datePicker':
      return (
        <DatePickerWrapper {...(boxAttribute ? boxAttribute : { width: '100%' })}>
          <DatePicker
            {...reactDatePickerAttribute}
            id={field.name}
            selected={moment(field.value).isValid() ? field.value : null}
            onChange={field.onChange}
            customInput={
              <TextField
                {...textFieldAttribute}
                label={label}
                fullWidth
                autoFocus={objFieldProp.autoFocus}
                error={Boolean(fieldState.error)}
              />
            }
          />
        </DatePickerWrapper>
      );

    case 'checkbox':
      return (
        <FormControlLabel
          {...formControlLabelAttribute}
          label={label}
          control={
            <Checkbox
              {...field}
              {...checkboxAttribute}
              id={field.name}
              autoFocus={objFieldProp.autoFocus}
              checked={Boolean(getValues(objFieldProp.dbField))}
              sx={fieldState.error ? { color: 'error.main' } : null}
            />
          }
          sx={{
            '& .MuiFormControlLabel-label': { color: 'text.primary' }
          }}
        />
      );

    case 'multi-checkbox':
      return (
        <CheckBoxData
          id={objFieldProp.entityId!}
          objFieldProp={objFieldProp}
          field={field}
          fieldState={fieldState}
          label={label}
          getValues={getValues}
          setValue={setValue}
          gridAttribute={gridAttribute}
          checkboxAttribute={checkboxAttribute}
          formControlLabelAttribute={formControlLabelAttribute}
        />
      );

    case 'auto-complete':
      return (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <Autocomplete
            {...autoCompleteAttribute}
            id={field.name}
            defaultValue={autoCompleteAttribute?.defaultValue ? autoCompleteAttribute?.defaultValue : []}
            options={autoCompleteAttribute?.options ? autoCompleteAttribute?.options : []}
            value={field.value}
            onChange={(event, newValue) => field.onChange(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                {...textFieldAttribute}
                autoFocus={objFieldProp.autoFocus}
                label={label}
                placeholder={label}
                error={!objFieldProp.disabledErrors && Boolean(fieldState.error)}
                InputProps={{
                  ...params.InputProps,
                  ...(customInputComponent ? { inputComponent: customInputComponent } : {})
                }}
                inputProps={{
                  ...params.inputProps,
                  ...(customInputComponent && cleaveOptions ? { options: cleaveOptions } : {})
                }}
              />
            )}
            renderTags={(value: any[], getTagProps) => {
              return value.map((option: string, index: number) => (
                <Chip variant='outlined' label={option} {...(getTagProps({ index }) as {})} key={index} />
              ));
            }}
          />
        </FormControl>
      );

    default:
      return (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <TextField
            {...field}
            {...textFieldAttribute}
            id={field.name}
            autoFocus={objFieldProp.autoFocus}
            label={label}
            placeholder={label}
            error={!objFieldProp.disabledErrors && Boolean(fieldState.error)}
            value={field.value ? field.value : ''}
          />
        </FormControl>
      );
  }
}

export function getFormErrorMessage({ ...props }) {
  const { errors, dbField } = props;

  const properties = dbField.split('.');

  let currentError = errors;
  for (let i = 0; i < properties.length; i++) {
    currentError = currentError[properties[i]];
    if (currentError === undefined) return null;
  }

  return currentError && <FormHelperText sx={{ color: 'error.main' }}>{currentError.message}</FormHelperText>;
}

type DropdownProps<TUnion> = {
  id: number;
  type: 'filter' | 'control';
  searchFilterValue: any;
  handleSearchFilter: (...event: any[]) => void;
  label?: string;
  objFieldProp?: FormControlPropsType<TUnion>;
  field?: ControllerRenderProps;
  fieldState?: ControllerFieldState;
  setValue?: any;
  getValues?: any;
  dropDownAttribute?: SelectProps;
  formControlAttribute?: FormControlProps;
  customMenuItem?: {
    [key: string]: {
      render: (childProps: { key: number; value: string | number; text: string }) => React.ReactNode;
    };
  };
};

export function DropdownData<TUnion>(props: DropdownProps<TUnion>) {
  const {
    id,
    type,
    objFieldProp,
    handleSearchFilter,
    searchFilterValue,
    fieldState,
    label,
    setValue,
    getValues,
    dropDownAttribute,
    formControlAttribute,
    customMenuItem
  } = props;

  const { entities, references } = getDependencyData({ entities: [id] });

  if (!entities.data && !references.data) return null;

  const dataLoaded = !entities.isLoading && !!entities.data && !references.isLoading && !!references.data;
  const entity = entities.data?.find(e => e.id === id);

  if (!entity) return null;

  const currentLabel = label ? label : entity.name;
  let currentValue = 0;

  if (type === 'filter') {
    const { dropDownValue } = getFilterObjValue(searchFilterValue);
    currentValue = dropDownValue && dropDownValue[entity.fieldProp] ? dropDownValue[entity.fieldProp] : 0;
  }

  if (type === 'control') {
    currentValue = searchFilterValue ? searchFilterValue : 0;
  }

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    handleSearchFilter(e);

    const value = e.target.value as (string | number)[];

    if (dropDownAttribute?.multiple) {
      if (value.includes(-1)) {
        if (value.length === references.data?.length! + 1) {
          setValue(objFieldProp?.dbField, []);
        } else {
          setValue(
            objFieldProp?.dbField,
            references.data?.map(d => d.id)
          );
        }
      }
    }
  };

  return (
    <>
      {dataLoaded && entity && (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <InputLabel id={`${entity.fieldProp}-select`}>{currentLabel}</InputLabel>
          <Select
            {...(dropDownAttribute ? dropDownAttribute : { fullWidth: true })}
            id={`select-${entity.fieldProp}`}
            name={entity.fieldProp}
            label={currentLabel}
            labelId={`${entity.fieldProp}-select`}
            autoFocus={objFieldProp?.autoFocus}
            error={fieldState && Boolean(fieldState.error)}
            onChange={handleChange}
            value={currentValue}
          >
            <MenuItem value={0} disabled={dropDownAttribute?.multiple}>
              Select {currentLabel}
            </MenuItem>

            {dropDownAttribute?.multiple && entity && (
              <MenuItem value={-1}>
                {references.data.length === getValues(entity?.fieldProp).length ? 'Deselect All' : 'Select All'}
              </MenuItem>
            )}

            {references.data.map(item =>
              customMenuItem && customMenuItem[item.code] ? (
                customMenuItem[item.code].render({
                  key: item.id,
                  value: item.id,
                  text: item.name
                })
              ) : (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      )}
    </>
  );
}

type DropdownNonEntityReferenceDataProps<TUnion> = {
  type: 'filter' | 'control';
  filterFieldProp?: TUnion;
  searchFilterValue: any;
  handleSearchFilter: (...event: any[]) => void;
  label?: string;
  objFieldProp?: FormControlPropsType<TUnion>;
  field?: ControllerRenderProps;
  fieldState?: ControllerFieldState;
  setValue?: any;
  getValues?: any;
  dropDownAttribute?: SelectProps;
  formControlAttribute?: FormControlProps;
  dropDownNonEntityReferenceAttribute: {
    data: any[];
    menuItemTextPath: string[];
    dataIsloading: boolean;
  };
};

export function DropdownNonEntityReferenceData<TUnion>(props: DropdownNonEntityReferenceDataProps<TUnion>) {
  const {
    type,
    filterFieldProp,
    objFieldProp,
    handleSearchFilter,
    searchFilterValue,
    fieldState,
    label,
    setValue,
    getValues,
    dropDownAttribute,
    formControlAttribute,
    dropDownNonEntityReferenceAttribute
  } = props;

  const { data, dataIsloading, menuItemTextPath } = dropDownNonEntityReferenceAttribute;

  const dataLoaded = !dataIsloading && !!data;

  let currentValue = 0;

  if (type === 'filter') {
    const fieldProp = filterFieldProp ? (filterFieldProp as string) : '';
    const { dropDownValue } = getFilterObjValue(searchFilterValue);
    currentValue = dropDownValue && dropDownValue[fieldProp] ? dropDownValue[fieldProp] : 0;
  }

  if (type === 'control') {
    currentValue = searchFilterValue ? searchFilterValue : 0;
  }

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    handleSearchFilter(e);

    const value = e.target.value as (string | number)[];

    if (dropDownAttribute?.multiple) {
      if (value.includes(-1)) {
        if (value.length === data.length + 1) {
          setValue(objFieldProp?.dbField, []);
        } else {
          setValue(
            objFieldProp?.dbField,
            data.map(d => d.id)
          );
        }
      }
    }
  };

  return (
    <>
      {dataLoaded && (
        <FormControl {...(formControlAttribute ? formControlAttribute : { fullWidth: true })}>
          <InputLabel id={`${objFieldProp?.dbField}-select`}>{label}</InputLabel>
          <Select
            {...(dropDownAttribute ? dropDownAttribute : { fullWidth: true })}
            id={`select-${objFieldProp?.dbField}`}
            name={filterFieldProp ? (filterFieldProp as string) : (objFieldProp?.dbField as string)}
            label={label}
            labelId={`${objFieldProp?.dbField}-select`}
            autoFocus={objFieldProp?.autoFocus}
            error={fieldState && Boolean(fieldState.error)}
            onChange={handleChange}
            value={currentValue}
            placeholder={`Select ${label}`}
          >
            <MenuItem value={0} disabled={dropDownAttribute?.multiple}>
              Select {label}
            </MenuItem>

            {dropDownAttribute?.multiple && (
              <MenuItem value={-1}>
                {data.length === getValues(objFieldProp?.dbField).length ? 'Deselect All' : 'Select All'}
              </MenuItem>
            )}

            {data.map(item => {
              let text = '';

              menuItemTextPath.forEach(path => {
                text += _.get(item, path) + ' ';
              });

              return (
                <MenuItem key={item.id} value={item.id}>
                  {text}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}
    </>
  );
}

type MultiCheckboxProps<TUnion> = {
  id: number;
  label?: string;
  objFieldProp?: FormControlPropsType<TUnion>;
  field?: ControllerRenderProps;
  fieldState?: ControllerFieldState;
  setValue: any;
  getValues: any;
  gridAttribute?: GridProps;
  checkboxAttribute?: CheckboxProps;
  formControlLabelAttribute?: FormControlLabelProps;
};

export function CheckBoxData<TUnion>(props: MultiCheckboxProps<TUnion>) {
  const {
    id,
    objFieldProp,
    fieldState,
    label,
    field,
    gridAttribute,
    checkboxAttribute,
    getValues,
    setValue,
    formControlLabelAttribute
  } = props;

  const { entities, references } = getDependencyData({ entities: [id] });

  if (!entities.data && !references.data) return null;

  const dataLoaded = !entities.isLoading && !!entities.data && !references.isLoading && !!references.data;
  const entity = entities.data?.find(e => e.id === id);

  if (!entity) return null;

  // works only for array of values
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, path: string) => {
    const currentArrayValues = getValues(path);

    if (e.target.checked) setValue(path, [...currentArrayValues, parseInt(e.target.value)]);
    else {
      const filterValues = currentArrayValues.filter((value: any) => value !== parseInt(e.target.value));
      setValue(path, [...filterValues]);
    }
  };

  return (
    <>
      {dataLoaded && entity ? (
        <>
          <Grid xs={12} item>
            <Typography width='100%' variant='body1' fontWeight={600} color='text.primary'>
              {label}
            </Typography>
          </Grid>
          {references.data.map((item, i) => (
            <Grid key={i} item {...gridAttribute}>
              <FormControlLabel
                key={i}
                {...(formControlLabelAttribute ? formControlLabelAttribute : { sx: { width: '100%' } })}
                label={item.name}
                control={
                  <Checkbox
                    {...field}
                    {...checkboxAttribute}
                    id={field?.name}
                    value={item.id}
                    name={objFieldProp?.dbField as string}
                    autoFocus={objFieldProp?.autoFocus}
                    checked={getValues(objFieldProp?.dbField).includes(item.id)}
                    sx={fieldState?.error ? { color: 'error.main' } : null}
                    onChange={e => handleCheckboxChange(e, objFieldProp?.dbField as string)}
                  />
                }
                sx={{
                  '& .MuiFormControlLabel-label': { color: 'text.primary' }
                }}
              />
            </Grid>
          ))}
        </>
      ) : null}
    </>
  );
}

export type ListItemTextType = {
  listItemTextAttribute: ListItemTextProps;
  gridAttribute?: GridProps;
};

export function ListItemTextData(props: ListItemTextType) {
  const { listItemTextAttribute, gridAttribute } = props;

  return (
    <Grid item {...gridAttribute}>
      <ListItemText {...listItemTextAttribute} />
    </Grid>
  );
}

type TextInputSearchProps = {
  searchFilterValue: any;
  handleSearchFilter: (...event: any[]) => void;
  textFieldAttribute?: TextFieldProps;
};

export function TextInputSearch(props: TextInputSearchProps) {
  const { handleSearchFilter, searchFilterValue, textFieldAttribute } = props;
  const { inputValue } = getFilterObjValue(searchFilterValue);

  return (
    <TextField
      {...(textFieldAttribute ? textFieldAttribute : { fullWidth: true })}
      placeholder='Search'
      name='inputValue'
      onChange={handleSearchFilter}
      value={inputValue ? inputValue : ''}
    />
  );
}

type DateRangeInputSearchProps = {
  searchFilterValue: any;
  handleDateRangeFilter: (...event: any[]) => void;
  reactDatePickerAttribute?: Omit<ReactDatePickerProps, 'onChange'>;
  boxAttribute?: BoxProps;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function DateRangeInputSearch(props: DateRangeInputSearchProps) {
  const { handleDateRangeFilter, searchFilterValue, reactDatePickerAttribute, boxAttribute, open, setOpen } = props;
  const { dateRangeInputValue } = getFilterObjValue(searchFilterValue);
  const { start, end } = dateRangeInputValue ? dateRangeInputValue : { start: null, end: null };

  return (
    <DatePickerWrapper {...(boxAttribute ? boxAttribute : { width: '100%' })}>
      <DatePicker
        {...reactDatePickerAttribute}
        selectsRange
        monthsShown={2}
        name='dateRangeInputValue'
        placeholderText='Date Range Search'
        startDate={start}
        endDate={end}
        selected={start}
        shouldCloseOnSelect={false}
        onChange={handleDateRangeFilter}
        open={open}
        onClickOutside={() => setOpen(prev => !prev)}
      />
    </DatePickerWrapper>
  );
}

export const CleaveInput = React.forwardRef((props: any, ref: React.Ref<HTMLInputElement>) => (
  <Cleave {...props} htmlRef={ref} />
));
