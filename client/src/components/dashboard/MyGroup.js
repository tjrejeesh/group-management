import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Icon, Confirm } from 'semantic-ui-react'
import axios from "axios";
import {Link} from "react-router-dom";

export default class MyGroup extends Component {
    state = {
        column: null,
        data: null,
        direction: null,
        token: null,
        open: false
    };

    open = () => this.setState({ open: true });
    close = () => this.setState({ open: false });

    componentDidMount(){
        let store = JSON.parse(localStorage.getItem('token'));
        let loggedInUser = JSON.parse(localStorage.getItem('login'));
        let token = "Bearer " + store.token;
        axios.post('http://localhost:5000/api/mygroups',
            {
                headers: {
                    'authorization': token
                },
                values: {
                    userId: loggedInUser.id,
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



    render() {
        const { column, data, direction } = this.state

        return (
            <div className="show-table">
            <Confirm
                open={this.state.open}
                onCancel={this.close}
                onConfirm={this.close}
            />
            <Table celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='6'>
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
                        <Table.HeaderCell
                            sorted={column === 'created_at' ? direction : null}
                            onClick={this.handleSort('created_at')}
                        >
                            Created At
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            Actions
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ user_id, name, gname, description, created_by, created_at }, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{index}</Table.Cell>
                            <Table.Cell>{gname}</Table.Cell>
                            <Table.Cell>{description}</Table.Cell>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell>{created_at}</Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Icon name='eye' size='large'/>
                                <Icon name='edit' size='large'/>
                                <Icon name='delete' size='large' onClick={this.open} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            </div>
        )
    }
}
