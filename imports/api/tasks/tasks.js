import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default Tasks = new Meteor.Collection('tasks');

if(Meteor.isServer){
    Meteor.publish('tasks', (userId) => {
        if(userId == null)
            return null;
        else if(Roles.userIsInRole(userId, 'admin'))
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
        allowedValues: ['main', 'simple'],
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