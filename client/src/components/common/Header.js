import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Header extends Component{
    render(){
        return (
            <header className="header">
                <div className="logo">Group Management</div>
                <input className="menu-btn" type="checkbox" id="menu-btn"/>
                <label className="menu-icon" htmlFor="menu-btn"><span className="navicon"></span></label>
                <ul className="menu">
                    <li><Link to={'/'}>Create Group</Link></li>
                    <li><Link to={'/home'}>My Groups</Link></li>
                    <li><Link to={'/'}>List groups</Link></li>
                </ul>
            </header>
        )
    }
}

export default Header;
