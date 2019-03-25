import React from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  useStore,
  FILTER_TO_DO,
  FILTER_TO_DO_CLEAR
} from '../../Context/state';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/RadioButtonChecked';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import BlankIcon from '@material-ui/icons/RadioButtonUnchecked';
import StatusIcon from '@material-ui/icons/NotificationsActive';

const styles = {
  list: {
    width: '14em'
  },
  button: {
    width: '100%',
    padding: '0.8em 0'
  }
};

const ToDoFilter = ({ classes }) => {
  const today = 'dueToday';
  const tomorrow = 'dueTomorrow';
  const dueDayToggle = [today, tomorrow];
  const isCompleted = 'is_completed';
  const overdueKey = 'overdue';
  const statusToggle = [isCompleted, overdueKey];
  const [
    {
      filters,
      filters: {
        byStatus: { is_completed },
        byDate: { dueToday, dueTomorrow, overdue }
      }
    },
    dispatch
  ] = useStore();

  const items = [
    {
      action: null,
      icon: <CalendarIcon />,
      text: 'Due By',
      divider: true
    },
    {
      action: () => handleToggle(dueDayToggle, today),
      icon: dueToday ? <CheckIcon /> : <BlankIcon />,
      text: 'Today',
      button: true
    },
    {
      action: () => handleToggle(dueDayToggle, tomorrow),
      icon: dueTomorrow ? <CheckIcon /> : <BlankIcon />,
      text: 'Tomorrow',
      button: true
    },
    {
      action: null,
      icon: null,
      text: null,
      divider: null
    },
    {
      action: null,
      icon: <StatusIcon />,
      text: 'Status',
      divider: true
    },
    {
      action: () => handleToggle(statusToggle, isCompleted),
      icon: is_completed ? <CheckIcon /> : <BlankIcon />,
      text: 'Completed',
      button: true
    },
    {
      action: () => handleToggle(statusToggle, overdueKey),
      icon: overdue ? <CheckIcon /> : <BlankIcon />,
      text: 'Overdue',
      button: true
    },
    {
      action: null,
      icon: null,
      text: null,
      divider: null
    }
  ];

  const getByFilter = filter => {
    const filterEntries = Object.entries(filters);
    const byFilter = filterEntries.reduce((reducer, filterSet) => {
      const key = filterSet[0];
      const filterTypes = Object.keys(filterSet[1]);

      return filterTypes.includes(filter) ? key : reducer;
    }, '');

    return byFilter;
  };

  const handleToggle = (setToToggle, filter) => {
    for (const key of setToToggle) {
      const toggle = key === filter;
      const byFilter = getByFilter(key);

      if (filter === overdueKey) handleClearFilter();

      dispatch({
        byFilter,
        filter: key,
        toggle,
        type: FILTER_TO_DO
      });
    }
  };

  const handleClearFilter = () => {
    dispatch({ type: FILTER_TO_DO_CLEAR });
  };

  const renderListItem = (item, index) => {
    const { action, button, divider, icon, text } = item;

    return (
      <ListItem button={button} divider={divider} key={index} onClick={action}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={text} />
      </ListItem>
    );
  };

  const renderList = () => {
    return items.map((item, index) => renderListItem(item, index));
  };

  return (
    <List className={classes.list}>
      {renderList()}{' '}
      <Button
        color='secondary'
        className={classes.button}
        onClick={handleClearFilter}
      >
        Clear Filters
      </Button>
    </List>
  );
};

export default withStyles(styles)(ToDoFilter);
