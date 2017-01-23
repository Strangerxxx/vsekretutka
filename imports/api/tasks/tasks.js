import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default Tasks = new Meteor.Collection('tasks');

if(Meteor.isServer){
    Meteor.publish('tasks', () => {
        if(this.userId == null)
            return null;
        else if(Roles.userIsInRole(this.userId, 'admin'))
            return Tasks.find();
        else
            return null; //create logic for users
    });
}

Tasks.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
    },
    description: {
        type: String,
        label: 'Description',
        autoform: {
            height: 10,
        }
    },
    type: {
        type: String,
        allowedValues: ['main', 'sub'],
        autoform: {
            hidden: true,
        }
    },
    subTasks: {
        type: [Tasks],
        optional: true,
    },
    createdAt: {
        type: Date,
        autoValue(){
            if(this.isInsert)
                return new Date();
        }
    }
});

//Tasks.attachSchema(TasksSchema);