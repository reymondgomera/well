import type { RouterKeyType } from '@/server/routers';
import { ReferencesEntityType } from './db.type';
import { QueryKey } from '@tanstack/react-query';
import { queryClient, trpc } from '@/utils/trpc';
import { DynamicType, FilterQueryInputType } from './common.type';
import _ from 'lodash';
import { checkDate, checkDateRange, getFilterObjValue } from '@/utils/helper';
import moment from 'moment';

type RQCachedType = FilterQueryInputType & { queryKey: QueryKey };
type RQKeyType = {
  routerKey: RouterKeyType;
  queryKey: { entityId?: number } | { entities?: number[] };
  filterQuery?: FilterQueryInputType;
};

export function GetCachedData<TData extends ReferencesEntityType>(_rqParams: RQCachedType) {
  const { queryKey, id } = _rqParams;
  const data = queryClient.getQueryData(queryKey) as TData[];

  let filterDataDeleted: TData[] | undefined;
  let rowData: TData | undefined;
  let index = -1;

  if (data && id) {
    filterDataDeleted = data.filter(row => row.id !== id);
    rowData = data?.find(row => row['id'] === id);
    index = data?.findIndex(row => row['id'] === id);
  }

  return { data, filterDataDeleted, rowData, index, queryKey };
}

export function GetQueryKey(_rqParams: RQKeyType) {
  const { routerKey, queryKey } = _rqParams;

  if (routerKey) return trpc[routerKey!].list.getQueryKey(queryKey, 'query');
}

export function InvalidateQueries(_rqParams: RQKeyType) {
  queryClient.invalidateQueries(GetQueryKey(_rqParams));
}

export function SetQueryDataDeleted(_rqParams: RQKeyType) {
  const queryKey = GetQueryKey(_rqParams);
  if (queryKey) {
    const { filterDataDeleted } = GetCachedData({
      queryKey,
      id: _rqParams.filterQuery?.id
    });

    filterDataDeleted && queryClient.setQueryData(queryKey, filterDataDeleted);
  }
}

interface FilterInf<TData> {
  data: TData[];
  query?: FilterQueryInputType;
  filter(): void;
  textSearch(): void;
  dropDown(): void;
}

export class FilterData<TData extends DynamicType> implements FilterInf<TData> {
  data: TData[];
  query: FilterQueryInputType | undefined;
  private searchFilter!: DynamicType;
  private dropDownValue!: DynamicType;
  private inputValue!: string;
  private dateRangeInputValue!: DynamicType;

  constructor(data: TData[], query?: FilterQueryInputType) {
    this.data = data;
    this.query = query;

    this.init();
  }

  private init() {
    this.searchFilter = getFilterObjValue(this.query).searchFilter;
    this.dropDownValue = getFilterObjValue(this.searchFilter).dropDownValue;
    this.inputValue = getFilterObjValue(this.searchFilter).inputValue;
    this.dateRangeInputValue = getFilterObjValue(this.searchFilter).dateRangeInputValue;
  }

  filter() {
    if (_.isEmpty(this.searchFilter)) return this.data;

    this.dropDown();
    this.dateRange();
    this.textSearch();

    return this.data;
  }

  textSearch() {
    if (!this.inputValue) return this.data;

    const searchNestedObj = (obj: { [key: string]: any }) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value && typeof value === 'object') {
          searchNestedObj(value);
        } else if (value && typeof value === 'string') {
          if (value.toLowerCase().includes(this.inputValue.toLowerCase())) {
            return true;
          }
        }
      }
      return false;
    };

    return (this.data = _.filter(this.data, row =>
      Object.keys(row).some(key => {
        const nestedObj = _.get(row, key);
        const value = nestedObj ? nestedObj : row[key];

        if (value && typeof value === 'object') {
          return searchNestedObj(value);
        } else if (value && typeof value === 'string') {
          return value.toLowerCase().includes(this.inputValue.toLowerCase());
        }
      })
    ));
  }

  dropDown() {
    if (!this.dropDownValue) return this.data;

    for (const key in this.dropDownValue) {
      const value = _.get(this.dropDownValue, key);

      if (value < 1 || value?.length < 1) {
        delete this.dropDownValue[key];
      }
    }

    if (_.has(this.dropDownValue, 'timeframe')) {
      this.data = _.filter(this.data, row => {
        const dateValue = _.get(row, 'createdAt');
        const timeframe = _.get(this.dropDownValue, 'timeframe');

        // checks the timeframe reference id
        switch (timeframe) {
          case 34:
            return checkDate(dateValue).isToday();

          case 35:
            return checkDate(dateValue).isYesterday();

          case 36:
            return checkDate(dateValue).isWithinThisWeek();

          case 37:
            return checkDate(dateValue).isWithinThisMonth();

          case 38:
            return checkDate(dateValue).isWithinThisYear();

          default:
            return true;
        }
      }) as TData[];
    }

    return (this.data = _.filter(
      this.data,
      _.omit(this.dropDownValue, ['timeframe', 'dateRangeInputValue'])
    ) as TData[]);
  }

  dateRange() {
    if (!this.dateRangeInputValue) return this.data;

    return (this.data = _.filter(this.data, row => {
      const { start, end } = this.dateRangeInputValue;
      const dateToCheck = _.get(row, 'createdAt');

      if (dateToCheck && start && end) {
        if (moment(start).isValid() && moment(end).isValid() && moment(dateToCheck).isValid()) {
          return checkDateRange(dateToCheck, start, end).isBetweenOrEqual();
        } else return false;
      } else return true;
    }));
  }
}
