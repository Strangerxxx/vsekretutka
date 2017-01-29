import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput, TextAreaInput, SelectFromTasks, SelectFromArray} from '/imports/ui/components/formInputFields';
import CompletionTypes from '/imports/ui/components/completionTypes';
import { Meteor } from 'meteor/meteor';

export class MainTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        let id = Random.id();
        return(
            <div id={id} className={this.props.error ? 'has-error' : '' + "mainTask"}>
                {this.props.error ? <div className="alert alert-danger alert-dismissable">
                        {this.props.error}
                    </div> : ''}
                <StringInput schema={schema} id={id} name="name" />
                <TextAreaInput schema={schema} id={id} name="description"/>
            </div>
        )
    }
}

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index}  value={this.props.value} name="name"/>
                <SelectFromArray array={CompletionTypes.map((item) => item.label)} schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index}  value={this.props.value} name="type"/>
                <TextAreaInput schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index} value={this.props.value} name="description"/>
            </div>
        )
    }
}

class StepFormWrap extends Component{
    render(){
        return(
            <li className="list-group-item">
                <div className={this.props.error ? 'has-error' : ''} id={this.props.keyProp}>
                    <button type="button" className="btn btn-primary table-cell-plus" onClick={() => {this.props.buttonCallback(this.props.keyProp)}}><i className="fa fa-minus"/></button>
                    <div className="table-cell-select">
                        {this.props.error ? <div className="alert alert-danger alert-dismissable">
                            {this.props.error}
                        </div> : ''}
                        <this.props.component tasks={this.props.tasks} prefix='subTasks' value={this.props.value} id={this.props.keyProp} name='select' callback={this.props.callback} index={this.props.index}/>
                    </div>
                </div>
            </li>
        )
    }
}

export default class TaskForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            mainTask: {

            },
            subTasks: []
        };

        this.newSubTaskButtonHandler = this.newSubTaskButtonHandler.bind(this);
        this.deleteSubTaskButtonHandler = this.deleteSubTaskButtonHandler.bind(this);
        this.changeSelectHandler = this.changeSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    submitHandler(event){
        event.preventDefault();
        let form = $(event.target).serializeArray();
        let schema = Tasks.schema;
        let document = {
            main: {
                type: 'main',
            },
            subTasks: []
        };
        for(let input of form){
            let value = input.value;
            value = value.trim();
            let split = input.name.split('.');

            if(input.name == 'selectSubTasks')
                break;

            if(split[0] == 'subTasks'){
                if(document.subTasks[split[1]] == undefined)
                    document.subTasks.push({});
                document.subTasks[split[1]][split[2]] = value;
            }else
                document.main[input.name] = value;
        }

        Meteor.call('tasks.insert.main', document, (error, result) => {
            if(error)
                this.errorHandler(error);
        });
    }


    errorHandler(error){
        let indexOfSubTask = error.details;
        console.log(error)
        if(indexOfSubTask == 'main')
            this.state.mainTask.error = "Please fill in the fields: " + error.reason.map((item) => item.name);
        else
            this.state.subTasks[indexOfSubTask].error = "Please fill in the fields: " + error.reason.map((item) => item.name);
        this.forceUpdate();
    }

    emptyForm(){
        this.state.subTasks = [];
        this.forceUpdate();
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
        this.setState(() => this.state.subTasks.push({
            key:id,
            keyProp:id,
            component: SimpleTaskForm,
            tasks: this.filterTasks(),
            buttonCallback: this.deleteSubTaskButtonHandler,
            error: null,
        }));
    }

    changeSelectHandler(value){
        let tasks = this.filterTasks();
        let id= Random.id();
        this.setState(() => this.state.subTasks.push({
            key:id,
            keyProp:id,
            component: SelectFromTasks,
            value:value,
            tasks: tasks,
            error: null,
            buttonCallback: this.deleteSubTaskButtonHandler
        }));
    }

    filterTasks() {
        return this.props.tasks.filter((task) => (task.type == 'main'));
    }

    render(){
        let subTasks = this.state.subTasks.map((item, index) => {
           return <StepFormWrap
               key={item.key}
               keyProp={item.key}
               component={item.component}
               index={index}
               tasks={item.tasks}
               value={item.value}
               buttonCallback={item.buttonCallback}
               error={item.error}
           />
        });
        let mainTaskForm = <MainTaskForm error={this.state.mainTask.error}/>;

        return(
            <div className="task-form-body">
                <form onSubmit={this.submitHandler}>
                    <div className="col-md-5">
                        {mainTaskForm}
                    </div>
                    <div className="col-md-7">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">Sub-tasks</h4>
                            </div>
                            <ul className="list-group">
                                {subTasks}
                                <li className="list-group-item">
                                    <div>
                                        <button type="button" className="btn btn-primary table-cell-plus" onClick={this.newSubTaskButtonHandler}><i className="fa fa-plus"/></button>
                                        <div className="table-cell-select">
                                            <SelectFromTasks tasks={this.filterTasks()} name="selectSubTasks" value={0} selectCallback={this.changeSelectHandler}/>
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