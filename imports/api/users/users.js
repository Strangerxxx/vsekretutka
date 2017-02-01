import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Actions from '../actions/actions';

Schema = {};

Meteor.users.allow({
    update: (userId) => {
        if(Roles.userIsInRole(userId , 'admin'))
            return !!userId;
    }
});

Schema.UserProfile = new SimpleSchema({
    nickname: {
        type: String,
        label: 'Nickname',
        optional: true
    },
    firstName: {
        type: String,
        label: "First Name",
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    invite: {
        type: String,
        unique: true
    },
    attachIds: {
        type: Array,
        optional: true,
    },
    'attachIds.$' : Actions,
});

Schema.User = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    "emails.$.verified": {
        type: Boolean
    },
    // Use this registered_emails field if you are using splendido:meteor-accounts-emails-field / splendido:meteor-accounts-meld
    registered_emails: {
        type: Array,
        optional: true,
    },
    'registered_emails.$': {
        type: Object,
        blackbox: true
    },
    createdAt: {
        type: Date,
    },
    profile: {
        type: Schema.UserProfile,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    // roles: {
    //     type: Object,
    //     optional: true,
    //     blackbox: true
    // },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true,
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});

Schema.newUser = new SimpleSchema({
    email: {
        type: String,
        regEx: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    password: {
        type: String
    },
    profile: {
        type: Schema.UserProfile
    },
});

Meteor.users.attachSchema(Schema.User);

if(Meteor.isServer){
    Meteor.publish("users", function () {
        let query;
        if(Roles.userIsInRole(this.userId, 'root'))
            query = {};
        else if(Roles.userIsInRole(this.userId, 'admin'))
            query = {roles: {$nin: ['admin']}};
        else
            query = {_id: this.userId};
        return Meteor.users.find(query, {fields: {emails: 1, profile: 1, createdAt: 1, roles: 1}});
    });

    Meteor.publish("currentUser", function () {
       return Meteor.users.find(this.userId);
    });

    Meteor.methods({
        'users.create': (doc) => {
            let userId = Accounts.createUser({
                email: doc.email,
                password: doc.password,
                profile: doc.profile
            });
            let _variables = [];

            for(let _var in doc.variables){
                if(doc.variables.hasOwnProperty(_var))
                    _variables.push({
                        name: _var,
                        value: doc.variables[_var],
                        user: userId,
                    });
            }

            Meteor.call('variables.add', _variables);
            // if(userId === undefined) throw new Meteor.Error(403, 'Access denied!');
            return Meteor.call('users.createToken', userId);
        },
        'users.createToken': (userId)=>{
            let stampedLoginToken = Accounts._generateStampedLoginToken();
            Accounts._insertLoginToken(userId, stampedLoginToken);
            return stampedLoginToken.token;
        },
        'users.delete': function (userId) {
            if(Roles.userIsInRole(this.userId, 'admin') && this.userId != userId)
                Meteor.users.remove({_id: userId});
        }
    });
}
