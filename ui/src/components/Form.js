import { useContext, useState } from "react";
import { PostContext } from "../context/PostContext";
import faker from "faker";
import "./Form.css";

const Form = () => {
  const { create } = useContext(PostContext);
  const [content, setContent] = useState("");

  return (
    <form
      className="Form"
      onSubmit={(e) => {
        e.preventDefault();
        if (content) create(content).then(() => setContent(""));
      }}
    >
      <input
        type="text"
        className="Form-text"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <button
        onClick={() => setContent(faker.lorem.sentence())}
        type="button"
        className="Form-button Form-button--narrow"
      >
        🎲
      </button>
      <button type="submit" className="Form-button" disabled={!content}>
        Post
      </button>
    </form>
  );
};

export default Form;
