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

    Meteor.methods({
       'tasks.insert.main': (doc) => {
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
                subTasks: subTasks,
            })
        },
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
    action: {
        type: Object,
        optional: true,
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

Tasks.attachSchema(Tasks.schema);