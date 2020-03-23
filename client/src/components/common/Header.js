import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Header extends Component{
    state = {
        loggedIn: localStorage.getItem('login')
    };
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
                        <li><Link to={'/login'} onClick={this.logout}>Logout</Link></li>
                    </ul>
                }
            </header>
        )
    }
}

export default Header;
