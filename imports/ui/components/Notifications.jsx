import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Notifications } from '/imports/api/notifications/notifications';

class Notification extends Component{

    render() {
        return(
            <li role="menuitem" >
                <a className="remove-notification pull-right" href="#" data-id="{{_id}}">&times;</a>
                <a className="notification-item" href="#" data-id="{{_id}}">
                    <span className="small text-muted">a million years ago</span>
                    <span className="label label-success" hidden={this.props.item.seen}>new</span>
                    <p>{this.props.item.text}</p>
                </a>
            </li>
        )
    }
}

class NotificationsDropdown extends Component{
    getNotifications() {
        let items = [];
        for(let item of this.props.notifications){
            console.log(item)
            items.push(<Notification item={item} key={item._id._str}/>);
        }
        return items;
    }

    render() {
        return(
            <li className="dropdown">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                    <i className="fa fa-bell"/>
                    <span className="label label-danger">count</span>
                </a>

                <ul className="dropdown-menu">
                    <h6 className="dropdown-header"><b>Notifications</b></h6>
                    <li className="divider"/>
                    {this.getNotifications()}
                </ul>
            </li>
        )
    }
}


export default createContainer(() => {
    Meteor.subscribe('notifications');
    return {
        notifications: Notifications.find().fetch(),
    };
}, NotificationsDropdown);