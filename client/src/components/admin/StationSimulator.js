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
            stationInventory: [],
            message: '',
            alert: '',
            randomDataLoaded: false
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
                this.getInventoryData()
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

    getInventoryData = () => {
        axios.get('/api/v1/admin/inventory')
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

    onLoadRandomData = (event) => {
        event.preventDefault();
        this.setState({
            message: "Loading...",
            alert: 'good'
        });
        axios.post('/api/v1/admin/load-data')
            .then(res => {
                this.getInventoryData()
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
                        message: "Random Data Loaded!",
                        alert: 'good',
                        randomDataLoaded: true
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

        const mappedStationsInventory = this.state.stationInventory.map((station) =>
                <tr class="table-info" key={station.station_id}>
                    <th scope="row">{station.station_id}</th>
                    <td>{station.count}</td>
                </tr>
        )

        let randomDataButton = null
        if(this.state.randomDataLoaded === false){
            randomDataButton = (
                <form onSubmit={this.onLoadRandomData}>
                    <input type="submit" value="Load Random Data" class="btn btn-success"/>
                </form>
            )
        }
        return (
            <div class="container-fluid mt-3 mb-3">
            { message }
                <div class="row">
                    <div class="col-lg-6">
                        <h1 class="display-5">Station Simulator</h1>
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
                                <input type="submit" value="Simulate Board Movement" class="btn btn-primary"/>
                            </fieldset>
                        </form>
                    </div>
                    <div class="col-lg-4 offset-lg-1">
                        <h1 class="display-5">Live Inventory</h1>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Station ID</th>
                                    <th scope="col">Count</th>
                                </tr>
                            </thead>
                            { mappedStationsInventory }
                        </table>
                        { randomDataButton }
                    </div>
                </div>
            </div>
        );
    }
}
