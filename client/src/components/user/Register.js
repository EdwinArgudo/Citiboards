import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

export default class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username : '',
            password: '',
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            credit_card: ''
        };
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }
    onSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/v1/user/register', {
            username : this.state.username,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            phone_number: this.state.phone_number,
            credit_card: this.state.credit_card
        })
        .then(res => {
            if (res['data']['error']) {
                const error = new Error(res['data']['error']);
                throw error;
            } else {
                this.setState({ redirect: true })
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error registering please try again');
        });
    }
    render() {
        if(this.state.redirect){
            return ( <Redirect to="/user-home"/> );
        }
        return (
            <div class="jumbotron">
                <h1 class="display-3">Register</h1>
                <form onSubmit={this.onSubmit}>
                    <fieldset>
                        <div class="form-group">
                            <label>Email address</label>
                            <input type="username"
                            class="form-control"
                            name="username"
                            placeholder="Enter Username"
                            value={this.state.username}
                            onChange={this.handleInputChange}
                            required />
                            <small class="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input
                            type="password"
                            class="form-control"
                            name="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            required
                            class="form-control"  />
                        </div>
                        <div class="form-group">
                            <label>First Name</label>
                            <input
                            type="first_name"
                            class="form-control"
                            name="first_name"
                            placeholder="Enter First Name"
                            value={this.state.first_name}
                            onChange={this.handleInputChange}
                            required />
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <input
                            type="last_name"
                            name="last_name"
                            class="form-control"
                            placeholder="Enter Last Name"
                            value={this.state.last_name}
                            onChange={this.handleInputChange}
                            required  />
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input
                            type="email"
                            name="email"
                            class="form-control"
                            placeholder="Enter Email"
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            required  />
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input
                            type="phone_number"
                            name="phone_number"
                            class="form-control"
                            placeholder="Enter Phone Number"
                            value={this.state.phone_number}
                            onChange={this.handleInputChange}
                            required />
                        </div>
                        <div class="form-group">
                            <label>Credit Card</label>
                            <input
                            type="credit_card"
                            name="credit_card"
                            class="form-control"
                            placeholder="Enter Credit Card"
                            value={this.state.credit_card}
                            onChange={this.handleInputChange}
                            required />
                        </div>
                        <input type="submit" value="Submit" class="btn btn-primary"/>
                    </fieldset>
                </form>
            </div>
        );
    }
}
