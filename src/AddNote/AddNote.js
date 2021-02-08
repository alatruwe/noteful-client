import React, { Component } from "react";
import NotefulForm from "../NotefulForm/NotefulForm";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidationError from "../ValidationError/ValidationError.js";
import "./AddNote.css";

export default class AddNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      content: "",
      touched: false,
    };
  }
  static defaultProps = {
    history: {
      push: () => {},
    },
    name: "",
    content: "",
  };
  static contextType = ApiContext;

  // form name validation
  updateNoteName(name) {
    this.setState({ name: name, touched: true });
  }

  validateNoteName() {
    const name = this.state.name;
    if (name.length === 0) {
      return "Please enter a name";
    }
  }

  // form content validation
  updateNoteContent(content) {
    this.setState({ content: content, touched: true });
  }

  validateNoteContent() {
    const content = this.state.content;
    if (content.length === 0) {
      return "The note can't be empty";
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      title: e.target["note-name"].value,
      content: e.target["note-content"].value,
      folder_id: e.target["note-folder-id"].value,
      date_created: new Date(),
    };
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((e) => Promise.reject(e));
        return res.json();
      })
      .then((note) => {
        this.context.addNote(note);
        this.props.history.push(`/folder/${note.folder_id}`);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const { folders = [] } = this.context;
    const nameError = this.validateNoteName();
    const contentError = this.validateNoteContent();
    return (
      <section className="AddNote">
        <h2>Create a note</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="field">
            <label htmlFor="note-name-input">Name</label>
            <input
              type="text"
              id="note-name-input"
              name="note-name"
              onChange={(e) => this.updateNoteName(e.target.value)}
            />
            {this.state.touched && <ValidationError message={nameError} />}
          </div>
          <div className="field">
            <label htmlFor="note-content-input">Content</label>
            <textarea
              id="note-content-input"
              name="note-content"
              onChange={(e) => this.updateNoteContent(e.target.value)}
            />
            {this.state.touched && <ValidationError message={contentError} />}
          </div>
          <div className="field">
            <label htmlFor="note-folder-select">Folder</label>
            <select id="note-folder-select" name="note-folder-id">
              <option value={null}>...</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.folder_name}
                </option>
              ))}
            </select>
          </div>
          <div className="buttons">
            <button type="submit" disabled={this.validateNoteName()}>
              Add note
            </button>
          </div>
        </form>
      </section>
    );
  }
}
