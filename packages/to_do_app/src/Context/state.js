import React, { createContext, useContext, useReducer } from 'react';

export const GET_TO_DO_ITEMS = 'GET_TO_DO_ITEMS';
export const DELETE_TO_DO_ITEM = 'DELETE_TO_DO_ITEM';
export const FILTER_TO_DO = 'FILTER_TO_DO';
export const FILTER_TO_DO_CLEAR = 'FILTER_TO_DO_CLEAR';
export const UPDATE_TO_DO_ITEMS = 'UPDATE_TO_DO_ITEMS';
export const TOGGLE_TO_DO_COMPLETED = 'TOGGLE_TO_DO_COMPLETED';

export const reducer = (state, action) => {
  const { type } = action;

  switch (type) {
    case DELETE_TO_DO_ITEM: {
      const { id } = action;
      let items = state.items.slice();

      items = items.filter(item => item.id !== id);

      return { ...state, items };
    }

    case FILTER_TO_DO: {
      const { byFilter, filter, toggle } = action;

      return {
        ...state,
        filters: {
          ...state.filters,
          [byFilter]: { ...state.filters[byFilter], [filter]: toggle }
        }
      };
    }

    case FILTER_TO_DO_CLEAR: {
      return {
        ...state,
        filters: {
          byStatus: {
            is_completed: false
          },
          byDate: {
            dueToday: false,
            dueTomorrow: false,
            overdue: false
          }
        }
      };
    }

    case GET_TO_DO_ITEMS: {
      const { items } = action;

      return { ...state, items };
    }

    case TOGGLE_TO_DO_COMPLETED: {
      const { id } = action;
      const { items } = state;
      const item = items.find(item => item.id === id);
      const updatedItem = Object.assign(
        {},
        { ...item },
        { is_completed: !item.is_completed }
      );
      const update = items.map(item => (item.id === id ? updatedItem : item));

      return { ...state, items: update };
    }

    case UPDATE_TO_DO_ITEMS: {
      const { item } = action;

      return { ...state, items: [...state.items, item] };
    }

    default:
      return state;
  }
};

export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStore = () => useContext(StateContext);
