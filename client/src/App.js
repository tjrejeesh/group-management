import React, { Component } from 'react';
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

const MyGroupPage = () => (
    <MyGroup />
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
                    <div>
                        <Switch>
                            <Route exact path="/" render={props => <UserLogin {...props} />} />
                            <Route exact path="/register" component={RegisterPage} />
                            <AuthRoute exact path="/addgroup" component={AddGroupPage} />
                            <AuthRoute exact path="/mygroups" component={MyGroupPage} />
                            <AuthRoute exact path="/home" component={Home} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
