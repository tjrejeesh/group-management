import _ from 'lodash'
import React, { Component } from 'react'
import {Icon, Table, Label, Message} from 'semantic-ui-react'
import axios from "axios";
import {toast} from "react-toastify";
import {endPoint} from "../common/api";

export default class Membership extends Component {
    state = {
        column: null,
        data: null,
        direction: null,
        token: null
    };
    componentDidMount(){
        let store = JSON.parse(localStorage.getItem('token'));
        const loggedInUser = JSON.parse(localStorage.getItem('login'));
        const userId = loggedInUser.id;
        let token = "Bearer " + store.token;
        axios.post(endPoint('/api/group/membership'),
            {
                headers: {
                    'authorization': token
                },
                values: {
                    user_id: userId,
                }
            })
            .then(res => {
                const group = res.data.results;
                this.setState({ data: group });
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    }

    notify = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_CENTER
        });
    };

    handleJoinStatus = (memberId) =>{
        const loggedInUser = JSON.parse(localStorage.getItem('login'));
        const userId = loggedInUser.id;
        /* eslint eqeqeq: 0 */
        if(userId == memberId){
            return true;
        }
    };

    handleJoinGroup = (group_id) => {
        let store = JSON.parse(localStorage.getItem('token'));
        const loggedInUser = JSON.parse(localStorage.getItem('login'));
        const userId = loggedInUser.id;
        let token = "Bearer " + store.token;
        axios.post(endPoint('/api/group/join'),
            {
                headers: {
                    'authorization': token
                },
                values: {
                    user_id: userId,
                    group_id: group_id,
                    action: 'select'
                }
            })
            .then(response => {
                if(response.data.results.rows[0].count == 0) {
                    axios.post(endPoint('/api/group/join'),
                        {
                            headers: {
                                'authorization': token
                            },
                            values: {
                                user_id: userId,
                                group_id: group_id,
                                action: 'insert'
                            }
                        })
                        .then(response => {
                        })
                        .catch(function (err) {
                            console.log("Error", err)
                        });
                }else{
                    axios.post(endPoint('/api/group/join'),
                        {
                            headers: {
                                'authorization': token
                            },
                            values: {
                                user_id: userId,
                                group_id: group_id,
                                action: 'delete'
                            }
                        })
                        .then(response => {
                            this.notify('You have successfully ' +
                                'unsubscribed from the group');
                            setTimeout(function () {
                                window.location = '/home';
                            }, 2000);
                        })
                        .catch(function (err) {
                            console.log("Error", err)
                        });
                }
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    };

    render() {
        const { data } = this.state;

        return (
            <div className="show-table">
                <Message className='page-title' visible content='Listing my membership' />
                <Table celled fixed>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                            >
                                Id
                            </Table.HeaderCell>
                            <Table.HeaderCell
                            >
                                Group Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                            >
                                Description
                            </Table.HeaderCell>
                            <Table.HeaderCell
                            >
                                Created By
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>
                                Unsubscribe ?
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {_.map(data, ({ user_id, name, gname, description, member_id, created_by, created_at, group_id }, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{gname}</Table.Cell>
                                <Table.Cell>{description}</Table.Cell>
                                <Table.Cell>
                                    {this.handleJoinStatus(member_id) ? <Label ribbon color='green'>Me</Label> : name}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    {this.handleJoinStatus(member_id) ?
                                        <label>Admin</label>
                                        :
                                        <Icon name='thumbs up outline' size='large' color='green'
                                              title='Please click here to unsubscribe'
                                              onClick={() => this.handleJoinGroup(group_id)}
                                        />
                                    }
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                <Message className='page-title' color='blue'><Icon name='info circle' size='large'/>
                    Information :  Click on the thumb icon to unsubscribe group.
                </Message>
            </div>
        )
    }
}
