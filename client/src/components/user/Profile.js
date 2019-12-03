import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            payment_info: ''
        }
    }
    componentDidMount() {
        axios.get('/api/v1/user/profile')
        .then(res => {
            const data = res['data']
            this.setState({
                username: data.username,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                phone_number: data.phone_number,
                credit_card: data.credit_card
            })
        })
        .catch(e => console.log(e))
    }
    render() {
        return (
            <div class="jumbotron">
                <h1 class="display-3">User Profile</h1>
                    <div class="form-group">
                    <fieldset>
                        <label class="control-label" for="readOnlyInput">Username</label>
                        <input class="form-control" type="text" placeholder={this.state.username} readonly="" />
                    </fieldset>
                    <fieldset>
                        <label class="control-label" for="readOnlyInput">Email</label>
                        <input class="form-control" type="text" placeholder={this.state.email} readonly="" />
                    </fieldset>
                    <fieldset>
                        <label class="control-label" for="readOnlyInput">First Name</label>
                        <input class="form-control" type="text" placeholder={this.state.first_name} readonly="" />
                    </fieldset>
                    <fieldset>
                        <label class="control-label" for="readOnlyInput">Last Name</label>
                        <input class="form-control" type="text" placeholder={this.state.last_name} readonly="" />
                    </fieldset>
                    <fieldset>
                        <label class="control-label" for="readOnlyInput">Phone Number</label>
                        <input class="form-control" type="text" placeholder={this.state.phone_number} readonly="" />
                    </fieldset>
                    <fieldset>
                        <label class="control-label" for="readOnlyInput">Payment Info</label>
                        <input class="form-control" type="text" placeholder={this.state.credit_card} readonly="" />
                    </fieldset>
                </div>
                <p class="lead">
                    <Link to="/logout"><a class="btn btn-primary btn-lg" href="#" role="button">Log Out</a></Link>
                </p>
            </div>
        );
    }
}
