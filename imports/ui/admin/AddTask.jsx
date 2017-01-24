import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import TaskForm from './TaskForm';

export default class AddTask extends Component{
    render(){
        return(
            <div className="container-fluid">
                <legend>Add Task</legend>
                <div className="row">
                    <TaskForm/>
                </div>
            </div>
        )
    }
}