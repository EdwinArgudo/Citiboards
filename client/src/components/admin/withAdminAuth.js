import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios'

export default function withAuth(ComponentToProtect) {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                redirect: false
            };
        }

        componentDidMount(){
            axios.get('/api/v1/admin/checkSession')
            .catch(err => {
                console.error(err);
                this.setState({ redirect: true });
            });
        }

        render() {
            if (this.state.redirect) {
                return <Redirect to="/login" />;
            }
            return <ComponentToProtect {...this.props} />;
        }
    }
}
