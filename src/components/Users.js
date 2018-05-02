import React, { Component } from 'react';
import styled from 'styled-components';
import { usersCollection } from '../lib/firebase';

const ScrollWrapper = styled.div`
    height: 300px;
    overflow: scroll;
`

const UsersWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    width: 200px;
`;

const UserListItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    p {
        margin: 0;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
        text-align: left;
    }

    padding-bottom: 10px;
`;

const ColorAvatar = styled.div`
    background-color: ${props => props.color}
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 10px;
`;

const UserListItem = (props) => (
    <UserListItemWrapper>
        <ColorAvatar color={props.user.color} />
        <p>{props.user.name} {props.isMe ? '(you)' : null}</p>
    </UserListItemWrapper>
);

export class Users extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: []
        };
    }
    componentDidMount() {
        usersCollection.onSnapshot((snap) => {
            const users = [];

            snap.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id,
                });
            });

            this.setState({
                users: users
            })
        });
    }

    render() {
        return (
            <ScrollWrapper>
                <UsersWrapper>
                    { 
                        this.state.users.map((user) => (
                            <UserListItem key={user.id} user={user} isMe={this.props.user.id === user.id} />
                        )) 
                    }
                </UsersWrapper>
            </ScrollWrapper>
        );
    }
}