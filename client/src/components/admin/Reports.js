import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'
import StationSimulator from './StationSimulator'

export default class Reports extends Component {
    constructor() {
        super();
        // this.state = {
        //     username: '',
        //     email: '',
        //     first_name: '',
        //     last_name: '',
        //     phone_number: '',
        //     payment_info: ''
        // }
    }
    componentDidMount() {
        // axios.get('/api/v1/user/profile')
        // .then(res => {
        //     console.log(res, "***")
        //     return res
        // })
        // .then(res => {
        //     const data = res['data']
        //     this.setState({
        //         username: data.username,
        //         email: data.email,
        //         first_name: data.first_name,
        //         last_name: data.last_name,
        //         phone_number: data.phone_number,
        //         credit_card: data.credit_card
        //     })
        // })
        // .catch(e => console.log(e))
    }
    render() {
        return (
            <div class="container-fluid mt-3 mb-3">
                <h1 class="display-5">Reports</h1>
                <p class="lead">

                </p>
            </div>
        );
    }
}
