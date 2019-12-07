import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';

export default class Nav extends Component {

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
                <div className="container">
                <Link className="navbar-brand" to="/">Citiboard</Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" 
                aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    
                        <Link className="nav-link" to="/login">Login</Link>

                    </li>
                    <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>  
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
        );
    }
}
