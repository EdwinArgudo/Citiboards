import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './css/one-page-wonder.css';
import { Link } from 'react-router-dom';
import NavBar from './Nav';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn} from 'mdbreact';


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
        return (
            <div className="bg3">
                <NavBar/>
                <br/><br/>
                <center>
                <MDBContainer>
                    <MDBRow>
                    <MDBCol>
                            <MDBCol md="6">
                            <MDBCard >
                                <div className="header pt-3 peach-gradient">
                                <MDBRow className="d-flex justify-content-center">
                                    <h3 className="white-text mb-2 pt-2 font-weight-bold">
                                    Register
                                    </h3>
                                </MDBRow>
                                </div>
                                <MDBCardBody className="mx-4 mt-4">
                                    <MDBInput 
                                        label="First Name"                                      
                                        group 
                                        type="text" 
                                        validate        
                                        containerClass="mb-0"
                                        value={this.state.first_name}
                                        onChange={this.handleInputChange}
                                    />
                                    <MDBInput 
                                        label="Last Name" 
                                        group 
                                        type="text" 
                                        validate 
                                        containerClass="mb-0"
                                        value={this.state.last_name}
                                        onChange={this.handleInputChange}
                                    />
                                    <MDBInput
                                        label="Username"
                                        group 
                                        type="text"
                                        validate
                                        containerClass="mb-0"
                                        value={this.state.username}
                                        onChange={this.handleInputChange}
                                    />
                                    <MDBInput 
                                        label="Email" 
                                        group 
                                        type="email" 
                                        validate 
                                        value={this.state.email}
                                        onChange={this.handleInputChange}
                                    />
                                    
                                    <MDBInput
                                        label="Password"
                                        group 
                                        type="text"
                                        validate
                                        containerClass="mb-0"
                                        value={this.state.password}
                                        onChange={this.handleInputChange}
                                    />
                                    <MDBInput
                                        label="Phone Number"
                                        group 
                                        type="text"
                                        validate
                                        containerClass="mb-0"
                                        value={this.state.phone_number}
                                        onChange={this.handleInputChange}
                                    />
                                    <MDBInput
                                        label="Credit Card"
                                        group type="text"
                                        validate
                                        containerClass="mb-0"
                                        value={this.state.credit_card}
                                        onChange={this.handleInputChange}
                                    />
                                <MDBRow className="d-flex align-items-center mb-0 mt-0">
                                    <MDBCol md="5" className="d-flex align-items-start">
                                    <div className="text-center">
                                        <MDBBtn
                                        color="orange"
                                        rounded
                                        type="button"
                                        className="z-depth-1a"
                                        onClick={this.onSubmit}
                                        >
                                        Sign Up!
                                        </MDBBtn>
                                    </div>
    
                                    </MDBCol>
                                    <MDBCol md="7" className="d-flex justify-content-end">
                                    <div className="font-small grey-text mt-3">
                                    Have an account? 
                                    <Link className="nav-link" to="/register">Login</Link>
                                    </div>
                                    </MDBCol>
                                </MDBRow>
                                </MDBCardBody>
                            </MDBCard>
                            </MDBCol>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                </center>
            </div>
        
        );
    }
}
