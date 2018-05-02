import React, { Component } from 'react';
import styled from 'styled-components';

import { login } from '../lib/firebase';
import { Loader } from './loader';

const AuthWrapper = styled.div`
    display: flex;
    flex-direction: column;

    input {
        padding: 0 4px;
        margin-bottom: 4px;
        width: 200px;
    }

    input, button {
        height: 22px;
    }
`;

export class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            isLoading: false,
        }
    }

    onNameChange = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value,
        });
    }

    onSubmit = () => {
        this.setState({
            ...this.state,
            isLoading: true,
        })

        login(this.state.name)
            .then((user) => this.props.onLogin(user))
    }

    isButtonDisabled = () => {
        return this.state.name.length === 0 || this.state.isLoading;
    }

    render() {
        return (
            <AuthWrapper>
                <h3>Login</h3>
                <input placeholder="nickname" value={this.state.name} onChange={this.onNameChange} />
                { !this.state.isLoading &&
                    <button disabled={this.isButtonDisabled()} onClick={this.onSubmit}>
                        Login
                    </button>
                }
                { this.state.isLoading && <Loader /> }
            </AuthWrapper>
        )
    }
}