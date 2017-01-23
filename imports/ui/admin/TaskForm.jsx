import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput} from '/imports/ui/components/formInputFields';

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput id={Random.id()} schema={schema.name}/>
                <StringInput id={Random.id()} schema={schema.description}/>
            </div>
        )
    }
}

export class TaskForm extends Component{
    render(){
        return(
            <SimpleTaskForm/>
        )
    }
}