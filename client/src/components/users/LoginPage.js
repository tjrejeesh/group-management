import React, {Component} from 'react';
import Login from "./Login";

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
                        </div>
                }

            </div>
        )
    }
}

export default LoginPage;
