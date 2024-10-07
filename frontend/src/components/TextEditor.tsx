import  { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

interface TextEditorProps {
  onChange: (content: string) => void;
  value: string;
}

export const TextEditor = ({ onChange, value }: TextEditorProps) => {
  const [content, setContent] = useState(value);

  const handleChange = (value: string) => {
    setContent(value);
    onChange(value); // Pass content back to parent component
  };

  return (
    <ReactQuill
      value={content}
      onChange={handleChange}
      modules={TextEditor.modules}
      formats={TextEditor.formats}
      placeholder="Write something amazing..."
    />
  );
};

// Quill modules and formats for custom toolbar
TextEditor.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'], // Allow adding links, images, and videos
    ['clean'] // Remove formatting button
  ]
};

TextEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'blockquote', 'list', 'bullet',
  'link', 'image', 'video',
  'color', 'background', 'align', 'script'
];
