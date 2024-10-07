import { usePublishForm } from "../hooks/usePublishForm";
import { TextEditor } from "../components/TextEditor";
import axios from "axios";
import DOMPurify from "dompurify"; // For sanitization
import { marked } from "marked"; // For converting Markdown to HTML

export const Publish = () => {
  const { title, content, handleTitleChange, handleContentChange, clearForm } =
    usePublishForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // or however you store your token

    try {
      // Sanitize the content (if using HTML)
      const plainTextContent = quill.getText(); 

      // Convert Markdown to HTML
    

      const response = await axios.post(
        "https://backend.pledith31.workers.dev/api/v1/blog",
        {
          title,
          content: plainTextContent, // Use htmlContent for HTML format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        clearForm();
        // Optionally, display a success message
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error publishing post:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="publish-page">
      <h1 className="text-2xl font-bold mb-6">Publish New Blog</h1>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={handleTitleChange}
          className="border p-2 w-full mb-4"
        />

        {/* Rich Text Editor */}
        <TextEditor value={content} onChange={handleContentChange} />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Publish
        </button>
      </form>
    </div>
  );
};
