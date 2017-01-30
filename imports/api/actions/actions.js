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
        'actions.attach': (userId, adminUserId, mainTaskId) => {
            console.log(userId,adminUserId,mainTaskId)
           if(Roles.userIsInRole(adminUserId, 'admin')){
               if(!Actions.findOne(userId, mainTaskId) || (Actions.findOne({userId, mainTaskId, type: 'attach'}) && Actions.findOne({userId, mainTaskId, type: 'deattach'}) ) )
                   Actions.insert({
                       userId,
                       adminUserId,
                       mainTaskId,
                       type: 'attach',
                   });
               else{
                   let user = Meteor.users.findOne(userId);
                   throw new Meteor.Error('User ' + user.profile.firstName + ' ' + user.profile.lastName + ' is already attached to this task');
               }
           }
        },
        'actions.result': (userId, mainTaskId, adminUserId, subTaskId, result) => {
            Actions.insert({
                userId,
                mainTaskId,
                adminUserId,
                subTaskId,
                result,
                type: 'result'
            });
        },
        'actions.return': (userId, mainTaskId, adminUserId, subTaskId, message) => {
            Actions.insert({
                userId,
                mainTaskId,
                adminUserId,
                subTaskId,
                message,
                type: 'return'
            });
        },
        'actions.deattach': (userId, mainTaskId, adminUserId) => {
            Actions.insert({
                userId,
                mainTaskId,
                adminUserId,
                type: 'deattach',
            })
        },
        'actions.continue': (userId, mainTaskId, adminUserId, subTaskId, message) => {
            Actions.insert({
                userId,
                mainTaskId,
                adminUserId,
                subTaskId,
                message,
                type: 'continue'
            })
        }

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
    mainTaskId: {
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
    result: {
        type: Object,
        optional: true,
    }
});

Actions.attachSchema(Actions.schema);