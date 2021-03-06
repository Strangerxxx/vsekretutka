import React, { Component, PropTypes} from 'react';

export default CheckboxInput = {
        label: 'Checkbox Input',
        component: class extends Component{
            constructor(props)
            {
                super(props);
                this.changeValue = this.changeValue.bind(this);
                this.state = {
                    name,
                    value: false,
                };
            }
            validate(){ // stub
                console.log(this.state.value);
                return true;
            }
            componentDidMount()
            {
                if (this.props.value)
                    this.state.value = true;
            }

            changeValue(event)
            {
                if(this.props.callback)
                    this.props.callback(this.props.name, event.target.value);
                this.state.value = !this.state.value;
                this.forceUpdate();
            }

            render()
            {
                let props = this.props;
                if (props.index != undefined)
                    this.state.name = props.prefix + '.' + props.index + '.' + props.name;
                else
                    this.state.name = props.name;
                return (
                    <div className='checkbox'>
                        <label>
                            <input
                                name={this.state.name}
                                type="checkbox"
                                value='true'
                                checked={this.state.value}
                                onChange={this.changeValue}
                            />
                            { props.label }
                        </label>
                    </div>
                )
            }
        }
}