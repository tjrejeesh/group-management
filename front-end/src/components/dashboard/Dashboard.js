import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Button, Icon } from 'semantic-ui-react'
import axios from "axios";

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
        axios.post('http://localhost:5000/api/users',
            {
                headers: {
                    'authorization': token
                }
            })
            .then(res => {
                console.log(res)
                const users = res.data.results;
                this.setState({ data: users });
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
    }

    render() {
        const { column, data, direction } = this.state

        return (
            <div className="show-table">
            <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='3'>
                            <Button
                                floated='right'
                                icon
                                labelPosition='left'
                                primary
                                size='small'
                            >
                                <Icon name='user' /> Add User
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell
                            sorted={column === 'id' ? direction : null}
                            onClick={this.handleSort('id')}
                        >
                            Name
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'name' ? direction : null}
                            onClick={this.handleSort('name')}
                        >
                            Age
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            sorted={column === 'email' ? direction : null}
                            onClick={this.handleSort('email')}
                        >
                            Gender
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ id, name, email }) => (
                        <Table.Row key={name}>
                            <Table.Cell>{id}</Table.Cell>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell>{email}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            </div>
        )
    }
}
