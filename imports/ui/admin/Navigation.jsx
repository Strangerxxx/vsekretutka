import React, { Component, PropTypes} from 'react';

export default class Navigation extends Component{
    render(){
        return(
            <ul className="nav nav-pills nav-stacked">
                <li><a href="/admin/add">Add Task</a></li>
                <li><a href="/admin/tasks">Tasks</a></li>
                <li><a href="/admin/users">Users</a></li>
                <li><a href="/admin/fields">Fields</a></li>
            </ul>
        )
    }
}