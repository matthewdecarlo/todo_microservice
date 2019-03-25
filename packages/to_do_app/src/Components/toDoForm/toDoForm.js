import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '../input/input';
import axios from 'axios';
import { useStore, UPDATE_TO_DO_ITEMS } from '../../Context/state';
import { withStyles } from '@material-ui/core/styles';

const localDateTime = () => {
  const nowUtc = new Date();
  const offset = new Date().getTimezoneOffset();
  const now = nowUtc.setMinutes(nowUtc.getMinutes() - offset);

  return new Date(now).toISOString().split('.')[0];
};

const styles = theme => ({
  button: {
    alignSelf: 'flex-end'
  }
});

const ToDoForm = ({ classes, handleClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(localDateTime());
  const { 1: dispatch } = useStore();

  const mapSetState = {
    name: setName,
    description: setDescription,
    due: setDueDate
  };

  const createToDoItem = () => {
    const dueDateUTC = new Date(dueDate).toISOString();
    const newItem = { name, description, due_date: dueDateUTC };

    axios
      .post('http://localhost:4001/api/to_do_items', newItem)
      .then(function({ data }) {
        dispatch({ type: UPDATE_TO_DO_ITEMS, item: data });

        setName('');
        setDescription('');
        setDueDate(localDateTime());
        handleClose();
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const handleSetState = (key, value) => {
    mapSetState[key](value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    createToDoItem();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction='column'
        justify='space-between'
        alignItems='flex-start'
      >
        <Input
          label={'name'}
          setState={handleSetState}
          value={name}
          fullWidth
        />
        <Input
          label={'description'}
          setState={handleSetState}
          value={description}
          multiline={true}
          rows={5}
        />
        <Input
          value={dueDate}
          label={'due'}
          setState={handleSetState}
          shrink={true}
          type={'datetime-local'}
        />
        <Button
          className={classes.button}
          color='primary'
          size='large'
          onClick={handleSubmit}
        >
          Add
        </Button>
      </Grid>
    </form>
  );
};

export default withStyles(styles)(ToDoForm);
