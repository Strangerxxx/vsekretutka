import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

export default Invites = new Meteor.Collection('invites');

Invites.allow({
    insert: function (userId) {
        if(Roles.userHasRole(userId, 'admin'))
            return !!userId;
    },
    remove: function (userId) {
        if(Roles.userHasRole(userId, 'admin'))
            return !!userId;
    },
    update: function (userId) {
        return !!userId;
    }
});

if(Meteor.isServer){
    Meteor.methods({
        'invites.create'(userId){
            if (Roles.userHasRole(userId, 'admin'))
                Invites.insert({});
        },
        'invites.delete'(userId, token){
            if(Roles.userHasRole(userId, 'admin'))
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
    Meteor.publish('invites', function (token) {
        if(this.userId == null)
            return Invites.find(token);
        else if(Roles.userHasRole(this.userId, 'admin'))
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