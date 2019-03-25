import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import BlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Button from '@material-ui/core/Button';
import CalendarIcon from '@material-ui/icons/Event';
import CheckIcon from '@material-ui/icons/CheckBox';
import Chip from '@material-ui/core/Chip';
import CompletedIcon from '@material-ui/icons/EventAvailable';
import DueTodayIcon from '@material-ui/icons/NotificationImportant';
import DueTomorrowIcon from '@material-ui/icons/Notifications';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import OverdueIcon from '@material-ui/icons/EventBusy';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import {
  convertFirestoreDate,
  isDueToday,
  isDueTomorrow,
  isOverDue
} from '../../Helpers/dateHelper';
import { StopPropagationWrapper } from '../stopPropagation/stopPropagation';
import { withStyles } from '@material-ui/core/styles';
import {
  useStore,
  DELETE_TO_DO_ITEM,
  TOGGLE_TO_DO_COMPLETED
} from '../../Context/state';

const styles = theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    alignSelf: 'center'
  },
  chipHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    paddingRight: '0 !important',
    alignSelf: 'center'
  }
});

const ToDoItem = props => {
  const { classes, expanded, handleChange, item } = props;
  const { description, due_date, id, is_completed, name } = item;
  const { 1: dispatch } = useStore();
  const [completionIcon, setCompletionIcon] = useState(<BlankIcon />);
  const [isCompleted, setIsCompleted] = useState(is_completed);
  const [dueDateColor, setDueDateColor] = useState('default');
  const [dueDateIcon, setDueDateIcon] = useState(<CalendarIcon />);
  const assignedDate = new Date(convertFirestoreDate(due_date));

  const deleteToDoItem = () => {
    axios
      .delete(`http://localhost:4001/api/to_do_items/${id}`)
      .then(() => {
        dispatch({ type: DELETE_TO_DO_ITEM, id });
      })
      .catch(function(error) {
        console.warn('API deleteToDoItem', error);
      });
  };

  const updateToDoItem = property => {
    const postURL = 'http://localhost:4001/api/to_do_items/update';
    const queryURL = postURL + `?where={"id":"${id}"}`;

    axios
      .post(queryURL, property)
      .then(({ data }) => {
        dispatch({ type: TOGGLE_TO_DO_COMPLETED, id });
      })
      .catch(function(error) {
        console.warn('API updateToDoItem', error);
      });
  };

  const handleIsCompleted = () => {
    const toggle = !isCompleted;

    setIsCompleted(toggle);
    updateToDoItem({ is_completed: toggle });
  };

  const formatDate = () => {
    let date = convertFirestoreDate(due_date);
    if (typeof date === 'string') {
      date = new Date(date);
    }

    return date
      .toLocaleString()
      .split(',')
      .join('');
  };

  const renderCompletion = () => {
    if (isCompleted) {
      setCompletionIcon(<CheckIcon />);
      setDueDateIcon(<CompletedIcon />);
      setDueDateColor('default');
      return;
    } else if (isDueToday(assignedDate)) {
      setDueDateIcon(<DueTodayIcon />);
      setDueDateColor('secondary');
    } else if (isDueTomorrow(assignedDate)) {
      setDueDateIcon(<DueTomorrowIcon />);
      setDueDateColor('primary');
    } else if (isOverDue(assignedDate)) {
      setDueDateIcon(<OverdueIcon />);
      setDueDateColor('default');
    } else {
      setDueDateIcon(<CalendarIcon />);
      setDueDateColor('default');
    }
    setCompletionIcon(<BlankIcon />);
  };

  useEffect(renderCompletion, [isCompleted]);

  return (
    <ExpansionPanel expanded={expanded === id} onChange={handleChange(id)}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <StopPropagationWrapper>
          <IconButton
            color='primary'
            className={classes.button}
            aria-label='Complete'
            variant='outlined'
            onClick={handleIsCompleted}
          >
            {completionIcon}
          </IconButton>
        </StopPropagationWrapper>
        <Typography className={classes.heading}>{name}</Typography>
        <Chip
          color={dueDateColor}
          className={classes.chipHeading}
          avatar={<Avatar>{dueDateIcon}</Avatar>}
          variant='outlined'
          label={'Due: ' + formatDate()}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
          <Typography>{description}</Typography>
        </Grid>
        <Grid container justify='flex-end'>
          <Button
            color='secondary'
            className={classes.button}
            aria-label='Delete'
            onClick={deleteToDoItem}
          >
            Delete
          </Button>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default withStyles(styles)(ToDoItem);
