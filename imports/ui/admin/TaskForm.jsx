import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import FormInputFields from '/imports/ui/components/formInputFields';
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
                <FormInputFields.TextInput.component label={schema.name.label} id={id} value={this.props.value['name']} name="name" />
                <FormInputFields.TextAreaInput.component label={schema.description.label} id={id} value={this.props.value['description']} name="description"/>
            </div>
        )
    }
}

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <FormInputFields.TextInput.component label={schema.name.label} value={this.props.value['name']} name={this.props.prefix + '.' + this.props.index + '.name'}/>
                <FormInputFields.SelectFromArray.component  options={CompletionTypes.map((item) => obj = {label: item.label, value: item.label})} label={schema.type.label} value={this.props.value['type']} name={this.props.prefix + "." + this.props.index + ".type"}/>
                <FormInputFields.TextAreaInput.component label={schema.description.label} value={this.props.value['description']} name={this.props.prefix + '.' + this.props.index + '.description'}/>
                <FormInputFields.CheckboxInput.component label={schema.notify.label} value={this.props.value['notify']} name={this.props.prefix + '.' + this.props.index + '.notify'} />
            </div>
        )
    }
}

class StepFormWrap extends Component{
    constructor(props){
        super(props);
        this.drop = this.drop.bind(this);
        this.dragStart = this.dragStart.bind(this);
    }

    dragEnter(event){
        event.preventDefault();
        if(!$(event.target).is('div'))
            return;
        console.log(event.dataTransfer.getData('text'))
        $(event.target).addClass('on-drag-over');
    }

    dragLeave(event){
        event.preventDefault();
        if(!$(event.target).is('div'))
            return;
        $(event.target).removeClass('on-drag-over');
    }

    drop(event){
        event.preventDefault();
        let droppedDiv = event.dataTransfer.getData('text');
        let target = this.props.index;
        $(event.nativeEvent.target).removeClass('on-drag-over');
        this.props.dropCallback(droppedDiv, target);
    }

    dragStart(event){
        event.dataTransfer.setData('text', this.props.index);
    }

    render(){
        return(
            <li className="list-group-item" >
                <div id={this.props.keyProp} className="draggable-mouse" draggable="true" onDragStart={this.dragStart} onDragEnter={this.dragEnter} onDragOver={(event)=>event.preventDefault()} onDragLeave={this.dragLeave} onDrop={this.drop}>
                    <button type="button" className="btn btn-primary table-cell-plus" onClick={() => {this.props.buttonCallback(this.props.index)}}><i className="fa fa-minus"/></button>
                    <div className="table-cell-select">
                        {this.props.error ? <div className="alert alert-danger alert-dismissable">
                            {this.props.error}
                        </div> : ''}
                        <this.props.component tasks={this.props.tasks} prefix='subTasks' value={this.props.value} name='select' index={this.props.index}/>
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
                key: Random.id(),
                value: {}
            },
            subTasks: [],
            update: !!props.doc
        };
        this.newSubTaskButtonHandler = this.newSubTaskButtonHandler.bind(this);
        this.deleteSubTaskButtonHandler = this.deleteSubTaskButtonHandler.bind(this);
        this.changeSelectHandler = this.changeSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.dropCallback = this.dropCallback.bind(this);

    }

    componentWillMount() {
        let tasks = this.filterTasks();
        let doc = this.props.doc;
        let subTasks = this.props.subTasks;
        if (doc && subTasks ) {
            this.state.mainTask = {
                key:doc._id,
                value: {
                    name: doc.name,
                    description: doc.description,
                }
            };
            for (let subTask of subTasks) {
                if (subTask.type == 'main'){
                    this.state.subTasks.push({
                        key:subTask._id,
                        component: SelectFromTasks,
                        value: subTask._id,
                        tasks: tasks,
                        error: null,
                        buttonCallback: this.deleteSubTaskButtonHandler,
                        dropCallback: this.dropCallback,
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
                            notify: subTask.notify
                        },
                        error: null,
                        buttonCallback: this.deleteSubTaskButtonHandler,
                        dropCallback: this.dropCallback,
                    })
                }
            }
            this.forceUpdate();
        }
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
            if(value == '') value = null;
            let split = input.name.split('.');

            if(input.name == 'selectSubTasks')
                break;

            if(split[0] == 'subTasks'){
                if(document.subTasks[split[1]] == undefined)
                    document.subTasks.push({
                        _id: this.state.subTasks[split[1]].key,
                    });
                if(split[2] == 'notify')
                    value = !!value;
                document.subTasks[split[1]][split[2]] = value;
            }else{
                document.main[input.name] = value;
                document.main["_id"] =  this.state.mainTask.key;
            }
        }

        console.log(form);
        // if(this.validate(document, schema)){
        //     if(!this.state.update)
        //         Meteor.call('tasks.insert.main', document, (error) => {
        //             console.log(error)
        //         });
        //     else
        //         Meteor.call('tasks.update.main', document);
        // }

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

    deleteSubTaskButtonHandler(index) {
        this.state.subTasks.splice(index, 1);
        this.forceUpdate();
    }

    newSubTaskButtonHandler(){
        let id= Random.id();
        this.setState(() => this.state.subTasks.push({
            key:id,
            keyProp:id,
            component: SimpleTaskForm,
            buttonCallback: this.deleteSubTaskButtonHandler,
            error: null,
            value: {},
            dropCallback: this.dropCallback,
        }));
    }

    dropCallback(droppedDiv, dropTarget){
        let subTasks = this.state.subTasks;
        let targetElement = subTasks[droppedDiv];
        if(droppedDiv < dropTarget){
            let sliced = subTasks.slice(dropTarget+1);
            subTasks.splice(dropTarget+1);
            subTasks.splice(droppedDiv, 1);
            subTasks.push(targetElement);
            subTasks = subTasks.concat(sliced);
        }
        else{
            subTasks.splice(droppedDiv, 1);
            let sliced = subTasks.slice(dropTarget);
            subTasks.splice(dropTarget);
            subTasks.push(targetElement);
            subTasks = subTasks.concat(sliced);
            console.log(subTasks)
        }
        this.state.subTasks = subTasks;
        this.forceUpdate();
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
            buttonCallback: this.deleteSubTaskButtonHandler,
            dropCallback: this.dropCallback,
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
               dropCallback={item.dropCallback}
               error={item.error}
           />
        });
        let mainTaskForm = <MainTaskForm error={this.state.mainTask.error} value={this.state.mainTask.value} id={this.state.mainTask.key}/>;
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
                                            <FormInputFields.SelectFromTasks tasks={this.filterTasks()} id={Random.id()} name="selectSubTasks" value={0} selectCallback={this.changeSelectHandler}/>
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