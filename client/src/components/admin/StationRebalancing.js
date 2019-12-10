import React, { Component } from 'react';
import axios from 'axios'

export default class StationRebalancing extends Component {
    constructor(props){
        super(props)
        this.state = {
            rebalancing_data: [],
            message: '',
            alert: ''
        }
    }

    componentDidMount(){
        this.getReport(null)
    }

    getReport = (event) => {
        if(event){
            event.preventDefault();
        }
        axios.get('/api/v1/admin/station-rebalancing')
        .then(res => {
            console.log(res)
            if (res['data']['error']) {
                this.setState({
                    message: 'Err!',
                    alert: 'bad'
                })
                const error = new Error(res['data']['error']);
                throw error;
            } else {
                this.setState({
                    rebalancing_data: res['data']['rebalancing_data']
                })
            }
        })
        .catch(err => {
            console.error(err);
        });
    }

    submitReport = (event) => {
        event.preventDefault();
        axios.post('/api/v1/admin/load-data', {
            loadedData: this.state.rebalancing_data
        })
        .then(res => {
            console.log(res)
            if (res['data']['error']) {
                this.setState({
                    message: 'Err!',
                    alert: 'bad'
                })
                const error = new Error(res['data']['error']);
                throw error;
            } else {
                this.setState({
                    message: 'Rebalanced!',
                    alert: 'good'
                })
            }
        })
        .catch(err => {
            this.setState({
                message: 'Err!',
                alert: 'bad'
            })
            console.error(err);
        });
    }

    render() {
        let rebalancing_data = this.state.rebalancing_data.map((entry) => {
            return (
                <div>
                    <p>
                        <b>{`Board ${entry.board_id}`} </b>
                        is currently at
                        <b>{` Station ${entry.station_id}`} </b>, but
                        must move to
                        <b>{` Station ${entry.new_station_id}`} </b>
                    </p>
                </div>
            )
        })

        let confirm = null
        if(this.state.rebalancing_data.length !== 0){
            confirm = (
                <form onSubmit={this.submitReport}>
                    <p class="lead">
                        <input type="submit" class="btn btn-success" value="Confirm Changes"/>
                    </p>
                </form>
            )
        }

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
                { message }
                <form onSubmit={this.getReport}>
                    <p class="lead">
                        <input type="submit" class="btn btn-info" value="Update Station Rebalancing Report"/>
                    </p>
                </form>
                {rebalancing_data}
                {confirm}
            </div>
        )
    }
}
