import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import axios from 'axios'

export default class LogOut extends Component {
    constructor() {
        super();
        this.state = {
            loggedOut: false
        }
    }
    componentDidMount() {
        axios.get('/api/v1/user/logout')
    }
    render() {
        return (<Redirect to="/login" />);
    }
}
