import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput, TextAreaInput, SelectSubTasks} from '/imports/ui/components/formInputFields';

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput id={Random.id()} schema={schema.name} name="name"/>
                <TextAreaInput id={Random.id()} schema={schema.description} name="description"/>
            </div>
        )
    }
}

class SimpleTaskFormWrap extends Component{
    constructor(){
        super();
    }

    render(){
        return(
            <li className="list-group-item">
                <div>
                    <button type="button" className="btn btn-primary table-cell-plus" onClick={() => {this.props.buttonCallback(this.props.keyProp)}}><i className="fa fa-minus"/></button>
                    <div className="table-cell-select">
                        <SimpleTaskForm/>
                    </div>
                </div>
            </li>
        )
    }
}

export class TaskForm extends Component{
    constructor(props){
        super(props);
        this.state = { mainTask: {}, subTasks: []};

        this.newSubTaskButtonHandler = this.newSubTaskButtonHandler.bind(this);
        this.deleteSubTaskButtonHandler = this.deleteSubTaskButtonHandler.bind(this);
    }

    submitHandler(event){
        event.preventDefault();
        console.log($(event.target).serialize())
    }

    deleteSubTaskButtonHandler(index) {
        this.setState(() => this.state.subTasks.splice(index))
    }


    newSubTaskButtonHandler(){
        this.setState(() => this.state.subTasks.push(<SimpleTaskFormWrap key={this.state.subTasks.length} keyProp={this.state.subTasks.length} buttonCallback={this.deleteSubTaskButtonHandler}/>));
    }

    render(){
        return(
            <div className="task-form-body">
                <form onSubmit={this.submitHandler}>
                    <div className="col-md-5">
                        <SimpleTaskForm/>
                    </div>
                    <div className="col-md-7">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h5>Sub-tasks</h5>
                            </div>
                            <ul className="list-group">
                                {this.state.subTasks}
                                <li className="list-group-item">
                                    <div>
                                        <button type="button" className="btn btn-primary table-cell-plus" onClick={this.newSubTaskButtonHandler}><i className="fa fa-plus"/></button>
                                        <div className="table-cell-select">
                                            <SelectSubTasks tasks={Tasks.find().fetch()}/>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}