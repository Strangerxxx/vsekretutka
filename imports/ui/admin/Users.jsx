import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class InviteRow extends Component {

    render() {
        let invite = this.props.invite;
        return(
            <tr>
                <td>{invite.createdAt.toLocaleString()}</td>
                <td><a href="#" data-clipboard-text="{{url}}{{_id}}">Click to copy</a></td>
                <td>{invite.status}</td>
                <td><a href="#">Delete</a></td>
            </tr>
        )
    }
}

class Users extends Component {
    createInvite(event){
        event.preventDefault();
        Meteor.call('invites.create', Meteor.userId());
    }

    fillInvitesTable(){
        let inviteRows = [];
        for(let invite of this.props.invites){
            inviteRows.push(
                <InviteRow invite={invite} key={invite._id}/>
            )
        }
        return(inviteRows);
    }

    render(){
        return(
            <div className="users" onSubmit={this.createInvite}>
                <legend>Invitations</legend>
                <form>
                    <button type="submit" id="create-invite" className="btn btn-primary">Create Invitation</button>
                </form>
                <div id="table-invites">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Created At</th>
                            <th>Registration Link</th>
                            <th>Status</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.fillInvitesTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('users', Meteor.userId());
    Meteor.subscribe('invites', Meteor.userId());
    return{
        users: Meteor.users.find().fetch(),
        invites: Invites.find().fetch(),
    }
}, Users);