import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


class TaskView extends Component{
    componentDidMount(){
        this.setState({
             task: Tasks.findOne({_id: this.props.params.taskId})
        });
    }
    render() {
        return(
            <div className="task-view">

            </div>
        )
    }
}

export default createContainer(() => {
    Meteor.subscribe('tasks', Meteor.userId());
    return {}
}, TaskView)