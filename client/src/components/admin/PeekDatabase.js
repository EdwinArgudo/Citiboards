import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'

export default class PeekDatabase extends Component {
    constructor() {
        super();
        this.state = {
            usersData: [],
            stationsData: [],
            boardsData:[],
            message: '',
            alert: ''
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
        this.getData();
    }

    getData = () => {
        axios.get('/api/v1/admin/peek-database')
        .then(res => {
            if (res['data']['error']) {
                this.setState({
                    message: res['data']['error'],
                    alert: 'bad'
                });
                const error = new Error(res['data']['error']);
                throw error;
            } else {
                console.log("refresh worked!")
                console.log(res['data'])
                this.setState({
                    usersData: res['data']['users_data'],
                    stationsData: res['data']['stations_data'],
                    boardsData: res['data']['boards_data'],
                    message: 'Update entered',
                    alert: 'good'
                });
            }
        })
        .catch(err => {
            console.error(err);
            this.setState({
                message: err.message,
                alert: 'bad'
            });
        });
    }

    componentDidMount(){
        this.getData();
    }

    render() {

        const mappedUsersData = this.state.usersData.map((row) =>
            <tr class="table-info" key={row.user_id}>
                <th scope="row">{row.user_id}</th>
                <td>{row.first_name}</td>
                <td>{row.last_name}</td>
                <td>{row.email}</td>
                <td>{row.phone_number}</td>
                <td>{row.credit_card}</td>
            </tr>
        );

        const mappedStationsData = this.state.stationsData.map((row) =>
            <tr class="table-info" key={row.station_id}>
                <th scope="row">{row.station_id}</th>
                <td>{row.location}</td>
                <td>{row.capacity}</td>
            </tr>
        );

        const mappedBoardsData = this.state.boardsData.map((row) =>
        <tr class="table-info" key={row.board_id}>
            <th scope="row">{row.board_id}</th>
            <td>{row.station_id}</td>
            <td>{row.user_id}</td>
            <td>{row.board_status}</td>
            <td>{row.last_transaction_time}</td>
        </tr>
        );

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
                        <input type="submit" value="Refresh Data" class="btn btn-success"/>
                    </fieldset>
                    <div>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">User ID</th>
                                    <th scope="col">First Name</th>
                                    <th scope="col">Last Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Credit Card</th>
                                </tr>
                            </thead>
                            { mappedUsersData }
                        </table>
                    </div>
                    <div>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Station ID</th>
                                    <th scope="col">location</th>
                                    <th scope="col">Capacity</th>
                                </tr>
                            </thead>
                            { mappedStationsData }
                        </table>
                    </div>
                    <div>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">Board ID</th>
                                    <th scope="col">Station ID</th>
                                    <th scope="col">User ID</th>
                                    <th scope="col">Board Status</th>
                                    <th scope="col">Last Transaction Time</th>
                                </tr>
                            </thead>
                            { mappedBoardsData }
                        </table>
                    </div>
                </form>


            </div>
        );
    }
}
