import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

type Blog = {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  imageUrl: string;
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token is not found, handle the case
    if (!token) {
      console.error("Token not found in localStorage");
      setLoading(false); // Stop loading if no token
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure Bearer syntax is used
        },
      })
      .then((response) => {
        setBlogs(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  return { loading, blogs };
};
