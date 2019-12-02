import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom';

export default class Nav extends Component {

    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link to="/"><a class="navbar-brand" href="#">CitiBoard</a></Link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarColor01">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                        <Link to="/"><a class="nav-link" href="#">Home<span class="sr-only">(current)</span></a></Link>
                        </li>
                        <li class="nav-item">
                        <Link to="/login"><a class="nav-link" href="#">Login</a></Link>
                        </li>
                        <li class="nav-item">
                        <Link to="/register"><a class="nav-link" href="#">Register</a></Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
