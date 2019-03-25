import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterIcon from '@material-ui/icons/FilterList';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Drawer from '@material-ui/core/Drawer';
import ToDoForm from './Components/toDoForm/toDoForm';
import ToDoFilter from './Components/toDoFilter/toDoFilter';
import ToDoList from './Components/toDoList/toDoList';
import Typography from '@material-ui/core/Typography';
import { StateProvider, reducer } from './Context/state';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: 0,
    minHeight: '100vh'
  },
  fab: {
    margin: '2em 3em',
    width: '66.66%'
  },
  fabSmall: {
    margin: '2em 3em'
  },
  buttons: {
    alignSelf: 'flex-end',
    marginTop: 'auto'
  }
});

function Transition(props) {
  return <Slide direction='up' {...props} />;
}

const App = ({ classes }) => {
  const [initialState, setState] = useState({
    items: [],
    filters: {
      byStatus: {
        is_completed: false
      },
      byDate: {
        dueToday: false,
        dueTomorrow: false,
        overdue: false
      }
    },
    dispatch: action => {
      setState(state => reducer(state, action));
    }
  });

  const [openForm, setOpenForm] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const addToDoText = 'Add a new To-do';

  return (
    <Grid
      className={classes.root}
      container
      direction='column'
      justify='flex-start'
    >
      <Grid container justify='center'>
        <Typography variant='display3'>To-do:</Typography>
      </Grid>
      <StateProvider initialState={initialState} reducer={reducer}>
        <ToDoList />
        <Grid
          className={classes.buttons}
          container
          justify='space-around'
          alignItems='center'
        >
          <Fab
            className={classes.fab}
            color='primary'
            variant='extended'
            aria-label={addToDoText}
            onClick={() => setOpenForm(true)}
          >
            {addToDoText}
          </Fab>
          <Fab
            className={classes.fabSmall}
            color='secondary'
            aria-label={addToDoText}
            onClick={() => setOpenFilter(true)}
          >
            <FilterIcon />
          </Fab>
        </Grid>
        <Drawer
          anchor='right'
          open={openFilter}
          onClose={() => setOpenFilter(false)}
        >
          <div
            tabIndex={0}
            role='button'
            onClick={() => setOpenFilter(false)}
            onKeyDown={() => setOpenFilter(false)}
          >
            <ToDoFilter />
          </div>
        </Drawer>
        <Dialog
          fullWidth
          open={openForm}
          onClose={() => setOpenForm(false)}
          aria-labelledby='add-to-to'
          TransitionComponent={Transition}
        >
          <DialogTitle id='add-to-do'>{addToDoText}</DialogTitle>
          <DialogContent>
            <DialogContentText />
            <ToDoForm handleClose={() => setOpenForm(false)} />
          </DialogContent>
        </Dialog>
      </StateProvider>
    </Grid>
  );
};
export default withStyles(styles)(App);
