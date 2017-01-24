import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput, TextAreaInput, SelectSubTasks} from '/imports/ui/components/formInputFields';

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput id={Random.id()} schema={schema.name}/>
                <TextAreaInput id={Random.id()} schema={schema.description}/>
            </div>
        )
    }
}

export class TaskForm extends Component{
    constructor(props){
        super(props);
        this.state = { mainTask: {}, subTasks: []};
    }

    render(){
        return(
            <div className="task-form-body">
                <div className="col-md-5">
                    <SimpleTaskForm/>
                </div>
                <div className="col-md-7">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h5>Sub-tasks</h5>
                        </div>
                        <ul className="list-group">
                            <li className="list-group-item">
                                <div>
                                    <button className="btn btn-primary table-cell-plus"><i className="fa fa-plus"/></button>
                                    <div className="table-cell-select">
                                        <SelectSubTasks tasks={Tasks.find().fetch()}/>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-12">
                    <button className="btn btn-primary">Submit</button>
                </div>
            </div>
        )
    }
}