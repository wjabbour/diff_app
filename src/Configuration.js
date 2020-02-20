import React, { Component } from 'react';
import ConfigurationRule from './ConfigurationRule';

export default class Configuration extends Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            configurationName: "",
            fileType: "",
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
    componentDidMount() {
        this.createInitialInput();
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
            tempObj.segmentNumber = parseInt(rule.segmentNumber);
            ruleset.configurationRules.push(tempObj);
        });
        localStorage.setItem("configurationRules", JSON.stringify(ruleset));
        this.setState({ ruleInputs: [], ruleValues: [], configurationName: "", fileType: "" },
        () => this.createInitialInput());
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
                                    initial={ false }
                                    key={this.counter.toString()} 
                />
            )
        }, () => { this.counter++; })
    }
    createInitialInput() {
        const inputList = this.state.ruleInputs;
        this.setState({
            ruleInputs: inputList.concat(
                <ConfigurationRule  listid={this.counter.toString()}
                                    onChangeRuleInput={this.onChangeRuleInput}
                                    onRemoveRuleInput={this.onRemoveRuleInput} 
                                    initial={ true }
                                    key={this.counter.toString()} 
                />
            )
        }, () => { this.counter++; })
    }
    createInitialTable() {
    return  <div className="col">
                <table className="table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Segment Name</th>
                            <th scope="col">Segment Number</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.ruleInputs.map(function(input, index) {
                            return input; 
                        })
                    }
                    </tbody>
                </table> 
            </div>
    }
    render() {
        let initialTable = <div></div>;
        let fileTypes = [ { fileType: "X12" }, { fileType: "Delimeter" } ]; 
        const options = fileTypes.map((config) =>
            <option key={config.fileType} value={ config.fileType }>
                { config.fileType }
            </option>
        );
        let fileTypeSelect =    <select className="form-control"
                                        onChange={ this.onChangeFileType }
                                        value={ this.state.fileType} >
                                            <option hidden defaultValue={{label: "", value: {}}}></option>
                                            { options }
                                </select>       
        if (this.state.fileType !== "" || this.state.configurationName !== "") {
            initialTable = this.createInitialTable();
        }
        return (
            <div>
                <form>
                    <div className="form-row text-center">
                        <div className="form-group">
                            <label>Configuration Name</label>
                            <div className="col">
                                <input  className="form-control"
                                        type="text"
                                        value={this.state.configurationName}
                                        onChange={this.onChangeConfigurationName}
                                />
                            </div>
                        </div>  
                        <div className="form-group">
                            <label>File Type</label>
                            <div className="col">
                                { fileTypeSelect }   
                            </div>
                        </div> 
                    </div>
                </form>  
                <div className="container">
                    <div className="row">
                        { initialTable }
                        <div className="col">
                            <div style={{marginTop: "50px"}} className="d-flex flex-row-reverse">
                                <input type="submit" onClick={ this.onSubmit } value="Save" className="btn btn-primary" />

                                <button style={{marginRight: "50px"}} 
                                        className="btn btn-primary"
                                        onClick={this.onAddRuleInput}>
                                            Add Configuration Rule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                   
                    
                    {/* <div className="container">
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
                    </div> */}
                   
                
                
                
            </div>
        )
    }
}