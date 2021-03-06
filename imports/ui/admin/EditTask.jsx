import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import TaskForm from './TaskForm';
import { createContainer } from 'meteor/react-meteor-data';

class EditTask extends Component{
    render(){
        if(this.props.ready){
            return(
                <div className="container-fluid">
                    <legend>Edit Task</legend>
                    <a href={'/admin/tasks/' + this.props.task._id} className="btn btn-default">Back to Task</a>
                    <hr/>
                    <div className="row">
                        <TaskForm tasks={this.props.tasks} doc={this.props.task} subTasks={this.props.subTasks}/>
                    </div>
                </div>
            );
        }
        else return null;
    }
}

export default createContainer(({params}) => {
    let handle = Meteor.subscribe('tasks', Meteor.userId());
    let task, subTasks, order = {};
    if(handle.ready()){
        task = Tasks.findOne({_id: params.taskId});
        subTasks = Tasks.find({_id: { $in: task.subTasks } }, {sort: task.subTasks}).fetch();
        task.subTasks.forEach(function (id, index) { order[id] = index; });
        subTasks.sort((a, b) => {
            return order[a._id] - order[b._id];
        });
    }
    return {
        tasks: Tasks.find().fetch(),
        task,
        subTasks,
        ready: handle.ready(),
    }
}, EditTask);