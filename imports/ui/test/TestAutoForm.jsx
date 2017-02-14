import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from '../components/formInputFields/AutoForm'
import Fields from '/imports/api/fields/fields';
import { createContainer } from 'meteor/react-meteor-data';
import FormInputFields from '/imports/ui/components/formInputFields';

class TestAutoForm extends Component{
    onSuccess(doc){
        console.log(doc);
    }
    render(){
        if(this.props.ready) {
            let schema = {
                radio: {
                    label: 'Radio optional',
                    optional: true,
                    type: FormInputFields.RadioInput,
                    options: [{value: 'female', label: 'Female'}, {value: 'male', label: 'Male'}]
                },
                checkbox: {
                    label: 'Checkbox',
                    type: FormInputFields.CheckboxInput,
                    optional: true
                },
                text: {
                    label: 'Text',
                    type: FormInputFields.TextInput,
                },
                textArea: {
                    label: 'TextArea',
                    type: FormInputFields.TextAreaInput,
                },
                select: {
                    label: 'Select',
                    type: FormInputFields.SelectFromArray,
                    options: [
                        {
                            label: 'Ketchup',
                            value: 'ketchup',
                        },
                        {
                            label: 'Mustard',
                            value: 'mustard',
                        },
                        {
                            label: 'Мазик',
                            value: 'mayonnaise',
                        },
                    ]
                },

            };

            return (
                <div>
                    <AutoForm schema={schema} onSuccess={this.onSuccess}/>
                </div>
            )
        } else return (<span>Loading...</span>);
    }
}
export default createContainer(()=>{
    let fieldHandle = Meteor.subscribe('fields');
    return {ready: fieldHandle.ready()}
}, TestAutoForm);