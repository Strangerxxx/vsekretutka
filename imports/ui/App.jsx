import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { LoginDropdown } from './components/Login.jsx';
import NotificationsDropdown from './components/Notifications';

class App extends Component{
    logoClick(){
        Meteor.call('notifications.create');
    }
    render(){
        const { main, navigation } = this.props;
        return(
            <main>
                <div className="navbar navbar-default container-fluid" role="navigation">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#" onClick={this.logoClick}>Sekretutka</a>
                    </div>

                    <ul className="nav navbar-nav navbar-right">
                        <NotificationsDropdown currentUser={this.props.currentUser}/>
                        <LoginDropdown currentUser={this.props.currentUser}/>
                    </ul>
                </div>
                <div className="container-fluid">
                    <div className="col-md-2">
                        {navigation}
                    </div>
                    <div className="col-md-10">
                        {main}
                    </div>
                </div>
            </main>
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
