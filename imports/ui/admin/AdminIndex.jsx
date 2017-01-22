import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Roles } from 'meteor/alanning:roles';
import { Tracker } from 'meteor/tracker'

class AdminIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            console.log('admin tracker')
            if(!Meteor.userId() && Roles.subscription.ready() && !Roles.userIsInRole(Meteor.userId(), 'admin') ){
                console.log('admin if')
                this.props.router.push('/');
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
    return{
        ready:Roles.subscription.ready(),
        user: Meteor.userId(),
    }
}, AdminIndex);