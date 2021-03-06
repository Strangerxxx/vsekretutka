import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import CompletionTypes from '../components/completionTypes';
import Actions from '/imports/api/actions/actions';

class SimpleTaskView extends Component{
    constructor(props){
        super(props);
        this.completionCallback = this.completionCallback.bind(this);
        this.state = {
            value: null,
        }
    }

    drawCompletionForm(){
        if(this.props.value == false)
            return(<span className="text-primary">Result has been sent, please wait for approval.</span>);
        for(let type of CompletionTypes){
            if(type.label == this.props.task.type){
                if(this.props.task.notify == 'true')
                    return (
                        <div>
                            <span className="text-danger">Admin will be notified upon completion of this step.</span>
                            <type.component callback={this.completionCallback}/>
                        </div>
                    );
                return <type.component callback={this.completionCallback}/>;
            }
        }
    }

    completionCallback(result){
        if(result)
            Meteor.call('actions.result', Meteor.userId(), this.props.mainTaskId, this.props.task._id, result, this.props.attachId);
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
                {this.selectActiveStep()}
            </div>
        )
    }
}

class UserTaskView extends Component{
    constructor(props){
        super(props);
        this.state = {
            activeStep: null,
            value: null,
        }
    }

    componentWillReceiveProps(props){
        if(props.ready){
            this.state.activeStep = null;
            this.selectActiveStep(props);
        }
    }

    selectActiveStep(props) {
        let activeStep = null;

        for(let subTask of props.subTasks){
            let actions = Actions.find({'data.subTaskId': subTask._id, 'data.attachId': props.attachId}).fetch();
            let lastAction = actions[actions.length-1];
            if(this.state.value == false)
                this.state.value = true;
            if(actions.length == 0){
                activeStep = subTask;
                break;
            }
            else if(lastAction.type == 'return')
            {
                activeStep = subTask;
                break;
            }
            else if(subTask.notify == 'true' && lastAction.type == 'result'){
                activeStep = subTask;
                this.state.value = false;
                break;
            }

        }

        this.state.activeStep = activeStep;
        this.forceUpdate();

    }


    render() {
        if(this.props.ready)
        {
            return(
                <div className="userTaskView">
                    <h2>{this.props.task.name}</h2>
                    <div className="description">
                        <span>{this.props.task.description}</span>
                    </div>
                    <hr/>
                    <SimpleTaskView task={this.state.activeStep} checked={this.state.value} mainTaskId={this.props.task._id} attachId={this.props.attachId}/>
                </div>
            );
        }
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
        actions = Actions.find({'data.mainTaskId': task._id, 'data.attachId': params.attachId}).fetch();
    }

    return {
        task,
        subTasks,
        ready: tasksHandle.ready() && actionsHandle.ready() && subTasksHandle.ready(),
        attachId: Actions.userIsAttached(Meteor.userId(), params.taskId),
        adminUserId: params.adminId,
        actions,
        attachId: params.attachId,
    }
}, UserTaskView);