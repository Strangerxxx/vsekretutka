import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Tasks from '../tasks/tasks';
import FormInputFields from '/imports/ui/components/formInputFields';

export default Fields = new Meteor.Collection('fields');

Fields.schema = new SimpleSchema({
    name: String,
    label: String,
    optional: Boolean,
    type: {
        type: Array
    },
    'type.$': {
        type: String // ['String'] || [fieldId1, filedId2] || [field1[], 'StringInput[]']
    },
    options: {
        type: Array,
        optional: true,
    },
    'options.$' : String,
});

Fields.attachSchema(Fields.schema);

Fields._transform = (doc)=>{
    doc.getSchema = ()=>{
        let obj = {};
        if(doc.type.length > 1){ //complicated type
            let subFieldSchema;
            for(let fieldId of doc.type){
                subFieldSchema = Fields.findOne(fieldId).getSchema();
                _.extend(obj, subFieldSchema)
            }
        } else if(doc.type.length == 1) {
            obj[doc.name] = {
                label: doc.label,
                optional: doc.optional,
                type: (()=>{
                    if(FormInputFields.hasOwnProperty(doc.type[0]))
                        return FormInputFields[doc.type[0]];
                })()
            };
        }
        return obj;
    };
    return doc;
};
if(Meteor.isServer){
    Meteor.methods({
       'fields.getSchema': (fieldId)=>{

       }
    });
    Meteor.publish('fields', ()=>Fields.find());
}
// if()

