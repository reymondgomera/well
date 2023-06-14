import { SelectChangeEvent } from '@mui/material';
import { TRPCClientError } from '@trpc/client';
import _ from 'lodash';
import { useState, useCallback, MutableRefObject } from 'react';
import { DynamicType, FilterQueryInputType, FormInputType } from './common.type';
import moment from 'moment';
import ReactPDF from '@react-pdf/renderer';

type ErrorType = {
  status: 'CONFLICT' | 'ERROR';
  message: string;
};

export function errorUtil(error: unknown): ErrorType {
  if (error instanceof TRPCClientError) {
    if (error.data?.httpStatus === 409) {
      return { status: 'CONFLICT', message: error.message };
    }
  }

  return { status: 'ERROR', message: `Unexpected error: ${error}!` };
}

export function getRandomNumber(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function useFilterControlChange() {
  const [searchFilter, setSearchFilter] = useState<DynamicType>({});
  const [open, setOpen] = useState<boolean>(false);

  const handleSearchFilter = useCallback((e: SelectChangeEvent) => {
    const { name, value } = e.target;

    let key: FormInputType = 'textField'; //e.type === change
    switch (e.type) {
      case 'click':
        key = 'dropDown';
        break;

      default:
        key = 'textField';
        break;
    }

    setSearchFilter(prev => {
      prev[key] = { ...prev[key], [name]: value };

      prev['dropDown'] = _.omit(prev['dropDown'], name === 'timeframe' ? ['dateRangeInputValue'] : []);

      return { ...prev };
    });
  }, []);

  const handleDateRangeFilter = (date: Date[]) => {
    setSearchFilter(prev => {
      prev['dropDown'] = { ...prev['dropDown'], dateRangeInputValue: { start: date[0], end: date[1] } };

      return { ...prev };
    });
  };

  return { searchFilter, setSearchFilter, open, setOpen, handleSearchFilter, handleDateRangeFilter };
}

export function getFilterObjValue(objVal?: FilterQueryInputType) {
  const searchFilter = _.get(objVal, 'searchFilter');
  const dropDownValue = _.get(objVal, 'dropDown');
  const inputValue = _.get(objVal, 'textField.inputValue');
  const dateRangeInputValue = _.get(objVal, 'dropDown.dateRangeInputValue');

  return { searchFilter, dropDownValue, inputValue, dateRangeInputValue };
}

export function isObjEmpty(obj: any) {
  return _.isEmpty(obj);
}

export type NestedKey<O extends Record<string, unknown>> = {
  [K in Extract<keyof O, string>]: O[K] extends Array<any>
    ? K
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKey<O[K]>}`
    : K;
}[Extract<keyof O, string>];

/** 
 * a reviver function checks if the parsed value is a string that matches the ISO 8601 date format, 
   and if so, it constructs a new Date object from the parsed values. 
*/
export function parseJSONWithDates(jsonString: string): any {
  const reviver = (key: string, value: any) => {
    if (typeof value === 'string') {
      const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z$/.exec(value);
      if (match) {
        return new Date(value);
      }
    }
    return value;
  };

  return JSON.parse(jsonString, reviver);
}

export function checkDate(date: Date) {
  const REFERENCE = moment();
  const momentDate = moment(date);

  return {
    isToday() {
      const TODAY = REFERENCE.clone().startOf('day');
      return momentDate.isSame(TODAY, 'day');
    },
    isYesterday() {
      const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
      return momentDate.isSame(YESTERDAY, 'day');
    },
    isWithinThisWeek() {
      const START_OF_WEEK = REFERENCE.clone().startOf('isoWeek');
      const END_OF_WEEK = REFERENCE.clone().endOf('isoWeek');
      return momentDate.isBetween(START_OF_WEEK, END_OF_WEEK, 'day', '[]');
    },
    isWithinThisMonth() {
      const START_OF_MONTH = REFERENCE.clone().startOf('month');
      const END_OF_MONTH = REFERENCE.clone().endOf('month');
      return momentDate.isBetween(START_OF_MONTH, END_OF_MONTH, 'day', '[]');
    },
    isWithinThisYear() {
      const START_OF_YEAR = REFERENCE.clone().startOf('year');
      const END_OF_YEAR = REFERENCE.clone().endOf('year');
      return momentDate.isBetween(START_OF_YEAR, END_OF_YEAR, 'day', '[]');
    }
  };
}

export function checkDateRange(dateToCheck: Date, start: Date, end: Date) {
  const momentDate = moment(dateToCheck);

  return {
    isBetweenOrEqual() {
      return momentDate.isSameOrAfter(start, 'day') && momentDate.isSameOrBefore(end, 'day');
    }
  };
}

type handlePrintPDFType = {
  pdfDocument: ReactPDF.UsePDFInstance;
  iframeRef: MutableRefObject<null>;
};

export const handlePrintPDF = async ({ pdfDocument, iframeRef }: handlePrintPDFType) => {
  const url = URL.createObjectURL(pdfDocument.blob!);

  if (iframeRef.current) {
    const iframe: HTMLIFrameElement = iframeRef.current;
    iframe.src = url;
    iframe.onload = () => iframe.contentWindow?.print();
  }
};
