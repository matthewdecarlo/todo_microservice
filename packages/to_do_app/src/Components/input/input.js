import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

const Input = props => {
  const {
    classes,
    label,
    multiline,
    rows,
    setState,
    shrink,
    type,
    value
  } = props;

  const useInput = () => {
    return {
      label,
      type,
      value,
      onChange: event => setState(label, event.target.value)
    };
  };
  const inputProps = useInput();

  const handleShrinkLabel = () => {
    if (shrink) {
      return { shrink: true };
    }
  };

  return (
    <TextField
      {...inputProps}
      className={classes.textField}
      margin='normal'
      variant='outlined'
      fullWidth
      rows={rows}
      multiline={multiline}
      InputLabelProps={handleShrinkLabel()}
    />
  );
};

export default withStyles(styles)(Input);
