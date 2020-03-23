import _ from 'lodash';
import React, { Component } from 'react'
import {Icon, Table} from 'semantic-ui-react'
import axios from "axios";
import {toast} from "react-toastify";
import {endPoint} from "../common/api";

export default class Members extends Component {
    notify = () => {
        toast.success('You have removed the member from your group', {
            position: toast.POSITION.TOP_CENTER
        });
    };
    deleteMember(member_id, group_id){
        let store = JSON.parse(localStorage.getItem('token'));
        let token = "Bearer " + store.token;
        axios.post(endPoint('/api/group/join'),
            {
                headers: {
                    'authorization': token
                },
                values: {
                    group_id: group_id,
                    user_id: member_id,
                    action: 'delete'
                }
            })
            .then(response => {
                this.notify();
                setTimeout(function () {
                    window.location = '/mygroups';
                }, 2000);
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    };

    render() {
        const {groupMembers} = this.props;

        return (
            <div className="show-members">
            <Table celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell
                        >
                            Id
                        </Table.HeaderCell>
                        <Table.HeaderCell
                        >
                            Name
                        </Table.HeaderCell>
                        <Table.HeaderCell
                        >
                            Email
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'
                        >
                            Delete
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(groupMembers, ({
                        group_id,
                        member_id,
                        name,
                        email
                     }, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell>{email}</Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Icon name='delete' size='large'
                                      color='red'
                                      onClick={()=> this.deleteMember(member_id, group_id)} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            </div>
        )
    }
}
