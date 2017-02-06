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
        Meteor.call('actions.continue', this.props.action.userId, this.props.action.mainTask._id, Meteor.userId(), this.props.action.subTask._id, this.props.action.attachId, this.props.action.id);
    }

    buttonReturn(){
        Meteor.call('actions.return', this.props.action.userId, this.props.action.mainTask._id, Meteor.userId(), this.props.action.subTask._id, this.props.action.attachId, this.props.action.id)
    }

    render() {
        let action = this.props.action;
        let buttons = [];
        if (action.action == 'Result'){
            if (action.checked != true && action.subTask.notify == 'true')
                buttons.push(
                    <button onClick={this.buttonContinue} key={Random.id()} className='btn btn-primary'>Continue</button>
                );
            buttons.push(
                <button onClick={this.buttonReturn} key={Random.id()} className='btn btn-primary'>Return</button>
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
            let subTask = Tasks.findOne(action.data.subTaskId);
            switch(action.type){
                case 'result':
                    actions.push({
                        attachId: action.data.attachId,
                        id: action._id,
                        userId: action.userId,
                        mainTask: props.task,
                        createdAt: action.createdAt.toLocaleString(),
                        result: action.data.result.value,
                        subTask,
                        action: 'Result',
                        checked: subTask.notify == 'true' ? false : null,
                        returned: false,
                    });
                    break;
                case 'return':
                    actions.push({
                        attachId: action.data.attachId,
                        id: action._id,
                        createdAt: action.createdAt.toLocaleString(),
                        subTask,
                        action: 'Return',
                        message: action.data.message,
                    });
                    actions[this.getIndexById(action.data.resultId)].returned = true;
                    break;
                case 'continue':
                    actions.push({
                        attachId: action.attachId,
                        id: action._id,
                        createdAt: action.createdAt.toLocaleString(),
                        subTask,
                        action: 'Continue',
                        message: action.data.message,
                    });
                    actions[this.getIndexById(action.data.resultId)].checked = true;
                    break;
                case 'deattach':
                    actions.push({
                        attachId: action.attachId,
                        id: action._id,
                        createdAt: action.createdAt.toLocaleString(),
                        action: 'End',
                    })
            }
        }
        this.forceUpdate();
    }

    getIndexById(id){
        let localActions = this.state.actions;
        for(let action of localActions){
            if(action.id == id)
                return localActions.indexOf(action);
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
        user = Meteor.users.findOne({_id: Actions.findOne(params.attachId).data.userId});
        actions = Actions.find({'data.attachId': params.attachId}).fetch();
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