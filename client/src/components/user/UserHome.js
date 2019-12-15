import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import Profile from './Profile'
import Actions from './Actions'
import LogOut from './LogOut'
import withAuth from './withAuth';

export default class UserHome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                    <Link to={`${this.props.match.url}/`} exact><a class="navbar-brand" href="#">CitiBoard</a></Link>
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
                <div class="jumbotron">
                    <h1 class="display-3">User Home</h1>
                    <div class="container mt-3">
                        <Link to={`${this.props.match.url}/`}><a class="nav-link" href="#">Actions</a></Link>
                        <Link to={`${this.props.match.url}/profile`}><a class="nav-link" href="#">Profile</a></Link>
                        <hr class="my-4"/>
                        <Switch>
                            <Route path={`${this.props.match.path}/`} exact component={withAuth(Actions)} />
                            <Route path={`${this.props.match.path}/profile`} component={withAuth(Profile)} />
                            <Route path={`${this.props.match.path}/logout`} component={withAuth(LogOut)} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
