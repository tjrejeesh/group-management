import _ from 'lodash';
import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

export default class Members extends Component {
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
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            </div>
        )
    }
}
