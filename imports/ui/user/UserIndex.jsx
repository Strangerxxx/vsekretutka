import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import { Tracker } from 'meteor/tracker';

class UserIndex extends Component {
    componentWillMount(){
        Tracker.autorun(() => {
            console.log(Meteor.userId())
            if(this.props.ready && Roles.userHasRole(Meteor.userId(), 'admin')){
                this.props.router.push('/admin');
            }
        });
    }
    componentWillUnmount(){
        Tracker.flush();
    }

    render() {
        const { main } = this.props;
        return (
            <div className="content">
                {main}
            </div>
        )
    }
}

export default createContainer(() => {
    return{
        ready: Meteor.subscribe("currentUser", Meteor.userId()).ready(),
        user: Meteor.userId(),
    }
}, UserIndex);