import React, { Component, PropTypes} from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor';
import Actions from '/imports/api/actions/actions';
import Tasks from '/imports/api/tasks/tasks';

class ResultRow extends Component{
    constructor(props){
        super(props);
        this.buttonContinue = this.buttonContinue.bind(this);
        this.buttonReturn = this.buttonReturn.bind(this);
    }

    buttonContinue(){
        Meteor.call('actions.continue', this.props.action.userId, this.props.action.mainTask._id, Meteor.userId(), this.props.action.subTask._id, this.props.action.attachId);
    }

    buttonReturn(){
        Meteor.call('actions.return', this.props.action.userId, this.props.action.mainTask._id, Meteor.userId(), this.props.action.subTask._id, this.props.action.attachId)
    }

    render() {
        let action = this.props.action;
        let buttons = [];
        if (action.action == 'Result'){
            if (action.checked != true && action.subTask.notify == 'true')
                buttons.push(
                    <button onClick={this.buttonContinue} className='btn btn-primary'>Continue</button>
                );
            buttons.push(
                <button onClick={this.buttonReturn} className='btn btn-primary'>Return</button>
            )
        }
        return(
            <tr className={action.returned ? 'danger' : action.checked == null ? null : action.checked ? 'success' : 'warning'}>
                <td>{action.createdAt}</td>
                <td>{action.subTask ? action.subTask.name : '-'}</td>
                <td>{action.action}</td>
                <td>{action.result}</td>
                <td>{action.message}</td>
                <td>{buttons}</td>
            </tr>
        )
    }
}

class Results extends Component{
    constructor(props){
        super(props);
        this.state = {
            actions: [],
        }
    }

    componentWillReceiveProps(props){
        if(props.ready){
            this.state.actions = [];
            this.fillResults(props);
        }
    }

    fillResults(props){
        let actions = this.state.actions;
        for(let action of props.actions){
            let subTask = Tasks.findOne(action.subTaskId);
            switch(action.type){
                case 'result':
                    actions.push({
                        attachId: action.attachId,
                        id: Random.id(),
                        userId: action.userId,
                        mainTask: props.task,
                        createdAt: action.createdAt.toLocaleString(),
                        result: action.result.value,
                        subTask,
                        action: 'Result',
                        checked: subTask.notify == 'true' ? false : null,
                        returned: false,
                    });
                    break;
                case 'return':
                    actions.push({
                        attachId: action.attachId,
                        id: Random.id(),
                        createdAt: action.createdAt.toLocaleString(),
                        subTask,
                        action: 'Return',
                        message: action.message,
                    });
                    actions[this.lastIndexOfResults(subTask)].returned = true;
                    break;
                case 'continue':
                    actions.push({
                        attachId: action.attachId,
                        id: Random.id(),
                        createdAt: action.createdAt.toLocaleString(),
                        subTask,
                        action: 'Continue',
                        message: action.message,
                    });
                    let lior = this.lastIndexOfResults(subTask);
                    actions[this.lastIndexOfResults(subTask)].checked = true;
                    break;
                case 'deattach':
                    actions.push({
                        attachId: action.attachId,
                        id: Random.id(),
                        createdAt: action.createdAt.toLocaleString(),
                        action: 'End',
                    })
            }
        }
        this.forceUpdate();
    }

    lastIndexOfResults(subTask){
        let results = this.state.actions;
        for(let i = results.length-1; i >= 0; i--){
            if(results[i].subTask.toString() == subTask.toString() && results[i].action == 'Result')
                return i;
        }
        return -1;
    }

    render(){
        if(this.props.ready){
            let actionRows = [];
            for(let action of this.state.actions){
                actionRows.push(
                    <ResultRow action={action} key={action.id}/>
                )
            }
            return(
                <div className="results">
                    <legend>Results for {this.props.user.profile.firstName} {this.props.user.profile.lastName} in {this.props.task.name}</legend>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Created At</th>
                                <th>Step Name</th>
                                <th>Action</th>
                                <th>Result</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {actionRows}
                        </tbody>
                    </table>
                </div>
            );
        }
        else
            return (<span>Loading...</span>)
    }
}

export default createContainer(({params}) => {
    let actionsHandle = Meteor.subscribe('actions.admin', Meteor.userId());
    let tasksHandle = Meteor.subscribe('tasks', Meteor.userId());
    let usersHandle = Meteor.subscribe('users', Meteor.userId());
    let actions, task, subTasks, user;
    if(actionsHandle.ready() && tasksHandle.ready() && usersHandle.ready()){
        user = Meteor.users.findOne({_id: Actions.findOne(params.attachId).userId});
        actions = Actions.find({attachId: params.attachId}).fetch();
        task = Tasks.findOne(params.taskId);
        subTasks = Tasks.find({id: {$in : task.subTasks}}).fetch();
    }

    return{
        ready: actionsHandle.ready() && tasksHandle.ready() && usersHandle.ready(),
        task,
        subTasks,
        user,
        actions,
        attachId: params.attachId,
    }
}, Results)