import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import Home from './components/user/Home';
import Profile from './components/user/Profile';
import Login from './components/user/Login';
import Register from './components/user/Register';
import withAuth from './components/user/withAuth';
import LogOut from './components/user/LogOut';
import Nav from './components/user/Nav';
import AdminApp from './AdminApp';

export default class App extends Component {
    render() {
        const AuthProfile = withAuth(Profile)
        const AuthLogout = withAuth(LogOut)
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact>
                        <Nav />
                        <Home />
                    </Route>
                    <Route path="/login" component={Login} >
                        <Nav />
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Nav />
                        <Register />
                    </Route>
                    <Route path="/profile" >
                        <Nav />
                        < AuthProfile />
                    </Route>
                    <Route path="/logout">
                        <Nav/>
                        < AuthLogout />
                    </Route>
                    <Route path="/admin" component={AdminApp} />
                </Switch>
            </BrowserRouter>
        );
    }
}
