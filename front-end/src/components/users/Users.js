import React, {Component} from 'react';
import axios from "axios";

class Users extends Component{
    constructor(){
        super();
        this.state = {
            users : []
        }
    }
    componentDidMount(){
        axios.get('http://localhost:3000/api/users')
            .then(res => {
                const users = res.data;
                this.setState({ users });
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    }
    render(){
        return (
            <div>
                {
                    this.state.users.map(user =>
                        <li key={user.id}>{user.email}</li>
                    )
                }
            </div>
        )
    }
}

export default Users;
