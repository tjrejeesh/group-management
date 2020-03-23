import React, {Component} from 'react';
import Login from "./Login";
import { Link } from 'react-router-dom';

class LoginPage extends Component{

    render(){
        return (
            <div>
                {
                    localStorage.getItem('login') ?
                        <div className="show-table">Welcome</div>
                        :
                        <div>
                            <Login/>
                            <Link to={'/register'}>Register</Link>
                        </div>
                }

            </div>
        )
    }
}

export default LoginPage;
