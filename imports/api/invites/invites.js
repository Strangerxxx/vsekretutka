import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default Invites = new Meteor.Collection('Invites');

Invites.allow({
    insert: function (userId) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    remove: function (userId) {
        if(Roles.userIsInRole(userId, 'admin'))
            return !!userId;
    },
    update: function (userId) {
        return !!userId;
    }
});

if(Meteor.isServer){
    Meteor.methods({
        'invites.create'(userId){
            if (Roles.userIsInRole(userId, 'admin'))
                Invites.insert({});
        },
        'invites.delete'(userId, token){
            if(Roles.userIsInRole(userId, 'admin'))
                Invites.remove({_id: token});
        },
        'invites.set-visited'(token){
            if(!(Invites.findOne({_id: token}).status == 'claimed'))
                Invites.update({_id: token}, {$set: {status: 'visited'}});
        },
        'invites.set-claimed'(token){
            Invites.update({_id: token}, {$set: {status: 'claimed'}});
        }
    });
    Meteor.publish('invites', function (userId, token) {
        if(userId == null)
            return Invites.find(token);
        else if(Roles.userIsInRole(userId, 'admin'))
            return Invites.find();
    });
}

InvitesSchema = new SimpleSchema({
    status: {
        type: String,
        allowedValues: ['invited', 'visited', 'claimed'],
        autoValue: function () {
            if(!this.isSet)
                return 'invited';
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            return new Date();
        }
    }
});

Invites.attachSchema(InvitesSchema);