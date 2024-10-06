import { Appbar } from "../components/appbar";
import { BlogCard } from "../components/Blogcard";
import { useBlogs } from "../hooks";
import { useUser } from "../hooks/useUser";

export const Blogs = () => {
  const { loading: blogsLoading, blogs } = useBlogs();
  const { user, loading: userLoading } = useUser();

  // Display loading if either blogs or user is being loaded
  if (blogsLoading || userLoading) {
    return <div>Loading...</div>;
  }

  console.log("Blogs:", blogs); // Debugging line
  console.log("User:", user); // Debugging line

  // Handle case where user is not available (e.g., not logged in)
  if (!user) {
    return <div>Please log in to see your blogs.</div>;
  }

  return (
    <div>
      <Appbar name={user.name} />
      <div className="flex flex-col space-y-6 p-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            description={blog.content}
            author={blog.author}
            createdAt={blog.createdAt}
            imageUrl={blog.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
