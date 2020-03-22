import _ from 'lodash'
import React, { Component } from 'react'
import {Icon, Table, Label} from 'semantic-ui-react'
import axios from "axios";
import {Link} from "react-router-dom";

export default class Dashboard extends Component {
    state = {
        column: null,
        data: null,
        direction: null,
        token: null
    };
    componentDidMount(){
        let store = JSON.parse(localStorage.getItem('token'));
        let token = "Bearer " + store.token;
        axios.post('http://localhost:5000/api/groups',
            {
                headers: {
                    'authorization': token
                }
            })
            .then(res => {
                console.log(res);
                const group = res.data.results;
                this.setState({ data: group });
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    }
    handleSort = (clickedColumn) => () => {
        const { column, data, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: 'ascending',
            });

            return
        }

        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
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
        axios.post('http://localhost:5000/api/group/join',
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
                console.log(response.data.results.rows[0].count);
                if(response.data.results.rows[0].count == 0) {
                    axios.post('http://localhost:5000/api/group/join',
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
                            console.log(response);
                        })
                        .catch(function (err) {
                            console.log("Error", err)
                        });
                }else{
                    axios.post('http://localhost:5000/api/group/join',
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
                            console.log(response);
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
        const { column, data, direction } = this.state

        return (
            <div className="show-table">
            <Table celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Link to={'/addgroup'}>Add Group</Link>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell
                            sorted={column === 'id' ? direction : null}
                            onClick={this.handleSort('id')}
                        >
                            Id
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'gname' ? direction : null}
                            onClick={this.handleSort('gname')}
                        >
                            Group Name
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'description' ? direction : null}
                            onClick={this.handleSort('email')}
                        >
                             Description
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'created_by' ? direction : null}
                            onClick={this.handleSort('created_by')}
                        >
                            Created By
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            Joined?
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
                                    <Icon name='thumbs down outline' size='large' color='red'
                                          title='Please click to join'
                                          onClick={() => this.handleJoinGroup(group_id)}
                                    />
                                }
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            </div>
        )
    }
}
