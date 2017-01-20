import React, { Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { LoginDropdown } from './components/Login.jsx';

class App extends Component{
    render(){
        return(
            <div className="navbar navbar-default container-fluid" role="navigation">
                <div className="navbar-header">
                    <a className="navbar-brand" href="#">Sekretutka</a>
                </div>

                <ul className="nav navbar-nav navbar-right">
                    <LoginDropdown currentUser={this.props.currentUser}/>
                </ul>
            </div>
        )
    }
}

App.propTypes = {
    currentUser: PropTypes.object,
};

export default createContainer(() => {
    return{
        currentUser: Meteor.user(),
    }
}, App);
