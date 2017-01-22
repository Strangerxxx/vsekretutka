import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import InvitesTable from './Invites';

class UserTableRow extends Component{
    render(){
        const user = this.props.user;
        const deleteUser = () => {Meteor.call('users.delete', user._id)};
        if(user.profile != undefined)
            return(
                <tr>
                    <td className="created-at">{user.createdAt.toLocaleString()}</td>
                    <td>{user.profile.nickname}</td>
                    <td>{user.profile.firstName}</td>
                    <td>{user.profile.lastName}</td>
                    <td><a href={"/admin/users/edit/" + user._id} >Edit</a></td>
                    <td><a href="#" onClick={deleteUser}>Delete</a></td>
                </tr>
            );
        else return null;
    }
}

class Users extends Component {
    fillUsersTable(){
        let users = this.props.users;
        let userRows = [];
        if(this.props.subscriptionReady)
            for(const user of users){
                userRows.push(<UserTableRow user={user} key={user._id}/>)
            }
        return userRows;
    }
    render(){
        return(
            <div className="users">
                <legend>Invitations</legend>
                <InvitesTable/>

                <legend>Users</legend>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Created At</th>
                        <th>Nickname</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.fillUsersTable()}
                    </tbody>
                </table>
            </div>

        )
    }
}

export default createContainer(() => {
    return{
        users: Meteor.users.find().fetch(),
        subscriptionReady: Meteor.subscribe('users').ready(),
    }
}, Users);