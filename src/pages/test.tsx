import { getReferences } from '@/server/hooks/reference';
import { useUserFormStore } from '@/stores/user.store';
import { FormControlPropsType } from '@/utils/common.type';
import { ReferencesEntityType } from '@/utils/db.type';
import { CleaveInput, DateRangeInputSearch, DropdownData, FormObjectComponent } from '@/utils/form.component';
import { handlePrintPDF, useFilterControlChange } from '@/utils/helper';
import PrescriptionPDF from '@/views/apps/checkup/PrescriptionPDF';
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  TextFieldProps
} from '@mui/material';
import DatePicker from 'react-datepicker';
import { usePDF } from '@react-pdf/renderer';
import { NextPage } from 'next';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import DatePickerWrapper from '@/@core/styles/libs/react-datepicker';
import moment from 'moment';
import { z } from 'zod';

import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.ph';
import CleaveWrapper from '@/@core/styles/libs/react-cleave';
import { zodResolver } from '@hookform/resolvers/zod';
import { getUsers } from '@/server/hooks/user';
import { getClinics } from '@/server/hooks/clinic';

interface PickerProps {
  label?: string;
  end: string;
  start: string;
}

const Test: NextPage = () => {
  const { searchFilter, handleSearchFilter, handleDateRangeFilter, open, setOpen } = useFilterControlChange();
  const { data: referencesData, isLoading } = getReferences({ entities: [10] });
  const { onAdd, setSearchFilter } = useUserFormStore();

  const { data: usersData, isLoading: usersDataIsLoading } = getUsers({ searchFilter: { dropDown: { roleId: 15 } } });

  const { data: clinicData, isLoading: clinicDataIsLoading } = getClinics();

  const options = ['09108989216', '09076394995', '09357402196'];

  const filterTableHeader = new Map([['tableHeader', [13]]]).get('tableHeader');
  const dataLoaded = !!filterTableHeader;
  const [isOpen, setIsOpen] = useState(false);

  const [startDateRange, setStartDateRange] = useState<Date>(new Date());
  const [endDateRange, setEndDateRange] = useState<Date>(moment(new Date()).add(45).toDate());
  const [time, setTime] = useState<Date>(new Date());

  const { data: medicinesData, status: medicinesDataStatus } = getReferences({ entities: [9] });

  const iframeRef = useRef(null);
  const [instance, updateInstance] = usePDF({
    document: PrescriptionPDF({
      id: 110,
      medicinesData:
        medicinesDataStatus === 'loading' ? [] : (JSON.parse(JSON.stringify(medicinesData)) as ReferencesEntityType[])
    })
  });

  useEffect(() => {
    setSearchFilter(searchFilter);
  }, [searchFilter]);

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<{ civilStatusId: number; genderId: number; DynamicContactNumber: string[]; clinicId: number[] }>({
    defaultValues: {
      civilStatusId: 0,
      genderId: 0,
      DynamicContactNumber: [],
      clinicId: []
    },
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        civilStatusId: z.coerce.number().min(1, { message: 'Please select civil Status' }),
        genderId: z.coerce.number().min(1, { message: 'Please select gender.' }),
        DynamicContactNumber: z.array(z.string()).min(1, { message: 'Please enter atleast one contact number.' }),
        clinicId: z.array(z.coerce.number()).min(1, { message: 'Please enter at least one clinic.' })
      })
    )
  });

  const {
    control: contactNumberControl,
    handleSubmit: contactNumberHandleSubmit,
    watch: contactNumberWatch,
    formState: { errors: contactNumberErrors }
  } = useForm<{ contactNumber: string[] }>({
    defaultValues: {
      contactNumber: []
    },
    mode: 'onChange',
    resolver: zodResolver(
      z.object({ contactNumber: z.array(z.string()).min(1, { message: 'Please enter atleast one contact number.' }) })
    )
  });

  const {
    control: multipleSelectControl,
    handleSubmit: multipleSelectHandleSubmit,
    watch: multipleSelectWatch,
    formState: { errors: multipleSelectErrors }
  } = useForm<{ multipleProp: string[] }>({
    defaultValues: {
      multipleProp: []
    },
    mode: 'onChange'
  });

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder'
  ];
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setPersonName(event.target.value as string[]);
  };

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
  };

  const SAMPLE_PANELS = ['General'] as const;
  const SAMPLE_FIELDS: Record<
    (typeof SAMPLE_PANELS)[number],
    FormControlPropsType<'civilStatusId' | 'genderId' | 'contactNumber' | 'DynamicContactNumber' | 'clinicId'>[]
  > = {
    General: [
      {
        label: 'Gender',
        dbField: 'genderId',
        type: 'dropDown',
        required: true,
        entityId: 1,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Civil Status',
        dbField: 'civilStatusId',
        type: 'dropDown',
        required: true,
        entityId: 3,
        extendedProps: { gridAttribute: { xs: 12, md: 6 } }
      },
      {
        label: 'Contact Number',
        dbField: 'contactNumber',
        type: 'textField',
        required: true,
        extendedProps: {
          textFieldAttribute: {
            InputProps: {
              inputComponent: CleaveInput
            },
            inputProps: {
              options: { phone: true, phoneRegionCode: 'PH' }
            }
          }
        }
      },
      {
        label: 'Dynamic Contact Number',
        dbField: 'DynamicContactNumber',
        type: 'auto-complete',
        required: true,
        extendedProps: {
          autoCompleteAttribute: {
            fullWidth: true,
            freeSolo: true,
            multiple: true,
            options: [],
            renderInput: params => null
          },
          customInputComponent: CleaveInput,
          cleaveOptions: { phone: true, phoneRegionCode: 'PH' },
          gridAttribute: { xs: 12 }
        }
      },
      {
        label: 'Clinic',
        dbField: 'clinicId',
        type: 'dropDownNonEntityReference',
        required: true,
        extendedProps: {
          gridAttribute: { xs: 12 },
          dropDownAttribute: {
            multiple: true
          },
          dropDownNonEntityReferenceAttribute: {
            data: clinicData && clinicData.length > 0 ? clinicData : [],
            dataIsloading: clinicDataIsLoading,
            menuItemTextPath: ['name']
          }
        }
      }
    ]
  };

  const onSubmit: SubmitHandler<{ civilStatusId: number; genderId: number; DynamicContactNumber: string[] }> = (data: {
    civilStatusId: number;
    genderId: number;
    DynamicContactNumber: string[];
  }) => {
    console.log(data);
  };

  const handleSelectDeselectAll = () => {
    if (clinicData?.length === getValues('clinicId').length) setValue('clinicId', []);
    else setValue('clinicId', clinicData ? clinicData.map(d => d.id) : []);
  };

  return (
    <div>
      {JSON.stringify(watch(), null, 2)}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {SAMPLE_FIELDS['General'].map((obj, i) => (
            <Grid item key={obj.dbField} {...obj.extendedProps?.gridAttribute}>
              <FormObjectComponent
                key={i}
                objFieldProp={obj}
                getValues={getValues}
                setValue={setValue}
                control={control}
                errors={errors}
              />
            </Grid>
          ))}
        </Grid>
        <Button type='submit' variant='contained' color='primary'>
          Submit
        </Button>
      </form>

      <Button variant='contained' color='secondary' onClick={() => handleSelectDeselectAll()}>
        {clinicData && clinicData.length === getValues('clinicId').length ? 'DeselectAll' : 'Select All'}
      </Button>

      {JSON.stringify(searchFilter, null, 2)}
      <DropdownData type='filter' id={2} handleSearchFilter={handleSearchFilter} searchFilterValue={searchFilter} />

      <Button onClick={() => handlePrintPDF({ pdfDocument: instance, iframeRef })}>PRINT</Button>
      <iframe ref={iframeRef}>sample Iframe</iframe>

      {/* <DatePickerWrapper>
        <DatePicker
          selectsRange
          monthsShown={2}
          endDate={endDateRange}
          selected={startDateRange}
          startDate={startDateRange}
          shouldCloseOnSelect={false}
          id='date-range-picker-months'
          onChange={handleOnChangeRange}
          isClearable={true}
          open={isOpen}
          onClickOutside={() => setIsOpen(prev => !prev)}
        />
      </DatePickerWrapper> */}

      <DatePickerWrapper>
        <DatePicker
          showTimeSelect
          selected={time}
          timeIntervals={30}
          showTimeSelectOnly
          dateFormat='h:mm aa'
          id='time-only-picker'
          popperPlacement='bottom-start'
          onChange={(date: Date) => setTime(date)}
        />
      </DatePickerWrapper>

      {JSON.stringify(time, null, 2)}

      {dataLoaded ? (
        <CardContent>
          <Grid container spacing={6}>
            {filterTableHeader.map(entityId => (
              <Grid key={entityId} item sm={4} xs={12}>
                <DropdownData
                  type='filter'
                  id={entityId}
                  handleSearchFilter={handleSearchFilter}
                  searchFilterValue={searchFilter}
                  customMenuItem={{
                    dateRange: {
                      render: childProps => (
                        <MenuItem
                          key={childProps?.key}
                          value={childProps?.value}
                          onClick={() => setOpen(prev => !prev)}
                        >
                          Date Range
                        </MenuItem>
                      )
                    }
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <DatePickerWrapper>
                <DateRangeInputSearch
                  boxAttribute={{
                    sx: { visibility: 'none' }
                  }}
                  reactDatePickerAttribute={{
                    className: 'hidden'
                  }}
                  open={open}
                  setOpen={setOpen}
                  handleDateRangeFilter={handleDateRangeFilter}
                  searchFilterValue={searchFilter}
                />
              </DatePickerWrapper>
            </Grid>
          </Grid>
        </CardContent>
      ) : null}

      <Button onClick={() => setIsOpen(prev => !prev)}>open</Button>

      <Autocomplete
        freeSolo
        multiple
        id='autocomplete-multiple-filled'
        defaultValue={[]}
        options={[]}
        renderInput={params => <TextField {...params} label='Contact Number' />}
        renderTags={(value: string[], getTagProps) => {
          return value.map((option: string, index: number) => (
            <Chip variant='outlined' label={option} {...(getTagProps({ index }) as {})} key={index} />
          ));
        }}
      />
      {/* 
      <TextField
        placeholder='Contact Number #2'
        InputProps={{
          inputComponent: CleaveInput,
          inputProps: {
            options: { phone: true, phoneRegionCode: 'PH' }
          }
        }}
      /> */}

      {/* <Autocomplete
        freeSolo
        multiple
        id='contact-number-autoComplete'
        defaultValue={[]}
        options={[]}
        renderInput={params => (
          <TextField
            {...params}
            placeholder='Contact Number Tags'
            label='Contact Number #2'
            InputProps={{
              ...params.InputProps,
              inputComponent: CustomInputComponent
            }}
          />
        )}
        renderTags={(value: string[], getTagProps) => {
          return value.map((option: string, index: number) => (
            <Chip variant='outlined' label={option} {...(getTagProps({ index }) as {})} key={index} />
          ));
        }}
      /> */}

      <Controller
        control={contactNumberControl}
        name='contactNumber'
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            freeSolo
            multiple
            defaultValue={[]}
            options={[]}
            value={value}
            onChange={(event, newValue) => onChange(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                placeholder='Contact Number'
                label='Contact Number #2'
                InputProps={{
                  ...params.InputProps,
                  inputComponent: CleaveInput
                }}
                inputProps={{
                  ...params.inputProps,
                  options: { phone: true, phoneRegionCode: 'PH' }
                }}
              />
            )}
            renderTags={(value: string[], getTagProps) => {
              return value.map((option: string, index: number) => (
                <Chip variant='outlined' label={option} {...(getTagProps({ index }) as {})} key={index} />
              ));
            }}
          />
        )}
      />

      {JSON.stringify(contactNumberWatch(), null, 2)}

      <CleaveWrapper>
        <InputLabel htmlFor='prefix' sx={{ mb: 2, fontSize: '.75rem', maxWidth: 'max-content' }}>
          Prefix
        </InputLabel>
        <Cleave id='prefix' options={{ prefix: '+63', blocks: [3, 3, 3, 4], uppercase: true, numericOnly: false }} />
      </CleaveWrapper>

      <FormControl fullWidth>
        <InputLabel id='demo-multiple-chip-label'>Chip</InputLabel>
        <Select
          multiple
          label='Chip'
          value={personName}
          MenuProps={{
            PaperProps: { style: { width: 250, maxHeight: 48 * 4.5 + 8 } }
          }}
          id='select-multiple-chip'
          onChange={handleChange}
          labelId='select-multiple-chip-label'
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {(selected as unknown as string[]).map(value => (
                <Chip key={value} label={value} sx={{ m: 0.75 }} />
              ))}
            </Box>
          )}
        >
          {names.map(name => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {'Multiple Select Value: ' + JSON.stringify(multipleSelectWatch(), null, 2)}
      <Controller
        control={multipleSelectControl}
        name='multipleProp'
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id='demo-multiple-chip-label'>Chip</InputLabel>
            <Select
              {...field}
              multiple
              label='Multiple Select Chip'
              MenuProps={{
                PaperProps: { style: { width: 250, maxHeight: 48 * 4.5 + 8 } }
              }}
              id='select-multiple-chip'
              labelId='select-multiple-chip-label'
            >
              {referencesData &&
                referencesData.length > 0 &&
                referencesData.map(ref => (
                  <MenuItem key={ref.id} value={ref.id.toString()}>
                    {ref.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      />
    </div>
  );
};

export default Test;

Test.acl = {
  action: 'read',
  subject: 'patient'
};
