import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Tasks from '../tasks/tasks';

Actions = new Meteor.Collection('actions');

Actions.userIsAttachedByAdmin = (userId, mainTaskId, adminUserId) => {
    let attachActions = Actions.find({userId, mainTaskId, adminUserId, type: 'attach'}).fetch();
    if(!attachActions.length)
        return false;
    let lastAttachActionId = attachActions[attachActions.length-1]._id;
    return ( !Actions.findOne({attachId: lastAttachActionId, type: 'deattach'}) ) ? lastAttachActionId : false ;
};

Actions.userIsAttached = (userId, mainTaskId) => {
    let attachActions = Actions.find({userId, mainTaskId, type: 'attach'}).fetch();
    if(!attachActions.length)
        return false;
    let lastAttachActionId = attachActions[attachActions.length-1]._id;
    return ( !Actions.findOne({attachId: lastAttachActionId, type: 'deattach'}) ) ? lastAttachActionId : false ;
};

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
            if(Roles.userIsInRole(adminUserId, 'admin')){
                 if(!Actions.userIsAttachedByAdmin(userId, mainTaskId, adminUserId))
                    Actions.insert({
                        userId,
                        adminUserId,
                        mainTaskId,
                        type: 'attach',
                    }, (error, result) => {
                     if(!error)
                         Meteor.users.update(userId, {$push: {'profile.attachIds': result}});
                    });
                else{
                    throw new Meteor.Error('User ' + user.profile.firstName + ' ' + user.profile.lastName + ' is already attached to this task');
                }
            }
        },
        'actions.result': (userId, mainTaskId, subTaskId, result, attachId) => {
            console.log(result)
            let adminUserId = Actions.findOne(attachId).adminUserId;
            Actions.insert({
                userId,
                mainTaskId,
                adminUserId,
                subTaskId,
                result,
                attachId,
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
        'actions.deattach': (userId, adminUserId, mainTaskId) => {
            let attachId;
            if(Roles.userIsInRole(adminUserId, 'admin'))
                if(attachId = Actions.userIsAttachedByAdmin(userId, mainTaskId, adminUserId))
                    if(Actions.find({attachId, type: {$ne: 'attach'}}).fetch().length != 0)
                        Actions.insert({
                            userId,
                            mainTaskId,
                            adminUserId,
                            attachId,
                            type: 'deattach',
                        }, (error) => {
                            if(!error)
                                Meteor.users.update(userId, {$pull: {'profile.attachIds': attachId}})
                        });
                    else
                        Actions.remove({_id: attachId},(error) => {
                            if(!error)
                                Meteor.users.update(userId, {$pull: {'profile.attachIds': attachId}})
                        });
                else
                    throw new Meteor.Error(userId + ' does not have this task attached: ' + mainTaskId);

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
        blackbox: true
    },
    attachId: {
        type: Actions,
        optional: true,
    }
});

Actions.attachSchema(Actions.schema);

export default Actions;