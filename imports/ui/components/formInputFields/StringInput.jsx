import React, { Component, PropTypes} from 'react';

export default class StringInput extends Component {
    constructor(){
        super();
        this.changeValue = this.changeValue.bind(this)
    }

    componentWillMount(){
        this.state = {
            value: null,
        };
    }

    changeValue(event){
        this.state.value = event.target.value;
        console.log(this.props.index);
    }

    render() {
        let props = this.props;
        let name;
        if(props.index != undefined)
            name = props.prefix + '.' + props.index + '.' + props.name;
        else
            name = props.name;
        return(
            <div className="form-group">
                <label className="control-label" htmlFor={props.id}> { props.schema[props.name].label } </label>
                <input className="form-control" name={name} id={props.id} type="text" value={props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}