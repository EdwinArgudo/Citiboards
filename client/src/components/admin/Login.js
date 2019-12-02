import React, { Component } from 'react'
import axios from 'axios'
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
      console.log(this.state)
      console.log(this.props)
      axios.post('/api/v1/admin/authenticate', {
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
     // if(this.state.redirect){
     //     return (
     //         <Redirect to="/profile">
     //     );
     // }
    return (
        <div class="jumbotron">
            <h1 class="display-3">Login</h1>
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
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      value={this.state.password}
                      onChange={this.handleInputChange}
                      required
                      class="form-control"  />
                </div>
                <input type="submit" value="Submit" class="btn btn-primary"/>
              </fieldset>
            </form>
          </div>
    );
    }
}
    // return (
    //     <form onSubmit={this.onSubmit}>
    //   <h1>Login Below!</h1>
    //   <input
    //     type="username"
    //     name="username"
    //     placeholder="Enter username"
    //     value={this.state.username}
    //     onChange={this.handleInputChange}
    //     required
    //   />
    //   <input
    //     type="password"
    //     name="password"
    //     placeholder="Enter password"
    //     value={this.state.password}
    //     onChange={this.handleInputChange}
    //     required
    //   />
    //  <input type="submit" value="Submit"/>
    // </form>);
//   }
// }
// <form onSubmit={this.onSubmit}>
//   <h1>Login Below!</h1>
//   <input
//     type="username"
//     name="username"
//     placeholder="Enter username"
//     value={this.state.username}
//     onChange={this.handleInputChange}
//     required
//   />
//   <input
//     type="password"
//     name="password"
//     placeholder="Enter password"
//     value={this.state.password}
//     onChange={this.handleInputChange}
//     required
//   />
//  <input type="submit" value="Submit"/>
// </form>
