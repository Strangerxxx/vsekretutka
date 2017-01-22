import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles';
import { Tracker } from 'meteor/tracker';
import { browserHistory } from 'react-router'

export default class UserIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            if(Roles.userIsInRole(Meteor.userId(), 'admin') && Roles.subscription.ready()){
                browserHistory.push('/admin');
            }
        });
    }

    render() {
        const {main, navigation} = this.props;
        return (
            <div className="content">
                HELLO WORLD
            </div>
        )
    }
}

