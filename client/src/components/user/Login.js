import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn } from 'mdbreact';
import { Link } from 'react-router-dom';


export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : '',
      password: '',
      redirect: false
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
      axios.post('/api/v1/user/authenticate', {
          username: this.state.username,
          password: this.state.password
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
        alert(err.message);
      });
    }
    render() {

      return (

          <div className="bg">
              <br/><br/>
              <br/><br/>
              <center>
              <MDBContainer>
                  <MDBRow>
                  <MDBCol>
                      <MDBCol md="6">
                          <MDBCard>
                              <div className="header pt-3 peach-gradient">
                              <MDBRow className="d-flex justify-content-center">
                                  <h3 className="white-text mb-3 pt-3 font-weight-bold">
                                  Log in
                                  </h3>
                              </MDBRow>
                              </div>
                              <MDBCardBody className="mx-4 mt-4">
                              <MDBInput 
                                  label="Username" 
                                  group 
                                  type="text" 
                                  validate 
                                  value={this.state.username}
                                  onChange={this.handleInputChange}
                              />
                              <MDBInput
                                  label="Your password"
                                  group
                                  type="text"
                                  validate
                                  containerClass="mb-0"
                                  value={this.state.password}
                                  onChange={this.handleInputChange}
                              />
                              <MDBRow className="d-flex align-items-center mb-4 mt-5">
                                  <MDBCol md="5" className="d-flex align-items-start">
                                  <div className="text-center">
                                      <MDBBtn
                                      color="orange"
                                      rounded
                                      type="button"
                                      className="z-depth-1a"
                                      onClick={this.onSubmit}
                                      >
                                          Log in
                                      </MDBBtn>
                                  
                                  </div>

                                  </MDBCol>
                                  <MDBCol md="7" className="d-flex justify-content-end">
                                  <p className="font-small grey-text mt-3">
                                      Don't have an account?
                                      <Link className="nav-link" to="/register">Register</Link>
                                  </p>
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
