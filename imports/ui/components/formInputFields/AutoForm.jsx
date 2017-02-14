import React, { Component, PropTypes} from 'react';
export default class AutoForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            fields: []
        };
        this.inputs = {};
        this.submitHandler = this.submitHandler.bind(this);
    }
    submitHandler(event){
        event.preventDefault();
        let doc = {};
        for(let key in this.props.schema){
            if(this.props.schema.hasOwnProperty(key)) {
                if(this.inputs.hasOwnProperty(key)){
                    if(!this.inputs[key].validate()) console.log('error in '+key+' input');
                    else doc[key] = this.inputs[key].state.value;
                }
            }
        }
        this.props.onSuccess(doc);
    }
    render(){
        let input;
        for(let key in this.props.schema){
            if(this.props.schema.hasOwnProperty(key)){
                input = this.props.schema[key];
                this.state.fields.push(<input.type.component ref={(input)=>{this.inputs[key] = input}} key={key} label={input.label} name={key} options={input.options}/>);
            }
        }
        return(
            <div className={this.props.class}>
                <form onSubmit={this.submitHandler}>
                    {this.state.fields}
                    <input className="btn btn-primary" type="submit"/>
                </form>
            </div>
        );
    }
}