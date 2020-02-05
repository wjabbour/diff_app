import React, { Component } from 'react';
import ConfigurationRule from './ConfigurationRule';

export default class Configuration extends Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            configurationName: "",
            fileType: "X12",
            ruleInputs: [],
            ruleValues: []
        };
        this.onChangeConfigurationName = this.onChangeConfigurationName.bind(this);
        this.onChangeFileType = this.onChangeFileType.bind(this);
        this.onAddRuleInput = this.onAddRuleInput.bind(this);
        this.onChangeRuleInput = this.onChangeRuleInput.bind(this);
        this.onRemoveRuleInput = this.onRemoveRuleInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChangeConfigurationName(e) {
        this.setState({ configurationName: e.target.value });
    }
    onChangeFileType(e) {
        this.setState({ fileType: e.target.value });
    }
    /*
        Accesses state to construct a ruleset object. 
        TODO: Need to make this hit an api instead and possibly
        do some merging with the existing objects if there are any 
    */
    onSubmit(e) {
        e.preventDefault();
        const ruleset = {
            fileType: this.state.fileType,
            configurationName: this.state.configurationName,
            configurationRules: []
        }
        let tempObj = {};
        const ruleValues = this.state.ruleValues;
        ruleValues.forEach(rule => {
            tempObj.segmentName = rule.segmentName;
            tempObj.segmentNumber = rule.segmentNumber;
            ruleset.configurationRules.push(tempObj);
        });
        console.log(ruleset);
        localStorage.setItem("configurationRules", JSON.stringify(ruleset));
        this.setState({ ruleInputs: [], ruleValues: [], configurationName: "" })
    }
    onChangeRuleInput(segmentName, segmentNumber, id) {
        const rules = this.state.ruleValues;
        let found = false;
        rules.forEach(rule => {
            if (rule.id === id) {
                rule.segmentName = segmentName;
                rule.segmentNumber = segmentNumber;
                found = true;
            }
        });
        if (!found) {
            rules.push({
                segmentName: segmentName,
                segmentNumber: segmentNumber,
                id: id
            });
        }
        this.setState({ruleValues: rules});
    }
    onRemoveRuleInput(e, id) {
        e.preventDefault();
        
        const ruleValues = this.state.ruleValues;
        const ruleInputs = this.state.ruleInputs;
        const newRules = ruleValues.filter(rule => rule.id !== id);
        const newRuleInputs = ruleInputs.filter(input => input.key !== id);
        this.setState({ruleValues: newRules, ruleInputs: newRuleInputs});
    }
    onAddRuleInput(e) {
        e.preventDefault();
        const inputList = this.state.ruleInputs;
        this.setState({
            ruleInputs: inputList.concat(
                <ConfigurationRule  listid={this.counter.toString()}
                                    onChangeRuleInput={this.onChangeRuleInput}
                                    onRemoveRuleInput={this.onRemoveRuleInput} 
                                    key={this.counter.toString()} 
                />
            )
        }, () => { this.counter++; })
    }
    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Configuration Name</label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.configurationName}
                                onChange={this.onChangeConfigurationName}
                        />
                        <label>File Type</label>
                        <select className="form-control" value={this.state.fileType} onChange={this.onChangeFileType}>
                            <option value="X12">X12</option>
                            <option value="Delimeter">Delimeter</option>
                        </select>
                        <input type="submit" value="Save" className="btn btn-primary" />

                        <div className="container">
                            <div className="row">
                                <div className="col-lg">
                                {
                                    this.state.ruleInputs.map(function(input, index) {
                                        return input; 
                                    })
                                }
                                </div>
                                <div className="col-sm">
                                    <button onClick={this.onAddRuleInput}>+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}