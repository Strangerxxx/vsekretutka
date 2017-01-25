import React, { Component, PropTypes} from 'react';
import Tasks from '/imports/api/tasks/tasks';
import {StringInput, TextAreaInput, SelectSubTasks} from '/imports/ui/components/formInputFields';
import { Meteor } from 'meteor/meteor';

export class MainTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput schema={schema} name="name"/>
                <TextAreaInput schema={schema} name="description"/>
            </div>
        )
    }
}

export class SimpleTaskForm extends Component{
    render(){
        let schema = Tasks.schema._schema;
        return(
            <div className="simpleTask">
                <StringInput schema={schema} prefix={this.props.prefix} index={this.props.index} name="name"/>
                <TextAreaInput schema={schema} prefix={this.props.prefix} index={this.props.index} name="description"/>
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
                        <this.props.component tasks={this.props.tasks} prefix='subTasks' value={this.props.value} name='select' callback={this.props.callback} index={this.props.index}/>
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
    }

    submitHandler(event){
        event.preventDefault();
        let form = $(event.target).serializeArray();
        let document = {
            subTasks: []
        };

        for(let input of form){
            let value = input.value;
            value = value.trim();
            let split = input.name.split('.');

            if(input.name == 'selectSubTasks')
                break;

            if(value == '' || value == 0 ){
                throw new Meteor.Error(input, 'empty');
            }

            if(split[0] == 'subTasks'){
                if(document.subTasks[split[1]] == undefined)
                    document.subTasks.push({});
                document.subTasks[split[1]][split[2]] = value;
            }else
                document[input.name] = value;
        }

        Meteor.call('tasks.insert.main', document);
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
            tasks: this.props.tasks,
            buttonCallback: this.deleteSubTaskButtonHandler
        }));
    }

    changeSelectHandler(value){
        let tasks = this.props.tasks;
        let id= Random.id();
        this.setState(() => this.state.subTasks.push({
            key:id,
            keyProp:id,
            component: SelectSubTasks,
            value:value,
            tasks: tasks,
            buttonCallback: this.deleteSubTaskButtonHandler
        }));
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
                                            <SelectSubTasks tasks={this.props.tasks} name="selectSubTasks" value={0} selectCallback={this.changeSelectHandler}/>
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