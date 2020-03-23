import _ from 'lodash'
import React, { Component } from 'react'
import {Icon, Table, Label, Search} from 'semantic-ui-react'
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Message } from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '' }

export default class Dashboard extends Component {
    state = {
        column: null,
        data: null,
        direction: null,
        token: null,
        ...initialState
    };
    notify = (message) => {
        if(message === 'subscribe') {
            toast.success('You are a member in this group now', {
                position: toast.POSITION.TOP_CENTER
            });
        }else{
            toast.warn('You are no longer a member in this group now! ' +
                'However, still you can click and join the thumb.', {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };
    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })
        setTimeout(() => {
            if (this.state.value.length < 1) {
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
            const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
            const isMatch = (result) => re.test(result.gname);
            this.setState({
                isLoading: false,
                data: _.filter(this.state.data, isMatch),
            });
            console.log(this.state);
        }, 300);
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

    checkMembership(group_id){
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
                if(response.data.results.rows[0].count > 0){
                    console.log('member', group_id);
                }else{
                    console.log('Non member', group_id);
                }
            })
            .catch(function (err) {
                console.log("Error", err)
            });
        return false;
    }

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
                    this.notify('subscribe');
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
                    this.notify('unsubscribe');
                }
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    };

    render() {
        const { column, data, direction, isLoading, value } = this.state;

        return (
            <div className="show-table">
            <Message className='page-title' visible content='Listing all groups' />
            <Table sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5' textAlign='right'>
                            <Search
                                loading={isLoading}
                                placeholder={"Search by group name"}
                                onResultSelect={this.handleResultSelect}
                                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                                    leading: true,
                                })}
                                showNoResults={false}
                                value={value}
                                {...this.props}
                            />
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
                        <Table.HeaderCell textAlign='center' verticalAlign='top'>
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
                                {this.checkMembership(group_id)}
                                {this.handleJoinStatus(member_id) ?
                                    <label>Admin</label>
                                    :
                                    <Icon name='thumbs up outline' size='large'
                                          //color={this.checkMembership(group_id) ? 'green' : 'red'}
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
