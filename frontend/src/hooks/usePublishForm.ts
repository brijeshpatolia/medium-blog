import { useState } from "react";

export const usePublishForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value: string) => {
    setContent(value); // Set content from the rich text editor
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
  };

  return {
    title,
    content,
    handleTitleChange,
    handleContentChange,
    clearForm,
  };
};
