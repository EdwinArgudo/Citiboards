import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'

export default class Profile extends Component {
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
            <div class="jumbotron">
                <h1 class="display-3">Control Panel</h1>
                <p class="lead">
                    <Link to="/logout"><a class="btn btn-primary btn-lg" href="#" role="button">Log Out</a></Link>
                </p>
            </div>
        );
    }
}
