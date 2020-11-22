import './css/App.css';
import { Button, TextField } from '@material-ui/core';
import React, {Component} from "react";
import { DataGrid } from '@material-ui/data-grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from "@material-ui/core/Grid";
import Axios from "axios";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            row : { type:'', from: '', to: '', sendTime: 0, templateId: 0, id: 0 },
            rows: [],
            numRows: 1,
            sendData: false,
            templates: []
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.createNewRequest = this.createNewRequest.bind(this);
        this.setTemplateId = this.setTemplateId.bind(this);
        this.sendNotifications = this.sendNotifications.bind(this);
        this.getTemplates = this.getTemplates.bind(this);
    }
    onTextChange(event) {
        const { row } = this.state;
        if(event.target.id === 'type')
            row.type = event.target.value;
        if(event.target.id === 'to')
            row.to = event.target.value;
        if(event.target.id === 'from')
            row.from = event.target.value;
        if(event.target.id === 'st')
            row.sendTime = Number(event.target.value);
        if(event.target.id === 'tid')
            row.templateId = Number(event.target.value);
        this.setState({
            row: row
        });
    }
    setTemplateId(templateId) {
        const { row } = this.state;
        row.templateId = templateId;
        this.setState({
            row: row
        });
    }
    createNewRequest() {
        this.setState({sendData: true});
        this.forceUpdate();
        const { rows } = this.state;
        const data = JSON.stringify(rows);
        this.sendNotifications(data);
    }
    sendNotifications(data){
        Axios.post(
            'http://localhost:8080/initiatenotifications',
            data,
            {headers: {"Content-Type": "application/json"}})
            .then( response => {
                if(response.status===200)
                    alert("MESSAGES WILL GET CONSUMED");
            });
    }
    getTemplates() {
        Axios.get('http://localhost:8080/getalltemplates',
            {headers: {"Content-Type": "application/json"}})
            .then( response => {
                this.setState({
                    templates: response.data
                });
            });
    }
    addColumn() {
        const { row } = this.state;
        let { numRows } = this.state;
        let clone = {...row};
        let tempRows = this.state.rows;
        tempRows.push(clone);
        row.id = numRows;
        this.setState({
            rows: tempRows,
            numRows: this.state.numRows + 1
        });
    }
    componentDidMount() {
        this.getTemplates();
    }
    render() {
        const cols = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'type', headerName: 'TYPE', width: 140 },
            { field: 'to', headerName: 'TO', width: 140 },
            { field: 'from', headerName: 'FROM', width: 140 },
            { field: 'sendTime', headerName: 'ST (IN MINUTES)', width: 200 },
            { field: 'templateId', headerName: 'TID', width: 70 },
        ];

        let dataGrid = '';
        let { rows, sendData } = this.state;
        if(rows.length!==0&&sendData===true) {
            console.log(rows);
            dataGrid = <DataGrid rows={rows} columns={cols} pageSize={5} />;
        }

        return (
            <div>
                <Grid container spacing={2} justify="center">
                    <div style={{ height: 800 }}>
                        <h3 style={{ width: 300 }} color="primary">Please enter the columns to initiate notification send process. go to /logs to check new logs</h3>
                        <TextField onChange={this.onTextChange} style={{ width: 300 }} name="type" id="type" label="type (sms/email/app)" variant="outlined"/><br/><br/>
                        <TextField onChange={this.onTextChange} style={{ width: 300 }} name="from" id="from" label="from (employee name)" variant="outlined"/><br/><br/>
                        <TextField onChange={this.onTextChange} style={{ width: 300 }} name="to" id="to" label="to (customer name)" variant="outlined"/><br/><br/>
                        <TextField onChange={this.onTextChange} style={{ width: 300 }} type="number" name="st" id="st" label="send time (in min.)" variant="outlined"/><br/><br/>
                        <Autocomplete
                            onChange={(event, value) =>
                                this.setTemplateId(value.id)
                            }
                            style={{ width: 300 }}
                            id="template-id"
                            options={this.state.templates}
                            getOptionLabel={(option) => option.template}
                            getOptionSelected={(option, value) => option.template === value.template}
                            renderInput={(params) =>
                                <TextField {...params} label="template" variant="outlined" />}
                        /><br/><br/>
                        <Button onClick={this.addColumn} style={{ width: 300 }} variant="outlined" color="primary">Add a new entry</Button><br/><br/>
                        <Button onClick={this.createNewRequest} style={{ width: 300 }} variant="outlined" color="primary">Create a new request</Button>
                    </div>
                </Grid>
                <div style={{ height: 400, width: '100%' }}>
                    {dataGrid}
                </div>
            </div>
        );
    }
}

export default App;
