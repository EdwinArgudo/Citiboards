import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/admin/Login';

export default class AdminApp extends Component {

    render() {
        console.log(this.props.match)
        return (
            <BrowserRouter>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to={`${this.props.match.url}/admin`} exact><a class="navbar-brand" href="#">CitiBoard Admins</a></Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </nav>
            <div class="container mt-3">
                <Switch>
                    <Route path="/admin" component={Login} />
                </Switch>
            </div>

            </BrowserRouter>
        );
    }
}
