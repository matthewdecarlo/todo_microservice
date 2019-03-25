import React, { useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import ToDoItem from '../toDoItem/toDoItem';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { useStore, GET_TO_DO_ITEMS } from '../../Context/state';
import { withStyles } from '@material-ui/core/styles';
import { useFilteredToDos } from '../../Selectors/toDoItemsSelectors';

const styles = theme => ({
  progress: {
    alignSelf: 'center'
  }
});

const ToDoList = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { 1: dispatch } = useStore();
  const items = useFilteredToDos();

  const [expanded, setExpanded] = useState(false);

  const getToDoItems = () => {
    setIsLoading(true);

    axios
      .get('http://localhost:4001/api/to_do_items')
      .then(response => {
        const { data } = response;

        setIsLoading(false);
        dispatch({ type: GET_TO_DO_ITEMS, items: data });
      })
      .catch(error => {
        console.warn('API getToDoItems', error);
      });
  };

  const handleItemChange = panel => (event, expanded) => {
    setExpanded(expanded ? panel : false);
  };

  useEffect(getToDoItems, []);

  const renderList = () => {
    return items.map(item => {
      return (
        <ToDoItem
          key={item.id}
          expanded={expanded}
          item={item}
          handleChange={handleItemChange}
        />
      );
    });
  };

  const renderToDoList = () => {
    if (isLoading) {
      return (
        <div>
          <Typography component='h1' variant='display1' gutterBottom>
            Fetching Your To-dos...
          </Typography>
          <LinearProgress color='primary' />
        </div>
      );
    } else {
      return <div>{renderList()}</div>;
    }
  };

  return renderToDoList();
};

export default withStyles(styles)(ToDoList);
