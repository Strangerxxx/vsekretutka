import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import TaskForm from './TaskForm';
import { createContainer } from 'meteor/react-meteor-data';

class AddTask extends Component{
    render(){
        return(
            <div className="container-fluid">
                <legend>Add Task</legend>
                <div className="row">
                    <TaskForm tasks={this.props.tasks}/>
                </div>
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('tasks', Meteor.userId());
    return {
        tasks: Tasks.find().fetch(),
    }
}, AddTask);