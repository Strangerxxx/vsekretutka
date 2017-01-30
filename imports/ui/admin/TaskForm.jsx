import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput, TextAreaInput, SelectFromTasks, SelectFromArray} from '/imports/ui/components/formInputFields';
import CompletionTypes from '/imports/ui/components/completionTypes';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

export class MainTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        let id = this.props.id;
        return(
            <div id={id}>
                {this.props.error ? <div className="alert alert-danger alert-dismissable">
                        {this.props.error}
                    </div> : ''}
                <StringInput schema={schema} id={id} value={this.props.value['name']} name="name" />
                <TextAreaInput schema={schema} id={id} value={this.props.value['description']} name="description"/>
            </div>
        )
    }
}

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index}  value={this.props.value['name']} name="name" callback={this.props.callback}/>
                <SelectFromArray array={CompletionTypes.map((item) => item.label)} schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index} callback={this.props.callback} value={this.props.value['type']} name="type"/>
                <TextAreaInput schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index} value={this.props.value['description']} name="description" callback={this.props.callback}/>
            </div>
        )
    }
}

class StepFormWrap extends Component{
    constructor(props){
        super(props);
        this.state= {
            value: props.value ? props.value : {},
        };
        this.inputChangeCallback = this.inputChangeCallback.bind(this)
    }
    inputChangeCallback(inputName, value){
        this.state.value[inputName] = value;
        this.forceUpdate()
    }
    render(){
        return(
            <li className="list-group-item">
                <div id={this.props.keyProp}>
                    <button type="button" className="btn btn-primary table-cell-plus" onClick={() => {this.props.buttonCallback(this.props.keyProp)}}><i className="fa fa-minus"/></button>
                    <div className="table-cell-select">
                        {this.props.error ? <div className="alert alert-danger alert-dismissable">
                            {this.props.error}
                        </div> : ''}
                        <this.props.component tasks={this.props.tasks} prefix='subTasks' value={this.state.value} id={this.props.keyProp} name='select' callback={this.inputChangeCallback} index={this.props.index}/>
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
                value: {}
            },
            subTasks: [],
            update: !!props.doc
        };
        this.newSubTaskButtonHandler = this.newSubTaskButtonHandler.bind(this);
        this.deleteSubTaskButtonHandler = this.deleteSubTaskButtonHandler.bind(this);
        this.changeSelectHandler = this.changeSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);

    }

    componentWillMount() {
        let tasks = this.filterTasks();
        let doc = this.props.doc;
        let subTasks = this.props.subTasks;
        if (doc && subTasks ) {
            this.state.mainTask = {
                key:doc._id,
                keyProp:doc._id,
                value: {
                    name: doc.name,
                    description: doc.description,
                }
            };
            for (let subTask of subTasks) {
                if (subTask.type == 'main'){
                    this.state.subTasks.push({
                        key:subTask._id,
                        keyProp:subTask._id,
                        component: SelectFromTasks,
                        value: subTask._id,
                        tasks: tasks,
                        error: null,
                        buttonCallback: this.deleteSubTaskButtonHandler
                    })
                }
                else{
                    this.state.subTasks.push({
                        key:subTask._id,
                        keyProp:subTask._id,
                        component: SimpleTaskForm,
                        value: {
                            name: subTask.name,
                            description: subTask.description,
                            type: subTask.type,
                        },
                        tasks: tasks,
                        error: null,
                        buttonCallback: this.deleteSubTaskButtonHandler
                    })
                }
            }
            this.forceUpdate();
        }
    }

    submitHandler(event){
        event.preventDefault();
        let form = $(event.target).serializeArray();
        console.log(form)
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
            if(value == '') value = null;
            let split = input.name.split('.');

            if(input.name == 'selectSubTasks')
                break;

            if(split[0] == 'subTasks'){
                console.log(document)
                if(document.subTasks[split[1]] == undefined)
                    document.subTasks.push({
                        _id: $('input[name="' + input.name + '"]').attr("id")
                    });
                document.subTasks[split[1]][split[2]] = value;
            }else{
                document.main[input.name] = value;
                document.main["_id"] =  $('[name="' + input.name + '"]').attr("id")
            }
        }

        if(this.validate(document, schema)){
            if(!this.state.update)
                Meteor.call('tasks.insert.main', document);
            else
                Meteor.call('tasks.update.main', document);

        }

    }

    validate(document, schema){
        const validationContext = schema.newContext();
        let pass = true;

        //Validating main task
        if(!validationContext.validate(document.main, {keys: ['name', 'description', 'type']})){
            pass = false;
            let errors = validationContext.validationErrors();
            this.state.mainTask.error = 'Please fill in fields: ' + errors.map((item) => item.name);
        }
        else{
            this.state.mainTask.error = null;
        }

        //validating subTasks
        for(let subTask of document.subTasks){
            if(!subTask.select){
                if(!validationContext.validate(subTask, {keys: ['name', 'description', 'type']})){
                    pass = false;
                    let errors = validationContext.validationErrors()
                    this.state.subTasks[document.subTasks.indexOf(subTask)].error = 'Please fill in fields: ' + errors.map((item) => item.name);
                }
                else {
                    this.state.subTasks[document.subTasks.indexOf(subTask)].error = null;
                }
            }
        }
        this.forceUpdate();
        return pass;
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
            value: {},
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
        let mainTaskForm = <MainTaskForm error={this.state.mainTask.error} value={this.state.mainTask.value} id={this.state.mainTask.keyProp}/>;
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
                                            <SelectFromTasks tasks={this.filterTasks()} id={Random.id()} name="selectSubTasks" value={0} selectCallback={this.changeSelectHandler}/>
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