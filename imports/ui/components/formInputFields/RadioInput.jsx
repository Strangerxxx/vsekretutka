import React, { Component, PropTypes} from 'react';

export default RadioInput = {
    label: 'Radio Input',
    component: class extends Component{
        constructor(props){
            super(props);
            this.selectHandler = this.selectHandler.bind(this);
            this.state= {
                name,
                value: props.value,
            };
        }
        validate(){ // stub
            console.log(this.state.value);
            return true;
        }
        createOptions(){
            let output = [];
            if(this.props.options)
                for(let option of this.props.options){
                    output.push(
                        <div className="radio" key={option.value}>
                            <label><input type="radio" value={option.value} name={this.state.name} onChange={this.selectHandler}/>{option.label}</label>
                        </div>);
                }
            return output;
        }

        selectHandler(event){
            let select = event.target;
            if(this.props.callback){
                this.props.callback(this.props.name, event.target.value);
            }
            if(this.props.selectCallback && select.selectedIndex != 0){
                this.props.selectCallback(select.options[select.selectedIndex].value);
                select.selectedIndex=0;
            }
            this.state.value = event.target.value;
            this.setState(this.state);
        }

        render() {
            let props = this.props;
            if(props.index != undefined)
                this.state.name = props.prefix + '.' + props.index + '.' + props.name;
            else
                this.state.name = props.name;

            return(
                <div>
                    {props.label ? <label className="control-label"> { props.label } </label> : ''}
                    {this.createOptions()}
                </div>
            )
        }
    }
}