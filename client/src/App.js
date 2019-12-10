import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import Home from './components/user/Home';
import UserHome from './components/user/UserHome';
import Login from './components/user/Login';
import Register from './components/user/Register';
import withAuth from './components/user/withAuth';
import LogOut from './components/user/LogOut';
import Nav from './components/user/Nav';
import AdminApp from './AdminApp';

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        <Nav />
                        <Home />
                    </Route>
                    <Route path="/login">
                        <Nav />
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Nav />
                        <Register />
                    </Route>
                    <Route path="/user-home" component={withAuth(UserHome)} />
                    <Route path="/admin" component={AdminApp} />
                </Switch>
            </BrowserRouter>
        );
    }
}
