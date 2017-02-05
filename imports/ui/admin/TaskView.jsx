import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { SelectFromUsers } from '/imports/ui/components/formInputFields';
import Actions from '/imports/api/actions/actions';

class SimpleTaskView extends Component{
    render() {
        let task = this.props.task;
        return(
            <li>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">{task.name}</h4>
                    </div>
                    <div className="panel-body">
                        <span>{task.description}</span>
                    </div>
                </div>
            </li>
        )
    }
}

class TaskView extends Component{
    constructor(props){
        super(props);
        this.userAttachSubmit = this.userAttachSubmit.bind(this);
        this.userSelectCallback = this.userSelectCallback.bind(this);
        this.state =  {
            selectValue: 0,
        }
    }

    renderSimpleTasks(){
        let output = [];

        for(let subtask of this.props.subtasks){
            //if(subtask.type != 'main'){
                output.push(<SimpleTaskView key={subtask._id} task={subtask}/>);
            //}
        }

        return output;
    }

    userAttachSubmit(event){
        event.preventDefault();
        let form = $(event.target).serializeArray();
        if(form[0].value != 0)
            Meteor.call('actions.attach', form[0].value, Meteor.userId(), this.props.task._id, (error) => console.log(error));
    }

    userSelectCallback(value) {
        this.state.selectValue = value;
        this.forceUpdate();
    }

    renderAttachedUsers(){
        let output = [];
        let attachId;
        for(let user of this.props.users){
            if(attachId = Actions.userIsAttachedByAdmin(user._id, this.props.task._id, Meteor.userId()))
                output.push(
                    <li key={user._id}>
                        <a className="text-valign-center" href={'results/' + this.props.task._id + '/' + attachId}>{user.profile.firstName + ' ' + user.profile.lastName}</a>
                        <a className="unassign-user text-danger" onClick={() => this.userDeattach(user._id)}>
                            <i className="fa fa-2x fa-times text-valign-center"/>
                        </a>

                        <a className="edit-variables text-info" >
                            <i className="fa fa-2x fa-edit text-valign-center"/>
                        </a>
                    </li>
                );
        }
        return output;
    }

    renderPrevious(){
        let output = [];
        let actions = Actions.find({mainTaskId: this.props.task._id, type: 'attach'}).fetch();
        let deattach;
        for(let attach of actions) {
            if ( deattach = Actions.findOne({attachId: attach._id, type: 'deattach'}) ){
                let user = Meteor.users.findOne(attach.userId);
                output.push(
                    <li key={Random.id()}>
                        <a className="text-valign-center" href={'results/' + this.props.task._id + '/' + attach._id}>
                            {user.profile.firstName + ' ' + user.profile.lastName + ' | ' + attach.createdAt.toLocaleDateString() + ' - ' + deattach.createdAt.toLocaleDateString()}
                        </a>
                    </li>
                );
            }
        }
        return output;
    }

    userDeattach(userId){
        Meteor.call('actions.deattach', userId, Meteor.userId(), this.props.task._id);
    }

    render() {
        let task = this.props.task;
        if(this.props.ready)
            return(
                <div className="task-view">
                    <div className="task">
                        <article className="text-muted">{task.createdAt.toLocaleString()}</article>
                        <a className="btn btn-default pull-right" href={"edit/" + task._id}>Edit</a>
                        <h2>{task.name}</h2>
                        <div className="description">
                            <span>{task.description}</span>
                        </div>
                        <div className="sub-tasks">
                            <h3>Sub Tasks</h3>
                            <ol >
                            {this.renderSimpleTasks()}
                            </ol>
                        </div>
                    </div>
                    <hr/>
                    <div className="users-attach-form">
                        <form onSubmit={this.userAttachSubmit}>
                            <SelectFromUsers selectCallback={this.userSelectCallback} users={this.props.users} value={this.state.selectValue} className="user-select" name="selectUser"/>
                            <button type="Submit" className="btn btn-default">Attach</button>
                        </form>
                    </div>
                    <hr/>
                    <div className="users-attached">
                        <strong>Users Attached:</strong>
                        <ul>
                            {this.renderAttachedUsers()}
                        </ul>
                    </div>
                    <hr/>
                    <div className="all-results">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" href="#collapse1">Previous results</a>
                                </h4>
                            </div>
                            <div id='collapse1' className="panel-collapse collapse">
                                <div className="panel-body">
                                    <ul>
                                        {this.renderPrevious()}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-danger" onClick={() => Meteor.call('tasks.remove', this.props.task._id)}>Delete</button>
                </div>
            );
        else
            return(
                <span>Loading...</span>
            )
    }
}

export default createContainer(({params}) => {
    let tasksHandle = Meteor.subscribe('tasks', Meteor.userId());
    let usersHandle = Meteor.subscribe('users', Meteor.userId());
    let actionsHandle = Meteor.subscribe('actions.admin', Meteor.userId())
    let task ;
    let subtasks;
    let order = {};

    if(tasksHandle.ready()){
        task = Tasks.findOne({_id: params.taskId});
        subtasks = Tasks.find({_id: { $in: task.subTasks } }, {sort: task.subTasks}).fetch();
        task.subTasks.forEach(function (id, index) { order[id] = index; });
        subtasks.sort((a, b) => {
            return order[a._id] - order[b._id];
        });
    }

    return {
        task,
        subtasks,
        ready: tasksHandle.ready() && usersHandle.ready() && actionsHandle.ready(),
        users: Meteor.users.find().fetch().filter((user) => !Roles.userIsInRole(user._id, 'admin')),
    }
}, TaskView)