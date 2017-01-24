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

class TaskSelectedFormWrap extends Component{
    render() {
        return(
            <li className="list-group-item">
                <div>
                    <button type="button" className="btn btn-primary table-cell-plus" onClick={this.newSubTaskButtonHandler}><i className="fa fa-plus"/></button>
                    <div className="table-cell-select">
                        <SelectSubTasks tasks={this.props.tasks} value={this.props.value}/>
                    </div>
                </div>
            </li>
        )
    }
}

export default class TaskForm extends Component{
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

    deleteSubTaskButtonHandler(id) {
        let toDelete;

        this.state.subTasks.map((item, index) => {
            if(item.key == id)
                toDelete = index;
        });
        this.state.subTasks.splice(toDelete, 1);
        this.forceUpdate();
    }

    newSubTaskButtonHandler(){
        let id= Random.id();
        this.setState(() => this.state.subTasks.push(<SimpleTaskFormWrap key={id} keyProp={id} buttonCallback={this.deleteSubTaskButtonHandler}/>));
        console.log(this.state)
    }

    changeSelectHandler(event){
        console.log(event.target.value)
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
                                            <SelectSubTasks tasks={this.props.tasks} value={0} selectCallback={this.changeSelectHandler}/>
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