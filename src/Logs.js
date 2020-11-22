import React, {Component} from "react";
import Axios from "axios";
import { Card, CardContent } from '@material-ui/core';
import Grid from "@material-ui/core/Grid";


class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: []
        };
        this.createLogs = this.createLogs.bind(this);
    }

    componentDidMount() {
        Axios.get('http://localhost:8080/getlogs',
            {headers: {"Content-Type": "application/json"}})
            .then( response => {
                this.setState({
                    logs: response.data
                });
            });
    }

     createLogs(logs) {
        return (
           <div>
                {logs.map(logs => (
                    <Card style={{ width: 1000, height: 100 }} variant="outlined">
                        <CardContent>
                            {logs}
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    render() {
        const { logs } = this.state;
        //const logs = ['James', 'Paul', 'John', 'George', 'Ringo'];
        let logCards = this.createLogs(logs);

        return (
            <div style={{ height: 1500 }}>
                <Grid container spacing={2} justify="center">
                    <div style={{ height: 1200 }}>
                    <h3 style={{ width: 300 }}>Temporary send logs</h3>
                    {logCards}
                    </div>
                </Grid>
            </div>
        );
    }
}

export default Logs;