import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Tracker } from 'meteor/tracker'

class AdminIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            console.log('admin tracker')
            if(this.props.ready && !Roles.userHasRole(Meteor.userId(), 'admin') ){
                console.log('admin if')
                this.props.router.push('/');
            }
        });
    }

    componentWillUnmount(){
        Tracker.flush();
    }
    render() {
        const { main } = this.props;
        if(this.props.ready){
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
        ready: Meteor.subscribe("currentUser", Meteor.userId()).ready(),
        user: Meteor.userId(),
    }
}, AdminIndex);