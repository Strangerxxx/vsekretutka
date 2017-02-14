import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import AutoForm from '../components/formInputFields/AutoForm'
import Fields from '/imports/api/fields/fields';
import { createContainer } from 'meteor/react-meteor-data';
import FormInputFields from '/imports/ui/components/formInputFields';

class TestAutoForm extends Component{
    render(){
        if(this.props.ready) {
            let schema = {
                radio: {
                    label: 'Test',
                    optional: true,
                    type: FormInputFields.RadioInput,
                }
            };

            return (
                <div>
                    <AutoForm schema={schema}/>
                </div>
            )
        } else return (<span>Loading...</span>);
    }
}
export default createContainer(()=>{
    let fieldHandle = Meteor.subscribe('fields');
    return {ready: fieldHandle.ready()}
}, TestAutoForm);