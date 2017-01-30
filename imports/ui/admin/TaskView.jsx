import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { SelectFromUsers } from '/imports/ui/components/formInputFields';

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
        Meteor.call('actions.attach', form[0].value, Meteor.userId(), this.props.task._id, (error) => console.log(error));
    }

    render() {
        let task = this.props.task;
        if(this.props.ready)
            return(
                <div className="task-view">
                    <div className="task">
                        <article className="text-muted">{task.createdAt.toLocaleString()}</article>
                        <a className="btn btn-default pull-right" href={task._id + "/edit"}>Edit</a>
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
                            <SelectFromUsers users={this.props.users} value={0} className="user-select" name="selectUser"/>
                            <button type="Submit" className="btn btn-default">Attach</button>
                        </form>
                    </div>
                    <hr/>
                    <div className="users-attached">
                        <strong>Users Attached:</strong>
                        <ul>
                            <li>
                                <a className="text-valign-center" href="/admin/tasks/">user</a>
                                <a className="unassign-user text-danger" >
                                    <i className="fa fa-2x fa-times text-valign-center"/>
                                </a>

                                <a className="edit-variables text-info" >
                                    <i className="fa fa-2x fa-edit text-valign-center"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <hr/>
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
        ready: tasksHandle.ready() && usersHandle.ready(),
        users: Meteor.users.find().fetch().filter((user) => !Roles.userIsInRole(user._id, 'admin')),
    }
}, TaskView)