import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput, TextAreaInput, SelectFromArray} from '/imports/ui/components/formInputFields';
import CompletionTypes from '/imports/ui/components/completionTypes/';
import { Meteor } from 'meteor/meteor';

export class MainTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema
        return(
            <div className="simpleTask">
                <StringInput schema={schema} id={Random.id()} name="name" />
                <TextAreaInput schema={schema} id={Random.id()} name="description"/>
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
                <SelectFromArray tasks={schema.type.allowedValues}/>
                <TextAreaInput schema={schema} prefix={this.props.prefix} id={this.props.id} index={this.props.index} value={this.props.value} name="description"/>
            </div>
        )
    }
}

class StepFormWrap extends Component{
    render(){
        return(
            <li className="list-group-item">
                <div>
                    <button type="button" className="btn btn-primary table-cell-plus" onClick={() => {this.props.buttonCallback(this.props.keyProp)}}><i className="fa fa-minus"/></button>
                    <div className="table-cell-select">
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
        this.state = { mainTask: {}, subTasks: []};

        this.newSubTaskButtonHandler = this.newSubTaskButtonHandler.bind(this);
        this.deleteSubTaskButtonHandler = this.deleteSubTaskButtonHandler.bind(this);
        this.changeSelectHandler = this.changeSelectHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    submitHandler(event){
        event.preventDefault();
        let form = $(event.target).serializeArray();
        let document = {
            type: 'main',
            subTasks: []
        };

        for(let input of form){
            let value = input.value;
            value = value.trim();
            let split = input.name.split('.');

            if(input.name == 'selectSubTasks')
                break;

            if(value == '' || value == 0 ){
                $('[name =' + '"' + input.name + '"' +']').parent().addClass('has-error');
            }

            if(split[0] == 'subTasks'){
                if(document.subTasks[split[1]] == undefined)
                    document.subTasks.push({
                        type: 'simple',
                    });
                document.subTasks[split[1]][split[2]] = value;
            }else
                document[input.name] = value;


        }
        console.log($('form').serialize());
        Meteor.call('tasks.insert.main', document);
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
            buttonCallback: this.deleteSubTaskButtonHandler
        }));
    }

    changeSelectHandler(value){
        let tasks = this.filterTasks();
        let id= Random.id();
        this.setState(() => this.state.subTasks.push({
            key:id,
            keyProp:id,
            component: SelectFromArray,
            value:value,
            tasks: tasks,
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
               buttonCallback={item.buttonCallback}/>
        });

        return(
            <div className="task-form-body">
                <form onSubmit={this.submitHandler}>
                    <div className="col-md-5">
                        <MainTaskForm/>
                    </div>
                    <div className="col-md-7">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h5>Sub-tasks</h5>
                            </div>
                            <ul className="list-group">
                                {subTasks}
                                <li className="list-group-item">
                                    <div>
                                        <button type="button" className="btn btn-primary table-cell-plus" onClick={this.newSubTaskButtonHandler}><i className="fa fa-plus"/></button>
                                        <div className="table-cell-select">
                                            <SelectFromArray tasks={this.filterTasks()} name="selectSubTasks" value={0} selectCallback={this.changeSelectHandler}/>
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