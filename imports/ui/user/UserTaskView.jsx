import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import CompletionTypes from '../components/completionTypes';
import Actions from '/imports/api/actions/actions';

class SimpleTaskView extends Component{
    constructor(props){
        super(props);
        this.completionCallback = this.completionCallback.bind(this);
    }

    drawCompletionForm(){
        for(let type of CompletionTypes){
            if(type.label == this.props.task.type)
                return <type.component callback={this.completionCallback}/>;
        }
    }

    completionCallback(value){
        if(value)
            Meteor.call('actions.result', Meteor.userId(), this.props.mainTaskId, this.props.task._id, {value}, this.props.attachId);
    }

    render(){
        let task = this.props.task;
        if(task == null)
            return(<span>Completed</span>);
        return(
            <div className="active-step">
                <h3>Active Step</h3>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">{task.name}</h4>
                    </div>
                    <div className="panel-body">
                        {task.description}
                    </div>
                    <div className="panel-footer">
                        {this.drawCompletionForm()}
                    </div>
                </div>
                <hr/>
            </div>
        )
    }
}

class MainTaskView extends Component{
    render() {
        return(
            <div className="userTaskView">
                <h2>{this.props.task.name}</h2>
                <div className="description">
                    <span>{this.props.task.description}</span>
                </div>
                <hr/>
                {this.drawActiveStep()}
            </div>
        )
    }
}

class UserTaskView extends Component{
    drawActiveStep() {
        for (let subTask of this.props.subTasks)
        {
            if(!Actions.findOne({type: 'result', subTaskId: subTask._id, mainTaskId: this.props.task._id, adminUserId: this.props.adminUserId}))
                return (<SimpleTask task={subTask} mainTaskId={this.props.task._id} attachId={this.props.attachId}/>)
        }
        return (<SimpleTask task={null} mainTaskId={this.props.task._id} attachId={this.props.attachId}/>)
    }

    render() {
        if(this.props.ready)
            return(
                <div className="userTaskView">
                    <h2>{this.props.task.name}</h2>
                    <div className="description">
                        <span>{this.props.task.description}</span>
                    </div>
                    <hr/>
                    {this.drawActiveStep()}
                </div>
            );
        else
            return (
                <span>Loading...</span>
            );
    }
}

export default createContainer(({params}) => {
    let tasksHandle = Meteor.subscribe('tasks', Meteor.userId());
    let subTasksHandle = Meteor.subscribe('tasks.subTasks', Meteor.userId(), params.taskId);
    let actionsHandle = Meteor.subscribe('actions.user', Meteor.userId());
    let task, subTasks, order = {}, actions;

    if(tasksHandle.ready() && subTasksHandle.ready()){
        task = Tasks.findOne({_id: params.taskId});
        subTasks = Tasks.find({_id: { $in: task.subTasks } }, {sort: task.subTasks}).fetch();
        task.subTasks.forEach(function (id, index) { order[id] = index; });
        subTasks.sort((a, b) => {
            return order[a._id] - order[b._id];
        });
        actions = Actions.find({mainTaskId: task._id, adminUserId: params.adminId}).fetch();
    }

    return {
        task,
        subTasks,
        ready: tasksHandle.ready() && actionsHandle.ready() && subTasksHandle.ready(),
        attachId: Actions.userIsAttached(Meteor.userId(), params.taskId),
        adminUserId: params.adminId,
        actions,
    }
}, UserTaskView);