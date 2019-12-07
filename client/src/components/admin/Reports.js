import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'
import StationSimulator from './StationSimulator'

export default class Reports extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            alert: ''
        }
    }
    componentDidMount() {

    }

    generateReports = (event) => {
        event.preventDefault();
        axios.get('/api/v1/admin/generateReports')
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
                <h1 class="display-5">Reports</h1>
                { message }
                <form onSubmit={this.generateReports}>
                    <p class="lead">
                        <input type="submit" class="btn btn-success" value="Generate Reports"/>
                    </p>
                </form>
            </div>
        );
    }
}
