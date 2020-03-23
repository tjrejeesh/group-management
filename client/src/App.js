import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'react-bootstrap';

import {
    BrowserRouter as Router,
    Route, Switch, Redirect
} from 'react-router-dom';
import './App.scss';
import Dashboard from "./components/dashboard/Dashboard";
import decode from 'jwt-decode';
import LoginPage from "./components/users/LoginPage";
import Register from "./components/users/Register";
import Header from "./components/common/Header";
import AddGroup from "./components/groups/AddGroup";
import MyGroup from "./components/dashboard/MyGroup";
import Members from "./components/groups/Members";
import Membership from "./components/groups/Membership";
import {ToastContainer} from "react-toastify";

const Home = () => (
    <Dashboard />
);

const UserLogin = () => (
    <LoginPage />
);

const RegisterPage = () => (
    <Register />
);

const AddGroupPage = () => (
    <AddGroup />
);

const ListMembers = () => (
    <Members />
);

const MyGroupPage = () => (
    <MyGroup />
);

const MembershipPage = () => (
    <Membership />
);


const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    try {
        const { exp } = decode(token);
        if (exp < new Date().getTime() / 1000) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
};

const AuthRoute = ({ component: Component, ...rest }) => (

    <Route {...rest} render={props => (
        checkAuth() ? (
            <Component {...props}/>
        ) : (
            <Redirect to={{pathname: '/'}}/>
        )
    )}/>
);

class App extends Component {
    render() {
        return (

            <div className="App">
                <Router>
                    <Header/>
                    <Container>
                        <ToastContainer />
                        <Switch>
                            <Route exact path="/" render={props => <UserLogin {...props} />} />
                            <Route exact path="/register" component={RegisterPage} />
                            <AuthRoute exact path="/members" component={ListMembers} />
                            <AuthRoute exact path="/membership" component={MembershipPage} />
                            <AuthRoute exact path="/addgroup" component={AddGroupPage} />
                            <AuthRoute exact path="/mygroups" component={MyGroupPage} />
                            <AuthRoute exact path="/home" component={Home} />
                        </Switch>
                    </Container>
                </Router>
            </div>

        );
    }
}

export default App;
