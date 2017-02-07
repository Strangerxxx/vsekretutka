import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Tasks from '../tasks/tasks';

Fields = new Meteor.Collection('fields');

Fields.schema = new SimpleSchema({
    name: String,
    label: String,
    optional: Boolean,
    type: {
        type: Array
    },
    'type.$': {
        type: String // ['String'] || [fieldId1, filedId2]
    }

});
// if()

export default Fields;