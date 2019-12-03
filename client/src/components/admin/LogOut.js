import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import axios from 'axios'

export default class LogOut extends Component {
    componentDidMount() {
        axios.get('/api/v1/admin/logout')
    }
    render() {
        return (<Redirect to="/admin" />);
    }
}
