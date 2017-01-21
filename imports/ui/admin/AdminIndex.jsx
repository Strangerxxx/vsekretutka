import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles';
import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class AdminIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            if(Roles.subscription.ready() && !Roles.userIsInRole(Meteor.userId(), 'admin') ){
                browserHistory.push('/');
            }
        });
    }

    render() {
        const { main } = this.props;
        if(Roles.subscription.ready()){
            return (
                <div className="content">
                    {main}
                </div>
            );
        }
        return null;
    }
}

export default createContainer(() => {
    let handle = Meteor.subscribe('currentUser');
    return{
        ready:Roles.subscription.ready(),
        user: Meteor.user(),
    }
}, AdminIndex);