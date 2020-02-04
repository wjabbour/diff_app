import React, { Component } from 'react';

export default class Configuration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            configurationName: "",
            fileType: "X12"
        };
        this.onChangeConfigurationName = this.onChangeConfigurationName.bind(this);
        this.onChangeFileType = this.onChangeFileType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeConfigurationName(e) {
        this.setState({ configurationName: e.target.value });
    }
    onChangeFileType(e) {
        this.setState({ fileType: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();

        console.log(`${this.state.configurationName}   ${this.state.fileType}`)
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
                    </div>
                </form>
                
            </div>
        )
    }
}