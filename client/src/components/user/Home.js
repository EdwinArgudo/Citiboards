import React, { Component } from 'react'
import axios from 'axios'
import './css/one-page-wonder.css';
import './css/page.css';

export default class Home extends Component {

    render() {
    
        return (
            <div className="App">
              <header className="masthead text-center text-white">
                <div className="masthead-content">
                </div>

                <div className="masthead-content">
                    <div className="container">
                        <h2 className="masthead-heading text-white">Citiboard</h2>
                    </div>
                </div>
    
                <div className="bg-circle-1 bg-circle"></div>
                <div className="bg-circle-2 bg-circle"></div>
                <div className="bg-circle-3 bg-circle"></div>
                <div className="bg-circle-4 bg-circle"></div>
              </header>
    
            <section>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="p-5">
                      <img className="img-fluid rounded-circle" src={require("./img/skate1.jpg")} alt="" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <h2 className="display-4">Move Quick!</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    
            <section>
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6 order-lg-2">
                    <div className="p-5">
                        <img className="img-fluid rounded-circle" src={require("./img/skate2.jpg")} alt=""/>
                        </div>
                  </div>
                  <div className="col-lg-6 order-lg-1">
                    <div className="p-5">
                      <h2 className="display-4">Skating</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea!</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    
            <footer className="py-5 bg-black">
              <div className="container">
                <p className="m-0 text-center text-white small"><a className="nav-link" href="https://github.com/EdwinArgudo/Citiboards">Contact The Team</a></p>
              </div>
            </footer>
    
            <script src="../vendor/jquery/jquery.min.js"></script>
            <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
          </div>
        );
    }
}
