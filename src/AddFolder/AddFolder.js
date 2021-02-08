import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import "./AddFolder.css";
import ValidationError from "../ValidationError/ValidationError.js";

export default class AddFolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      touched: false,
    };
  }

  static defaultProps = {
    history: {
      push: () => {},
    },
  };
  static contextType = ApiContext;

  // folder name validation
  updateFolderName(name) {
    this.setState({ value: name, touched: true });
    console.log(name);
  }

  validateFolderName() {
    const name = this.state.value;
    if (name.length === 0) {
      return "Please enter a folder name";
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const folder = {
      folder_name: e.target["folder-name"].value,
    };
    fetch(`${config.API_ENDPOINT}/folders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(folder),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((folder) => {
        this.context.addFolder(folder);
        this.props.history.push(`/folder/${folder.id}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const folderNameError = this.validateFolderName();
    return (
      <section className="AddFolder">
        <h2>Create a folder</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="folder-name-input">Name</label>
            <input
              type="text"
              id="folder-name-input"
              name="folder-name"
              onChange={(e) => this.updateFolderName(e.target.value)}
            />
            {this.state.touched && (
              <ValidationError message={folderNameError} />
            )}
          </div>
          <div className="buttons">
            <button type="submit" disabled={this.validateFolderName()}>
              Add folder
            </button>
          </div>
        </form>
      </section>
    );
  }
}
