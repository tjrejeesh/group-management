import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react'

class Header extends Component{
    constructor(props){
        super(props);
        let user = JSON.parse(localStorage.getItem('login'));
        this.state = {
            loggedIn: localStorage.getItem('login'),
            userName: user ? user.name : ''
        };
    }

    logout(){
        localStorage.removeItem('login');
        localStorage.removeItem('token');
        window.location = '/';
    }
    render(){
        return (
            <header className="header">
                <div className="logo">Group Management</div>
                <input className="menu-btn" type="checkbox" id="menu-btn"/>
                <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>
                {this.state.loggedIn &&
                    <ul className="menu">
                        <li><Link to={'/mygroups'}>My Groups</Link></li>
                        <li><Link to={'/membership'}>Membership</Link></li>
                        <li><Link to={'/home'}>List groups</Link></li>
                        <li><Link to={'/login'} onClick={this.logout}>
                            <Icon name='address card outline' size='large'/>
                            {this.state.userName} Logout ?</Link></li>
                    </ul>
                }
            </header>
        )
    }
}

export default Header;
