import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

export class TaskList extends Component{
    createTaskList(){
        let options = [];
        for(let task of this.props.tasks){
            options.push(<li key={task._id}><a href={"tasks/" + task._id}>{task.name}</a></li>);
        }
        return options;
    }

    render() {
        return(
            <div className="task-list">
                <legend>Task List</legend>
                <ul className="nav nav-pills nav-stacked">
                    {this.createTaskList()}
                </ul>
            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('tasks', Meteor.userId());
    return {
        tasks: Tasks.find().fetch().filter((item) => item.type=="main"),
    }
}, TaskList);