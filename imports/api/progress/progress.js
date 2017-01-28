import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Tasks from '../tasks/tasks';

export default Progress = new Meteor.Collection('progress');

Progress.schema = new SimpleSchema({
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
            'completion',
            'return',
            'deattach',
        ]
    },
    message: {
        type: String,
        optional: true,
    },
    subTaskId: {
        type: Tasks,
        optional: true,
    },
    approved: {
        type: Boolean,
        optional: true,
    },
});

Progress.attachSchema(Progress.schema);