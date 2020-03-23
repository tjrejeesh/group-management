import _ from 'lodash'
import React, { Component } from 'react'
import {Table, Icon, Confirm, Message} from 'semantic-ui-react'
import axios from "axios";
import {Link} from "react-router-dom";
import AddGroup from "../groups/AddGroup";
import Members from "../groups/Members";
import {toast} from "react-toastify";


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
    notify = () => {
        toast.success('You have deleted the group', {
            position: toast.POSITION.TOP_CENTER
        });
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
                this.notify();
                setTimeout(function () {
                    window.location = '/mygroups';
                }, 2000);
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
                <Message className='page-title' visible content='Listing my groups' />
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
            <Table celled sortable fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5' textAlign='right'>
                            <Icon name='add' size='small' color='blue'/>
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
                                <Icon name='eye' color='green' size='large' onClick={
                                    () => this.viewGroup(group_id)
                                }/>
                                <Icon name='edit' color='blue' size='large' onClick={
                                    () => this.editGroup(group_id)
                                }/>
                                <Icon name='delete' size='large' color='red' onClick={()=> this.open(group_id)} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            </div>
        )
    }
}
