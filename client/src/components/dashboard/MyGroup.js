import _ from 'lodash'
import React, { Component } from 'react'
import { Table, Icon, Confirm } from 'semantic-ui-react'
import axios from "axios";
import {Link} from "react-router-dom";
import AddGroup from "../groups/AddGroup";
import Members from "../groups/Members";


export default class MyGroup extends Component {
    state = {
        column: null,
        data: null,
        direction: null,
        token: null,
        open: false,
        groupId: '',
        editMode: false,
        viewMode: false,
        selectedGroup: {
            gname: null,
            description: null
        },
        groupMembers: null,
    };

    open = (groupId) => {
        this.setState({ open: true, groupId: groupId });
    };
    close = () => {
        this.setState({ open: false, groupId: '' });
    };
    closeEdit = () => {
        this.setState({ editMode: false });
    };
    confirmView = () => {
        this.setState({ viewMode: false });
    };
    deleteGroup = () => {
        let store = JSON.parse(localStorage.getItem('token'));
        let token = "Bearer " + store.token;
        axios.post('http://localhost:5000/api/group/delete',
            {
                headers: {
                    'authorization': token
                },
                values: {
                    groupId: this.state.groupId,
                }
            })
            .then(res => {
                window.location = '/mygroups';
            })
            .catch(function (err) {
                console.log("Error", err)
            });
        this.setState({ open: false, groupId: '' });
    };

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

    editGroup = (group_id) => {
        this.setState({ editMode: true, groupId: group_id});
        /*let store = JSON.parse(localStorage.getItem('token'));
        let token = "Bearer " + store.token;
        axios.post('http://localhost:5000/api/group/edit',
            {
                headers: {
                    'authorization': token
                },
                values: {
                    group_id: group_id,
                }
            })
            .then(res => {
                this.setState({ selectedGroup: res.data.results[0] });
            })
            .catch(function (err) {
                console.log("Error", err)
            });*/
    };

    viewGroup = (group_id) => {
        this.setState({ viewMode: true});
        let store = JSON.parse(localStorage.getItem('token'));
        let token = "Bearer " + store.token;
        axios.post('http://localhost:5000/api/group/list',
            {
                headers: {
                    'authorization': token
                },
                values: {
                    group_id: group_id,
                }
            })
            .then(res => {
                this.setState({ groupMembers: res.data.results});
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    };

    renderAddGroup(groupId){
        return (
            <div className="show-table"><AddGroup groupId={groupId}/></div>
        );
    };

    renderViewGroup(){
        return (
            <div className="show-table"><Members groupMembers={this.state.groupMembers}/></div>
        );
    }

    render() {
        const { column, data, direction } = this.state;

        return (
            <div className="show-table">
            <Confirm
                open={this.state.open}
                onCancel={this.close}
                onConfirm={this.deleteGroup}
                content="Do you want to delete the group?"
                confirmButton="Delete"
                cancelButton="Cancel"
            />
            <Confirm
                className="update-modal"
                header={`Update the selected group`}
                open={this.state.editMode}
                onCancel={this.closeEdit}
                content={this.renderAddGroup(this.state.groupId)}
                cancelButton="Cancel"
            />
            <Confirm
                className="view-members-modal"
                header={'Members in the group'}
                open={this.state.viewMode}
                onConfirm={this.confirmView}
                content={this.renderViewGroup()}
                confirmButton="Close"
            />
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
                            Actions
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ user_id, name, gname, description, created_by, created_at, group_id }, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{gname}</Table.Cell>
                            <Table.Cell>{description}</Table.Cell>
                            <Table.Cell>{name}</Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Icon name='eye' size='large' onClick={
                                    () => this.viewGroup(group_id)
                                }/>
                                <Icon name='edit' size='large' onClick={
                                    () => this.editGroup(group_id)
                                }/>
                                <Icon name='delete' size='large' onClick={()=> this.open(group_id)} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            </div>
        )
    }
}
