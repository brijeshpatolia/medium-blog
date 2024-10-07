import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

interface Blog {
   title : string;
   content : string;
   createdAt : string;
   author :
   {
     bio: string;
     name : string;
     id : string;
   }
}



export const useBlog = ({id}:{id:string}) => {
 const [loading , setLoading] = useState(true);
 const [blog, setBlog] = useState<Blog>();
 useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then(response => {
      setBlog({
        title: response.data.title,
        content: response.data.content,
        createdAt: response.data.createdAt,  // Add createdAt information if needed
        author: response.data.author // Add author information if needed
      });
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching blog:", error);
      setLoading(false);
    });
 }, [id]);
 

 return { blog, loading };

}