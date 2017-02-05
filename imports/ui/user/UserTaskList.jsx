import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Actions from '/imports/api/actions/actions';

class UserTaskList extends Component{
    createTaskList(){
        let options = [];
        let attachActions = Actions.find({_id: {$in: this.props.attachIds}}).fetch();
        for(let attach of attachActions){
            let task = Tasks.findOne(attach.mainTaskId);
            options.push(<li key={task._id}><a href={"tasks/" + task._id + '/' + attach._id}>{task.name}</a></li>);
        }
        return options;
    }

    render() {
        if(this.props.ready)
            return(
                <div className="task-list">
                    <legend>Task List</legend>
                    <ul className="nav nav-pills nav-stacked">
                        {this.createTaskList()}
                    </ul>
                </div>
            );
        else return(<span>Loading...</span>)
    }
}

export default createContainer(() => {
    let tasksHandle = Meteor.subscribe('tasks', Meteor.userId());
    let actionsHandle = Meteor.subscribe('actions.user', Meteor.userId());
    let userHandle = Meteor.subscribe('users', Meteor.userId());
    let attachIds;
    if(userHandle.ready())
        attachIds = Meteor.user().profile.attachIds;
    return {
        tasks: Tasks.find().fetch().filter((item) => item.type == 'main'),
        attachIds,
        ready: tasksHandle.ready() && actionsHandle.ready(),
    }
}, UserTaskList);