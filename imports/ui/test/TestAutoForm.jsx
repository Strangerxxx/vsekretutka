import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import FormInputFields from '../components/formInputFields'
export default class TestAutoForm extends Component{
    render(){
        let schema = {
            name: {
                label: 'Name',
                type: FormInputFields.TextInput
            },
            value: {
                label: 'Value',
                type: FormInputFields.TextInput
            },
        };
        return(
            <div>
                <FormInputFields.AutoForm schema={schema} />
            </div>
        )
    }
}