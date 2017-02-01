import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles';
import { Tracker } from 'meteor/tracker';

class UserIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            console.log(Meteor.userId())
            if(Roles.subscription.ready() && Roles.userIsInRole(Meteor.userId(), 'admin')){
                this.props.router.push('/admin');
            }
        });
    }
    componentWillUnmount(){
        Tracker.flush();
    }

    render() {
        const {main, navigation} = this.props;
        return (
            <div className="content">
                {main}
            </div>
        )
    }
}

export default createContainer(() => {
    return{
        ready: Roles.subscription.ready(),
        user: Meteor.userId(),
    }
}, UserIndex);