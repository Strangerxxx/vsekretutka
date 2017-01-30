import React, { Component, PropTypes} from 'react';

export default class StringInput extends Component {
    constructor(props){
        super(props);
        this.changeValue = this.changeValue.bind(this);
        this.state= {
            name,
        };
        if(props.index != undefined)
            this.state.name = props.prefix + '.' + props.index + '.' + props.name;
        else
            this.state.name = props.name;
    }

    changeValue(event){
        this.props.callback(this.props.name, event.target.value);
    }

    render() {

        let props = this.props;
        return(
            <div className={this.state.class} id={props.id} name={this.state.name}>
                <label className="control-label" htmlFor={props.id}> { props.schema[props.name].label } </label>
                <input className="form-control" name={this.state.name} id={props.id} type="text" value={props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}