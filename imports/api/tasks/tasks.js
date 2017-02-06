import { Meteor } from 'meteor/meteor';
import 'babel-polyfill';
import SimpleSchema from 'simpl-schema';
import CompletionTypes from '/imports/ui/components/completionTypes/';
import Actions from '../actions/actions';

export default Tasks = new Meteor.Collection('tasks');

if(Meteor.isServer){
    Meteor.publish('tasks', (userId) => {
        if(userId == null)
            return null;
        else if(Roles.userIsInRole(userId, 'admin'))
            return Tasks.find();
        else{
            return Tasks.find({_id: {
                $in: Actions.find(
                    {_id: { $in: Meteor.users.findOne(userId).profile.attachIds
                }}).map((item) => item.data.mainTaskId)
            }});
        }
    });

    Meteor.publish('tasks.subTasks', (userId, mainTaskId) => {
        if(userId && mainTaskId){
            if(Actions.userIsAttached(userId, mainTaskId))
                return Tasks.find({_id: {$in: Tasks.findOne({_id: mainTaskId}).subTasks}})
        }

    });

    Meteor.methods({
        'tasks.insert.main': (doc, callback) => {
            let subTasks = [];
            for(let task of doc.subTasks){
                if(task.select)
                    subTasks.push(task.select);
                else
                    subTasks.push(Tasks.insert(task, (error) => {
                        console.log(error)
                        if(error)
                            throw new Meteor.Error(error.sanitizedError.error, error.invalidKeys, doc.subTasks.indexOf(task));
                    }))
            }

            Tasks.insert({
                name: doc.main.name,
                description: doc.main.description,
                type: doc.main.type,
                subTasks: subTasks,
            },  (error) => {
                if(error)
                    throw new Meteor.Error(error.sanitizedError.error, error.invalidKeys, 'main');
            })
        },
        'tasks.remove': (taskId) => {
           console.log('deleting task');
           //add logic
        },
        'tasks.update.main' : (doc) => {
            let subTasks = [], found;
            for(let task of doc.subTasks){
                if(task.select)
                    subTasks.push(task.select);
                else{
                    if(found = Tasks.findOne(task._id)){
                        subTasks.push(task._id)
                        Tasks.update(task._id, {$set: {
                            name: task.name,
                            description: task.description,
                            type: task.type,
                            notify: !!task.notify,
                            createdAt: found.createdAt,
                        }}, (error) => {
                            console.log(error)
                            if(error)
                                throw new Meteor.Error(error.sanitizedError.error, error.invalidKeys, doc.subTasks.indexOf(task));
                        })
                    }else{
                        subTasks.push(Tasks.insert(task, (error) => {
                            console.log(error)
                            if(error)
                                throw new Meteor.Error(error.sanitizedError.error, error.invalidKeys, doc.subTasks.indexOf(task));
                        }))
                    }
                }
            }
            Tasks.update(doc.main._id, {$set: {
                name: doc.main.name,
                description: doc.main.description,
                type: doc.main.type,
                subTasks: subTasks,
                createdAt: Tasks.findOne(doc.main._id).createdAt,
            }},  (error) => {
                if(error)
                    throw new Meteor.Error(error.sanitizedError.error, error.invalidKeys, 'main');
            })
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
    },
    notify: {
        type: String,
        optional: true,
        label: 'Notify upon completion'
    }
});

Tasks.attachSchema(Tasks.schema);