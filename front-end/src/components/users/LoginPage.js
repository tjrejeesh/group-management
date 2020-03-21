import React, {Component} from 'react';
import Login from "./Login";
import { Link } from 'react-router-dom';

class LoginPage extends Component{
    render(){
        return (
            <div>
                <Login/>
                <Link to={'/register'}>Register</Link>
            </div>
        )
    }
}

export default LoginPage;
