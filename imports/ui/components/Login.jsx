import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class Logout extends Component{
    handleLogout(event) {
        event.preventDefault();

        Meteor.logout();
    }
    render() {
        return(
            <div className="logout-button">
                <button className="btn btn-primary form-control" onClick={this.handleLogout.bind(this)}>
                    Logout
                </button>
            </div>
        )
    }
}

export class LoginForm extends Component{
    constructor(props) {
        super(props);
        this.state = {errorMessage: null};

        // This binding is necessary to make `this` work in the callback
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(event){
        event.preventDefault();

        const email = ReactDOM.findDOMNode(this.refs.email).value.trim();
        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();

        Meteor.loginWithPassword(email, password, (error, props) => {
            if(error){
                this.setState({
                    errorMessage: <div className="alert alert-danger"> {error.reason} </div>
                });
            }

        });
    }

    render() {
        return (
            <div className="login-form">
                {this.state.errorMessage}
                <form className="new-task form-group" onSubmit={this.handleLogin.bind(this)} >
                    <input
                        className="form-control"
                        type="email"
                        id="email"
                        ref="email"
                        placeholder="Email"
                    />
                    <input
                        className="form-control"
                        type="password"
                        ref="password"
                        placeholder="**********"
                    />
                    <button type="submit" className="btn btn-primary form-control">Sign In</button>
                </form>
            </div>
        )
    }
}


export class LoginDropdown extends Component {
    render() {
        let captionText;
        let template;

        if(this.props.currentUser){
            template = <Logout/>;
            captionText = this.props.currentUser.emails[0].address;
        }else{
            template = <LoginForm/>;
            captionText = "Sign In";
        }

        return(
            <li className="dropdown">

                <a className="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                    {captionText} <i className="fa fa-caret-down"/>
                </a>

                <ul id='login' className="dropdown-menu">
                    {template}
                </ul>
            </li>
        )
    }
}

LoginDropdown.propTypes = {
    userId: PropTypes.string,
    currentUser: PropTypes.object,
};

