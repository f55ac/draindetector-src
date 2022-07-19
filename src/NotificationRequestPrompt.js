import React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import notificationrequest from './notificationrequest.jpg';
import { registerPeriodicWaterLevelCheck } from './service-worker.js';

class NotificationRequestPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.onDenyButtonClick=this.onDenyButtonClick.bind(this);
        this.onAllowButtonClick=this.onAllowButtonClick.bind(this);
        this.state = { permission: localStorage.getItem("notificationPermission") };
    }

    onDenyButtonClick() {
        this.setState({permission: "denied"});
    }
    onAllowButtonClick() {
        Notification.requestPermission()
            .then((state) => {
                this.setState({permission: state});
                localStorage.setItem("notificationPermission", state);
                registerPeriodicWaterLevelCheck();
            });
    }

    render() {
        if (this.state.permission) {
            return;
        }
        else {
            return (
                <div id="overlayBackground">
                <div style={{display: "flex", justifyContent: "center", marginTop: 50}}>
                    <Card sx={{ maxWidth:"25em" }}>
                        <CardMedia
                            component="img"
                            height="134"
                            image={notificationrequest}
                            alt="Browser notification prompt example"
                        />
                        <CardContent>
                            <h3> Grant notification permission </h3>
                            <p> 
                                IoT Dashboard will warn you of abnormal water levels through 
                                notifications. Please click "Allow" to grant this permission. 
                            </p>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={this.onDenyButtonClick}>Deny</Button>
                            <Button size="small" onClick={this.onAllowButtonClick}>Allow</Button>
                        </CardActions>
                    </Card>
                </div>
                </div>
            );
        }
    }
}

export default NotificationRequestPrompt;
