import React, { Component, PropTypes} from 'react';
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import SelectFromTasks from './SelectFromTasks';
import SelectFromArray from './SelectFromArray';
import SelectFromUsers from './SelectFromUsers';
import Checkbox from './Checkbox';
export default class AutoForm extends Component{
    constructor(props) {
        super(props);
        console.log(props.schema);
        this.state = {
            fields: []
        }
    }
    render(){
        for(let key in this.props.schema){
            if(this.props.schema.hasOwnProperty(key))
                this.state.fields.push({
                    key,
                    component: this.props.schema[key].type.component
                })
        }

    }
}