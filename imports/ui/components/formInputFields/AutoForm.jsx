import React, { Component, PropTypes} from 'react';
export default class AutoForm extends Component{
    constructor(props) {
        super(props);
        console.log(props.schema);
        this.state = {
            fields: []
        }
    }
    render(){
        let input;
        for(let key in this.props.schema){
            if(this.props.schema.hasOwnProperty(key)){
                input = this.props.schema[key];
                this.state.fields.push(<input.type.component key={key} label={input.label} name={key} />);
            }
        }
        return(
            <div className={this.props.class}>
                <form>
                    {this.state.fields}
                </form>
            </div>
        );
    }
}