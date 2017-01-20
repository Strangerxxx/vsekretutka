import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Notifications } from '/imports/api/notifications/notifications';

class Notification extends Component{
    constructor(props) {
        super(props);
        this.state = {errorMessage: null};

        // This binding is necessary to make `this` work in the callback
        this.markSeen = this.markSeen.bind(this);
        this.remove = this.remove.bind(this);
    }

    markSeen(){
        Meteor.call('notifications.mark-seen', this.props.item._id);
    }

    remove(event){
        Meteor.call('notifications.remove', this.props.item._id);
    }

    render() {
        let seenLabel = <span className="label label-success">new</span>;

        return(
            <li role="menuitem" >
                <a className="notification-item" href={this.props.item.link} onMouseLeave={this.markSeen}>
                    <span className="remove-notification pull-right" href="#" onClick={this.remove}>&times;</span>
                    <span className="small text-muted">a million years ago</span>
                    {this.props.item.seen ? null : seenLabel}
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
            items.push(<Notification item={item} key={item._id}/>);
        }
        return items;
    }

    dropdownClick(event){
        console.log(event)
        event.stopPropagation();
    }

    render() {
        return(
            <li className="dropdown">
                <a className="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
                    <i className="fa fa-bell"/>
                    <span className="label label-danger">count</span>
                </a>

                <ul className="dropdown-menu" onClick={this.dropdownClick}>
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
        count: Notifications.find().count,
    };
}, NotificationsDropdown);