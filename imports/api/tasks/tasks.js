import { Meteor } from 'meteor/meteor';
import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';
import CompletionTypes from '/imports/ui/components/completionTypes/';

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

    Meteor.methods({
       'tasks.insert.main': (doc, callback) => {
            let subTasks = [];
            for(let task of doc.subTasks){
                if(task.select)
                    subTasks.push(task.select);
                else
                    subTasks.push(Tasks.insert(task))
            }

            Tasks.insert({
                name: doc.name,
                description: doc.description,
                type: doc.type,
                subTasks: subTasks,
            })
        },
        'tasks.remove': (taskId) => {
           console.log('deleting task');
           //add logic
        }
    });
}

Tasks.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
    },
    description: {
        type: String,
        label: 'Description'
    },
    type: {
        type: String,
        label: 'Type',
        allowedValues: ['main'].concat(CompletionTypes.map((type)=>type.label)),
        optional: true,
    },
    subTasks: {
        type: Array,
        optional: true,
    },
    'subTasks.$': Tasks,
    createdAt: {
        type: Date,
        autoValue(){
            if(this.isInsert)
                return new Date();
        }
    }
});

Tasks.attachSchema(Tasks.schema);