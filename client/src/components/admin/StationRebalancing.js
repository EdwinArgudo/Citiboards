import React, { Component } from 'react';
import axios from 'axios'

export default class StationRebalancing extends Component {
    constructor(props){
        super(props)
        this.state = {
            rebalancing_data: []
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
        return (
            <div class="container-fluid mt-3 mb-3">
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
