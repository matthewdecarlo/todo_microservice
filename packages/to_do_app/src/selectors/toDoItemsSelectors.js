import { useMemo } from 'react';
import { useStore } from '../Context/state';
import {
  convertFirestoreDate,
  isDueToday,
  isDueTomorrow,
  isOverDue
} from '../Helpers/dateHelper';

const applyFilter = (toFilter, callback, previousFilter = null) => {
  const [{ items, filters }] = useStore();
  const byFilters = filters[toFilter];
  const byFiltersSet = Object.entries(byFilters);

  const filtered = byFiltersSet.reduce((filteredItems, filter) => {
    return callback(filteredItems, filter);
  }, previousFilter || items);

  return filtered;
};

const filterByStatus = (items, filter) => {
  const { 0: key, 1: isFiltered } = filter;

  const memo = useMemo(() => items.filter(item => item[key]), [
    items,
    isFiltered
  ]);

  return isFiltered ? memo : items;
};

const filterByDate = (items, filter) => {
  const { 0: key, 1: isFiltered } = filter;
  const dateMap = {
    dueTomorrow: isDueTomorrow,
    dueToday: isDueToday,
    overdue: isOverDue
  };

  const constraint = dateMap[key];

  const memo = useMemo(() => {
    const filtered = items.filter(item => {
      const date = convertFirestoreDate(item.due_date);
      const { is_completed } = item;

      if (key === 'overdue') {
        return constraint(date) && !is_completed;
      }

      return constraint(date);
    });

    return filtered;
  }, [items, isFiltered]);

  return isFiltered ? memo : items;
};

const isFiltered = () => {
  const [{ filters }] = useStore();
  const filterSet = Object.values(filters);

  const isFiltered = filterSet.reduce((boolean, filter) => {
    const isActive = Object.values(filter);

    if (isActive.includes(true)) return true;

    return boolean;
  }, false);

  return isFiltered;
};

export const useFilteredToDos = filter => {
  const [{ items }] = useStore();
  const byStatus = 'byStatus';
  const byDate = 'byDate';

  const filteredStatus = applyFilter(byStatus, filterByStatus);
  const filterdByDate = applyFilter(byDate, filterByDate, filteredStatus);

  return isFiltered() ? filterdByDate : items;
};
