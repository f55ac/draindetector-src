import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function BasicDateTimePicker(props) {
    return (
      <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(args) => <TextField {...args} />}
          label={props.label}
          value={props.value}
          onChange={props.onChange}
        />
      </LocalizationProvider>
      </div>
    );
}

class ChartToolbar extends React.Component {
    render() {
        return (
            <div style={{marginTop:50, justifyContent:"center", display: "flex"}}>
                <BasicDateTimePicker 
                    label="Time range start"
                    value={this.props.timeStart}
                    onChange={this.props.onStartChange}/>
                <BasicDateTimePicker 
                    label="Time range end"
                    value={this.props.timeEnd}
                    onChange={this.props.onEndChange}/>
                <Button variant="filled" onClick={this.props.onApplyClick}>
                    Apply
                </Button>
                <Button variant="outlined" onClick={this.props.onExportClick}>
                    Export
                </Button>
            </div>
        );
    }
}

export default ChartToolbar;
