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

    buttonContinue(message){
        let continueAction = (result) => {
            Meteor.call(
                'actions.continue',
                this.props.action.userId,
                this.props.action.mainTask._id, Meteor.userId(),
                this.props.action.subTask._id,
                this.props.action.attachId,
                this.props.action.id,
                result
            );
        };
        if(message)
            bootbox.prompt({
                title: "Please write a message for user",
                inputType: 'textarea',
                callback: (result) => {
                    if(result != null && result != '')
                        continueAction(result);
                }
            });
        else(continueAction());
    }

    buttonReturn(){
        let returnAction = (result) => {
            Meteor.call(
                'actions.return',
                this.props.action.userId,
                this.props.action.mainTask._id,
                Meteor.userId(),
                this.props.action.subTask._id,
                this.props.action.attachId,
                this.props.action.id,
                result
            );
        };
        bootbox.prompt({
            title: "Please write a message for user",
            inputType: 'textarea',
            callback: (result) => {
                if(result != null && result != '')
                    returnAction(result);
            }
        });
    }

    render() {
        let action = this.props.action;
        let buttons = [];
        let user = Meteor.users.findOne(action.userId);
        if (action.action == 'Result' && this.props.ongoing){
            if (action.checked != true && action.subTask.notify == 'true')
                buttons.push(
                    <div key={Random.id()} className="btn-group dropup">
                        <button type="button" className="btn btn-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-play"/> <i className="fa fa-caret-up"/>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-right">
                            <li><a className="dropdown-item" href="#" onClick={this.buttonContinue}>Simple</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => this.buttonContinue(true)}>With message</a></li>
                        </ul>
                    </div>
                );
            buttons.push(
                <button onClick={this.buttonReturn} key={Random.id()} className='btn btn-danger'><i className="fa fa-step-backward"/></button>
            )
        }
        return(
            <tr className={action.returned ? 'danger' : action.checked == null ? null : action.checked ? 'success' : 'warning'}>
                <td className="created-at">{action.createdAt}</td>
                <td>{action.subTask ? action.subTask.name : '-'}</td>
                <td>{user.profile.firstName + ' ' + user.profile.lastName} {Roles.userIsInRole(action.userId, 'admin') ? '(admin)' : null}</td>
                <td>{action.action}</td>
                <td>{action.result}</td>
                <td>{action.message}</td>
                <td><div className="btn-group">{buttons}</div></td>
            </tr>
        )
    }
}

class Results extends Component{
    constructor(props){
        super(props);
        this.state = {
            actions: [],
            ongoing: true,
            modalOpen: false,
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
                        userId: action.userId,
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
                        userId: action.userId,
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
                        userId: action.userId,
                        createdAt: action.createdAt.toLocaleString(),
                        action: 'End',
                    })
                    this.state.ongoing = false;
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
                    <ResultRow action={action} key={action.id} ongoing={this.state.ongoing}/>
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
                                <th>By</th>
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