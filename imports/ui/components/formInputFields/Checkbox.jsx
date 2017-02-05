import React, { Component, PropTypes} from 'react';

export default class Checkbox extends Component{
    constructor(props){
        super(props);
        this.changeValue = this.changeValue.bind(this);
        this.state = {
            name,
            checked: false,
        };
    }

    componentDidMount(){
        if(this.props.value)
            this.state.checked = true;
    }

    changeValue(event){
        this.props.callback(this.props.name, event.target.value);
        this.state.checked = !this.state.checked;
        this.forceUpdate();
    }

    render() {
        let props = this.props;
        if(props.index != undefined)
            this.state.name = props.prefix + '.' + props.index + '.' + props.name;
        else
            this.state.name = props.name;
        return(
            <div className='checkbox' id={props.id} name={this.state.name}>
                <label><input name={this.state.name} id={props.id} type="checkbox" value='true' checked={this.state.checked} onChange={this.changeValue}/>{ props.schema[props.name].label }</label>
            </div>
        )
    }
}