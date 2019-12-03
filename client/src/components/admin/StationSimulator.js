import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'

export default class StationSimulator extends Component {
    constructor() {
        super();
        this.state = {
            stationID: '' ,
            boardID: '',
            boardStatus: '',
            userID: '',
            message: '',
            alert: ''
            // ,
            // stations_table: [],
            // boards_table: [],
            // boards_stations_table:[]
        }
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/v1/admin/station-simulator', {
            stationID: this.state.stationID,
            boardID: this.state.boardID,
            boardStatus: this.state.boardStatus,
            userID: this.state.userID
        })
        .then(res => {
            if (res['data']['error']) {
                this.setState({
                    message: res['data']['error'],
                    alert: 'bad'
                });
                const error = new Error(res['data']['error']);
                throw error;
            } else {
                console.log("insertion worked!")
                this.setState({
                    stationID: '',
                    boardID: '',
                    boardStatus: '',
                    userID: '',
                    message: 'Update entered',
                    alert: 'good'
                });
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

    render() {
        let message = ""
        if(this.state.message !== ""){
            message = (
                 <div class={`alert alert-dismissible alert-${ this.state.alert === "good" ? "success" : "warning"}`}>
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <h4 class="alert-heading">{ this.state.alert === "good" ? "Success!" : "Error!"}</h4>
                    <p class="mb-0"> { this.state.message }</p>
                </div>
            )
        }
        return (
            <div class="container-fluid mt-3 mb-3">
                <h1 class="display-5">Station Simulator</h1>
                { message }
                <form onSubmit={this.onSubmit}>
                    <fieldset>
                        <b>UPDATE:</b>
                        <div class="form-group">
                            <label>Board</label>
                            <input
                            type="boardID"
                            class="form-control"
                            name="boardID"
                            placeholder="Enter BoardID"
                            value={this.state.boardID}
                            onChange={this.handleInputChange}
                            required />
                        </div>
                        <b>AT</b>
                        <div class="form-group">
                            <label>Station</label>
                            <input
                            type="stationID"
                            name="stationID"
                            placeholder="Enter StationID "
                            value={this.state.stationID}
                            onChange={this.handleInputChange}
                            class="form-control"  />
                        </div>
                        <b>WITH</b>
                        <div class="form-group">
                            <label>Board Status</label>
                            <input
                            type="boardStatus"
                            name="boardStatus"
                            placeholder="Enter Board Status ('in_use' or 'parked') "
                            value={this.state.boardStatus}
                            onChange={this.handleInputChange}
                            required
                            class="form-control"  />
                        </div>
                        <b>BY</b>
                        <div class="form-group">
                            <label>User</label>
                            <input
                            type="userID"
                            name="userID"
                            placeholder="Enter UserID "
                            value={this.state.userID}
                            onChange={this.handleInputChange}
                            required
                            class="form-control"  />
                        </div>
                        <input type="submit" value="Simulate Board" class="btn btn-primary"/>
                    </fieldset>
                </form>
            </div>
        );
    }
}
