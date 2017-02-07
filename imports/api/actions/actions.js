import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Tasks from '../tasks/tasks';

Actions = new Meteor.Collection('actions');

Actions.userIsAttachedByAdmin = (userId, mainTaskId, adminUserId) => {
    let attachActions = Actions.find({userId : adminUserId, 'data.mainTaskId': mainTaskId, 'data.userId': userId, type: 'attach'}).fetch();
    if(!attachActions.length)
        return false;
    let lastAttachActionId = attachActions[attachActions.length-1]._id;
    return ( !Actions.findOne({'data.attachId': lastAttachActionId, type: 'deattach'}) ) ? lastAttachActionId : false ;
};

Actions.userIsAttached = (userId, mainTaskId) => {
    let attachActions = Actions.find({'data.userId': userId, 'data.mainTaskId': mainTaskId, type: 'attach'}).fetch();
    if(!attachActions.length)
        return false;
    let lastAttachActionId = attachActions[attachActions.length-1]._id;
    return ( !Actions.findOne({attachId: lastAttachActionId, type: 'deattach'}) ) ? lastAttachActionId : false ;
};

if(Meteor.isServer) {
    Meteor.publish('actions.user', (userId) => {
        if(userId)
            return Actions.find({$or : [ {userId: userId}, {'data.userId': userId} ] });
    });
    Meteor.publish('actions.admin', (userId) => {
        if(Roles.userHasRole(userId, 'admin'))
            return Actions.find({ $or : [ {userId: userId}, {'data.adminUserId': userId} ] });
    });

    Meteor.methods({
        'actions.attach': (userId, adminUserId, mainTaskId) => {
            if(Roles.userHasRole(adminUserId, 'admin')){
                 if(!Actions.userIsAttachedByAdmin(userId, mainTaskId, adminUserId))
                    Actions.insert({
                        userId: adminUserId,
                        type: 'attach',
                        data: {
                            mainTaskId,
                            userId,
                        }
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
            let adminUserId = Actions.findOne(attachId).userId;
            Actions.insert({
                userId,
                type: 'result',
                data: {
                    mainTaskId,
                    adminUserId,
                    subTaskId,
                    result,
                    attachId,
                },
            });
        },
        'actions.return': (userId, mainTaskId, adminUserId, subTaskId, attachId, resultId, message) => {
            Actions.insert({
                userId: adminUserId,
                type: 'return',
                data: {
                    mainTaskId,
                    userId,
                    subTaskId,
                    message,
                    attachId,
                    resultId,
                },
            });
        },
        'actions.deattach': (userId, adminUserId, mainTaskId) => {
            let attachId;
            if(Roles.userHasRole(adminUserId, 'admin'))
                if(attachId = Actions.userIsAttachedByAdmin(userId, mainTaskId, adminUserId))
                    if(Actions.find({'data.attachId' : attachId, type: {$ne: 'attach'}}).fetch().length != 0)
                        Actions.insert({
                            userId: adminUserId,
                            type: 'deattach',
                            data: {
                                mainTaskId,
                                userId,
                                attachId,
                            },
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
        'actions.continue': (userId, mainTaskId, adminUserId, subTaskId, attachId, resultId, message) => {
            Actions.insert({
                userId: adminUserId,
                type: 'continue',
                data: {
                    mainTaskId,
                    userId,
                    subTaskId,
                    attachId,
                    resultId,
                    message,
                },
            })
        }

    });
}

schema = new SimpleSchema({
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
    },
    resultId: {
        type: Actions,
        optional: true,
    }
});

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
    data: {
        type: Object,
        blackbox: true,
    }
});

Actions.attachSchema(Actions.schema);

export default Actions;