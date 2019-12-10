import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'
import STATIONS from '../../JSON/stations.json';

export default class Actions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stationInventory: [],
            message: '',
            alert: '',
            userHasBoard: null,
            boardInfo: null,
            stationID: null
        }
    }

    handleInputChange = (event) => {
      const { value, name } = event.target;
      this.setState({
        [name]: value
      });
    }

    getInventoryData = () => {
        axios.get('/api/v1/user/inventory')
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
                    stationInventory: res['data']['stations_data']
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

    userHasBoard = () => {
        axios.get('/api/v1/user/has-board')
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
                    userHasBoard: res['data']['has_board'],
                    boardInfo: res['data']['board_info'],
                    message: 'User Data Loaded!',
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

    parkBoard = (event) => {
        event.preventDefault()
        axios.post('/api/v1/user/action', {
            stationID: this.state.stationID,
            boardID: this.state.boardInfo.board_id,
            boardStatus: "parked"
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
                this.userHasBoard()
                this.getInventoryData()
                this.setState({
                    stationID: '',
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

    checkOutBoard = (event) => {
        event.preventDefault()
        axios.post('/api/v1/user/action', {
            stationID: this.state.stationID,
            boardStatus: "in_use"
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
                this.userHasBoard()
                this.getInventoryData()
                this.setState({
                    stationID: '',
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

    componentDidMount(){
        this.getInventoryData()
        this.userHasBoard()
    }

    render() {
        const mappedStationsInventory = this.state.stationInventory.map((station) =>
                <tr class="table-info" key={station.station_id}>
                    <th scope="row">{station.station_id}</th>
                    <td>{STATIONS[station.station_id - 1]['site']}</td>
                    <td>{station.count}</td>
                </tr>
        )

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

        let action = null
        if(this.state.userHasBoard !== null){
            if(this.state.userHasBoard === true){
                action = (
                    <div>
                            <h1 class="display-5">Park Your Board?</h1>
                            <table class="table table-hover">
                                <tr class="table-info" key={this.state.boardInfo.board_id}>
                                    <th scope="row">Board Taken Out At</th>
                                    <td>{STATIONS[this.state.boardInfo.station_id - 1]['site']}</td>
                                    <td>{this.state.boardInfo.last_transaction_date}</td>
                                    <td>{this.state.boardInfo.last_transaction_time}</td>
                                </tr>
                            </table>
                            <form onSubmit={this.parkBoard}>
                                <div class="form-group">
                                    <input
                                        name="stationID"
                                        placeholder="Enter Station ID"
                                        value={this.state.stationID}
                                        onChange={this.handleInputChange}
                                        required
                                        class="form-control col-md-4"  />
                                </div>
                                <p class="lead">
                                    <input type="submit" class="btn btn-info" value="Park Board"/>
                                </p>
                            </form>
                    </div>
                )
            } else {
                action = (
                    <div>
                        <h1 class="display-5">Check Out A Board?</h1>
                        <form onSubmit={this.checkOutBoard}>
                            <div class="form-group">
                                <input
                                    name="stationID"
                                    placeholder="Enter Station ID"
                                    value={this.state.stationID}
                                    onChange={this.handleInputChange}
                                    required
                                    class="form-control col-md-4"  />
                            </div>
                            <p class="lead">
                                <input type="submit" class="btn btn-info" value="Check Out Board"/>
                            </p>
                        </form>
                    </div>
                );
            }
        }

        return (
            <div class="container-fluid mt-3 mb-3">
                { message }
                <div class="row">
                    <div class="col-lg-6">
                        {action}
                    </div>
                    <div class="col-lg-4 offset-lg-1">
                        <h1 class="display-5">Live Inventory</h1>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Station ID</th>
                                    <th scope="col">Site</th>
                                    <th scope="col">Count</th>
                                </tr>
                            </thead>
                            { mappedStationsInventory }
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
