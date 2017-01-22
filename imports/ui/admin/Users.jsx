import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import InvitesTable from './Invites';

class Users extends Component {
    render(){
        return(
            <div className="users">
                <legend>Invitations</legend>
                <InvitesTable/>
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('users', Meteor.userId());
    return{
        users: Meteor.users.find().fetch(),
    }
}, Users);