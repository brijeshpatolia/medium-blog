import { useParams } from "react-router-dom";
import { useBlog } from "../hooks/useBlog";
import FullBlog from "../components/FullBlog";
import { Appbar } from "../components/Appbar";
import { useUser } from "../hooks/useUser";
// Assuming you also need user info for the Appbar

const BlogPage = () => {
  const { id } = useParams(); // Get the blog ID from the route
  const { loading, blog } = useBlog({ id: id || "" }); // Fetch blog data
  const { user, loading: userLoading } = useUser(); // Fetch user data for Appbar

  // Display loading if either blog or user is being loaded
  if (loading || userLoading) return <p>Loading...</p>;
  if (!blog) return <p>No blog found</p>;

  // Ensure the blog's author has a bio
  const blogWithBio = {
    ...blog,
    author: {
      ...blog.author,
      bio: blog.author.bio || "No bio available",
    },
  };

  return (
    <div>
      {/* Appbar */}
      {user && <Appbar name={user.name} />} {/* Pass user's name to Appbar */}
      {/* Blog Content */}
      <FullBlog blog={blogWithBio} />{" "}
      {/* Pass blog data to FullBlog component */}
    </div>
  );
};

export default BlogPage;
