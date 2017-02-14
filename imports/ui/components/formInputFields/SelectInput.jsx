import React, { Component, PropTypes} from 'react';

export default SelectInput = {
    label: 'Select Input',
    component: class extends Component{
        constructor(props){
            super(props);
            this.selectHandler = this.selectHandler.bind(this);
            this.state= {
                name,
                value: props.value,
            };
        }

        createOptions(){
            return null;
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
                    <select className="table-cell-select form-control" value={props.value} name={this.state.name} onChange={this.selectHandler}>
                        {this.createOptions()}
                    </select>
                </div>
            )
        }
    }
}