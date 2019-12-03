import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/admin/Login';
import Panel from './components/admin/Panel';
import LogOut from './components/user/LogOut';
import withAdminAuth from './components/admin/withAdminAuth';

export default class AdminApp extends Component {

    render() {
        return (
            <BrowserRouter>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to={`${this.props.match.url}`} exact><a class="navbar-brand" href="#">CitiBoard Admins</a></Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </nav>
            <div class="container mt-3">
                <Switch>
                    <Route path="/admin" component={Login} />
                    <Route path="/panel" component={withAdminAuth(Panel)} />
                    <Route path="/logout" component={withAdminAuth(LogOut)} />
                </Switch>
            </div>

            </BrowserRouter>
        );
    }
}
