import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Tasks from '../tasks/tasks';

export default Actions = new Meteor.Collection('actions');

if(Meteor.isServer) {
    Meteor.publish('actions.user', (userId) => {
        if(userId)
            return Actions.find({userId});
    });
    Meteor.publish('actions.admin', (userId) => {
        if(Roles.userIsInRole(userId, 'admin'))
            return Actions.find({adminUserId: userId});
    });

    Meteor.methods({
        'actions.attach': (userId, adminUserId, MainTaskId) => {
           if(Roles.userIsInRole(adminUserId, 'admin'))
               Actions.insert({
                   userId,
                   adminUserId,
                   MainTaskId,
                   type: 'attach',
               })
        },
        'actions.result': (userId, taskId, )

    });
}

Actions.schema = new SimpleSchema({
    createdAt: {
        type: Date,
        autoValue() {
            return new Date();
        },
    },
    userId : {
        type: Meteor.users,
    },
    adminUserId: {
        type: Meteor.users,
    },
    MainTaskId: {
        type: Tasks,
    },
    type: {
        type: String,
        allowedValues: [
            'attach',
            'result',
            'return',
            'deattach',
            'continue',
        ]
    },
    message: {
        type: String,
        optional: true
    },
    subTaskId: {
        type: Tasks,
        optional: true,
    },
});

Actions.attachSchema(Actions.schema);