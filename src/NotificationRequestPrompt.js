import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActions } from '@mui/material';

import * as ServiceWorker from './service-worker';
import notificationrequest from './notificationrequest.jpg';

class NotificiationRequestPrompt extends React.Component {
    constructor() {
        super();
        this.state = {
            notificationPermission: localStorage.getItem("notificationPermission") 
        };
        this.handleDenyButtonClick = this.handleDenyButtonClick.bind(this);
        this.handleAllowButtonClick = this.handleAllowButtonClick.bind(this);
    }

    handleDenyButtonClick() {
        this.setState({notificationPermission: "denied"});
    }
    handleAllowButtonClick() {
        Notification.requestPermission().then((state) => {
            this.setState({notificationPermission: state});
            localStorage.setItem("notificationPermission", state);
        });
        ServiceWorker.registerPeriodicWaterLevelCheck();
    }

    render() {
        if (this.state.notificationPermission) {
            return;
        }
        //else
        return (
            <div id="overlayBackground">
            <div style={{ 
                display: "flex",
                justifyContent: "center",
                marginTop: 50,
            }}>
                <Card sx={{maxWidth:"25em"}}>
                  <CardMedia
                    component="img"
                    image={notificationrequest}
                    height="134"
                    alt="Browser notification prompt example"
                  />
                  <CardContent>
                    <h3>
                      Grant notification permission
                    </h3>
                    <p>
                      IoT Dashboard will warn you of abnormal water levels through 
                      notifications. Please click "Allow" to grant this permission.
                    </p>
                  </CardContent>
                  <CardActions>
                    <Button 
                       onClick={this.handleDenyButtonClick}
                       color="primary"
                    >
                        Deny
                    </Button>
                    <Button 
                        onClick={this.handleAllowButtonClick}
                        color="primary"
                    >
                        Allow
                    </Button>
                  </CardActions>
                </Card>
            </div>
            </div>
        );
    }

}

export default NotificiationRequestPrompt;
