import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { TaskForm } from './TaskForm';

export default class AddTask extends Component{

    // createDocument(){
    //     let doc = this.state.document;
    //     let schema = Tasks.schema._schema;
    //     for(let field in schema){
    //         if(schema.hasOwnProperty(field))
    //         {
    //             if(schema[field].autoform === undefined || !schema[field].autoform.hidden)
    //                 switch(schema[field].type)
    //                 {
    //                     case String:
    //                         doc[field] = <StringInput id={Random.id()} schema={schema[field]}/>;
    //                         break;
    //                 }
    //         }
    //     }
    //             console.log(doc)
    //
    // }

    render(){
        return(
            <div className="container-fluid">
                <legend>Add Task</legend>
                <div className="row">
                    <div className="col-md-4">
                        <TaskForm/>
                    </div>
                    <div className="col-md-8">

                    </div>
                </div>
            </div>
        )
    }
}