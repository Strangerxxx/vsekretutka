import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {TaskList} from '../admin/TaskList';

class UserTaskList extends TaskList{

}

export default createContainer(() => {
    Meteor.subscribe('tasks', Meteor.userId());
    return {
        tasks: Tasks.find().fetch(),
    }
}, UserTaskList);