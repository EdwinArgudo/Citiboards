import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/admin/Login';
import Panel from './components/admin/Panel';
import LogOut from './components/admin/LogOut';
import withAdminAuth from './components/admin/withAdminAuth';

export default class AdminApp extends Component {

    render() {
        return (
            <BrowserRouter>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to={`${this.props.match.url}/panel`} exact><a class="navbar-brand" href="#">CitiBoard Admins</a></Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarColor01">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                        <Link to={`${this.props.match.url}/logout`}><a class="nav-link" href="#">Logout</a></Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <Switch>
                <Route path={`${this.props.match.path}/`} exact component={Login} />
                <Route path={`${this.props.match.path}/panel`} component={withAdminAuth(Panel)} />
                <Route path={`${this.props.match.path}/logout`} component={withAdminAuth(LogOut)} />
            </Switch>
            </BrowserRouter>
        );
    }
}
