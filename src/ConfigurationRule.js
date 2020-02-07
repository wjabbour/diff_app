import React, { Component } from 'react';

export default class ConfigurationRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            segmentName: "",
            ignoreField: ""
        }
        this.onChangeRuleInput = this.onChangeRuleInput.bind(this);
        this.onChangeSegmentName = this.onChangeSegmentName.bind(this);
        this.onChangeIgnoreField = this.onChangeIgnoreField.bind(this);
        this.onRemoveRuleInput = this.onRemoveRuleInput.bind(this);
    }

    onChangeSegmentName(e) {
        this.setState({
            segmentName: e.target.value
        }, () => this.onChangeRuleInput());
    }
    onChangeIgnoreField(e) {
        this.setState({
            ignoreField: e.target.value
        }, () => this.onChangeRuleInput());
    }
    onChangeRuleInput() {
        this.props.onChangeRuleInput(this.state.segmentName, this.state.ignoreField, this.props.listid);
    }
    onRemoveRuleInput(e) {
        this.props.onRemoveRuleInput(e, this.props.listid);
    }
    render() {
        let removeInputButton = <div></div>;

        if (!this.props.initial) {
            removeInputButton = <div className="col-sm">
                                    <button onClick={this.onRemoveRuleInput}>-</button>
                                </div>
        } 
        return (
            <tr>
                <td>
                    <input  type="text"
                        className="form-control"
                        onChange={ this.onChangeSegmentName }
                    />
                </td>
                <td>
                    <input  type="text"
                        className="form-control"
                        onChange={ this.onChangeIgnoreField }
                    />
                </td>
                <td>
                    { removeInputButton }
                </td>
            </tr>
        );
    }
}