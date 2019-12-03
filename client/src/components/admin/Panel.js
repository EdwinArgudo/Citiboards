import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios'
import Reports from './Reports'
import StationSimulator from './StationSimulator'
import PeekDatabase from './PeekDatabase'
import withAdminAuth from './withAdminAuth';

export default class Panel extends Component {
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
            <BrowserRouter>
                <div class="jumbotron">
                    <h1 class="display-3">Control Panel</h1>
                    <div class="container mt-3">
                        <Link to={`${this.props.match.url}/reports`}><a class="nav-link" href="#">Reports</a></Link>
                        <Link to={`${this.props.match.url}/station-simulator`}><a class="nav-link" href="#">Station Simulator</a></Link>
                        <Link to={`${this.props.match.url}/peek-database`}><a class="nav-link" href="#">Peek at Database</a></Link>
                        <hr class="my-4"/>
                        <Switch>
                            <Route path={`${this.props.match.path}/reports`} component={withAdminAuth(Reports)} />
                            <Route path={`${this.props.match.path}/station-simulator`} component={withAdminAuth(StationSimulator)} />
                            <Route path={`${this.props.match.path}/peek-database`} component={withAdminAuth(PeekDatabase)} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
