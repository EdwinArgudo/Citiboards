import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'
import StationSimulator from './StationSimulator'
import HistoricalReport from './HistoricalReport'
import StationRebalancing from './StationRebalancing'
import MissingBoards from './MissingBoards'

export default class Reports extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            alert: '',
            historical:[],
            stationRebalancing: [],
            missingBoards:[],
            HRboardID: '',
            HRboardID_submit: ''
        }
    }
    componentDidMount() {

    }

    handleInputChange = (event) => {
      const { value, name } = event.target;
      this.setState({
        [name]: value
      });
    }

    generateReports = (event) => {
        event.preventDefault();
        this.setState({
            message: "Processing...",
            alert: 'info'
        })
        axios.get('/api/v1/admin/generate-reports')
        .then(res => {
            console.log(res)
            if (res['data']['error']) {
                this.setState({
                    message: res['data']['error'],
                    alert: 'bad'
                });
                const error = new Error(res['data']['error']);
                throw error;
            } else {
                this.setState({
                    message: "Reports Generated!",
                    alert: 'good'
                })
            }
        })
        .catch(err => {
            console.error(err);
            //alert(err.message);
            this.setState({
                message: err.message,
                alert: 'bad'
            });
        });
    }

    getHistoricalReport = (event) => {
        event.preventDefault();
        this.setState({
            HRboardID_submit: this.state.HRboardID
        })
    }

    render() {
        let message = ""
        if(this.state.message !== ""){
            let type = null
            let heading = null
            let m = ( <p class="mb-0"> { this.state.message }</p> )
            switch(this.state.alert) {
                case "info":
                    type = "info"
                    heading = "Processing..."
                    m = null
                    break;
                case "good":
                    type = "success"
                    heading = "Success!"
                    break;
                case "bad":
                    type = "warning"
                    heading = "Error!"
                    break;
            }

            message = (
                 <div class={`alert alert-dismissible alert-${type}`}>
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <h4 class="alert-heading">{heading}</h4>
                    { m }
                </div>
            )
        }

        let historicalReport = this.state.HRboardID_submit !== '' ? <HistoricalReport boardID={this.state.HRboardID_submit}/> : null
        return (
            <div class="container-fluid mt-3 mb-3">
                <h1 class="display-5">Reports</h1>
                { message }
                <form onSubmit={this.generateReports}>
                    <p class="lead">
                        <input type="submit" class="btn btn-success" value="Generate Reports"/>
                    </p>
                </form>
                <hr class="my-4"/>
                <div class="card bg-light mb-3">
                    <div class="card-header">Historical Report</div>
                    <div class="card-body">
                        <form onSubmit={this.getHistoricalReport}>
                            <div class="form-group">
                                <input
                                    name="HRboardID"
                                    placeholder="Enter Board ID"
                                    value={this.state.HRboardID}
                                    onChange={this.handleInputChange}
                                    required
                                    class="form-control col-md-2"  />
                            </div>
                            <p class="lead">
                                <input type="submit" class="btn btn-info" value="Get Historical Report"/>
                            </p>
                        </form>
                        <hr class="my-4"/>
                        {historicalReport}
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header">Station Rebalancing Report</div>
                    <div class="card-body">
                        <StationRebalancing />
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header">Missing Boards Report</div>
                    <div class="card-body">
                        <MissingBoards />
                    </div>
                </div>
            </div>
        );
    }
}
// <p class="lead">
//     <input type="submit" class="btn btn-success" value=""/>
// </p>
