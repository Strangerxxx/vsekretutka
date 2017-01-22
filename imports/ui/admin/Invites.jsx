import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CopyToClipboard from 'react-copy-to-clipboard';

class InviteRow extends Component {
    returnStatus(){
        const invite = this.props.invite;
        if(invite.status != 'claimed')
            return invite.status;
        let user = Meteor.users.findOne({'profile.invite': invite._id});
        return invite.status + " by " + user.profile.firstName + ' ' + user.profile.lastName;
    }

    render() {
        const invite = this.props.invite;
        const removeInvite = () => {Meteor.call('invites.delete', Meteor.userId(), invite._id)};
        return(
            <tr>
                <td className="created-at">{invite.createdAt.toLocaleString()}</td>
                <CopyToClipboard text={Meteor.absoluteUrl() + 'acceptInvite/' + invite._id}>
                    <td><a href="#">Click to copy</a></td>
                </CopyToClipboard>
                <td>{this.returnStatus()}</td>
                <td><a href="#" onClick={removeInvite}>Delete</a></td>
            </tr>
        )
    }
}

class InvitesTable extends Component {
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
    render() {
        return(
            <div className="invites">
                <form onSubmit={this.createInvite}>
                    <button type="submit" id="create-invite" className="btn btn-primary">Create Invitation</button>
                </form>
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
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('invites');
    Meteor.subscribe('users');
    return{
        invites: Invites.find().fetch(),
    }
}, InvitesTable);