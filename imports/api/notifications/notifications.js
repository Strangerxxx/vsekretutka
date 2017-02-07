import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

export const Notifications = new Meteor.Collection('notifications');

if(Meteor.isServer){
    Meteor.publish('notifications', (userId) => {
        return Notifications.find();
    })
}

Notifications.allow({
    insert: function (userId) {
        return !!userId;
    },
    remove: function (userId) {
        if(Roles.userHasRole(userId, 'admin'))
            return !!userId;
    },
    update: function (userId) {
        if(Roles.userHasRole(userId, 'admin'))
            return !!userId;
    }
});

AffectedSchema = new SimpleSchema({
    id: {
        type: String,
    },
    seen: {
        type: Array,
    },
    'seen.$': Meteor.users,

});

NotificationsSchema = new SimpleSchema({
    seen: {
        type: Boolean,
        autoValue: function () {
            if(!this.isSet)
                return false;
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if(this.isInsert)
                return new Date();
        }
    },
    href: {
        type: String,
        optional: true,
    },
    affected: {
        type: Array,
    },
    'affected.$': {
        type: String,
    },
});


if(Meteor.isServer){
    Meteor.methods({
        'notifications.create': () => {
            Notifications.insert({text: 'test notification!'});
        },
        'notifications.mark-seen':(_id) => {
            Notifications.update({_id: _id}, {$set: {seen: true}});
        },
        'notifications.remove': (_id) => {
            Notifications.remove({_id: _id});
        },
        'notifications.remove.all': () => {
            Notifications.remove({});
        }
    });
}

Notifications.attachSchema(NotificationsSchema);
