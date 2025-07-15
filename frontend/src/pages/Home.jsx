import Form from "../components/Form";
import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Notes";
import "../styles/Home.css";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Navigate, useNavigate } from "react-router-dom";
export default function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getNote();
  }, []);
  const getNote = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted");
        else alert("Failed to delete Note");
        getNote();
      })
      .catch((error) => alert(error));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) alert("Note created");
        else alert("Not was not created");
        getNote();
      })
      .catch((error) => alert(error));
  };
  return (
    <>
      <h1>To Log Out</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Notes</h2>
      {notes.map((note) => (
        <Note note={note} onDelete={deleteNote} key={note.id} />
      ))}
      <h2>Create Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title: </label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        ></input>
        <label htmlFor="content">Content: </label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </>
  );
}
