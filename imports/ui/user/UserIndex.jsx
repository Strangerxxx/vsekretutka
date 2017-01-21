import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles';
import { Tracker } from 'meteor/tracker'
import { browserHistory } from 'react-router'

class UserIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            if(Roles.userIsInRole(Meteor.userId(), 'admin')){
                browserHistory.push('/admin');
            }
        });
    }

    render() {
        const {main, navigation} = this.props;
        return (
            <div className="container-fluid">
                <div className="col-md-2">
                    {navigation}
                </div>
                <div className="col-md-10">
                    {main}
                </div>
            </div>
        )
    }
}

export default createContainer(() => {
    let handle = Meteor.subscribe('currentUser');
    return{
        user: Meteor.user(),
    }
}, UserIndex);