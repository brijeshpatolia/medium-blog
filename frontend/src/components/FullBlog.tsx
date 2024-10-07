const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-gray-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };


  const getInitials = (author: { name: string }) => {
    if (!author || !author.name) return "N/A"; // Fallback for missing author
    const names = author.name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials;
  };

const FullBlog = ({
    blog,
  }: {
    blog: {
      createdAt: string;
      title: string;
      content: string;
      author: { avatar?: string; name: string; bio: string };
    };
  }) => {
    if (!blog) return <p>No blog found</p>;
  
    const formattedDate = formatDate(blog.createdAt);
    const initials = getInitials(blog.author);
    const avatarColor = getRandomColor();
  
    return (
      <div className="px-10 w-full pt-10">
        {/* Blog Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Main Content Section */}
          <div className="col-span-8 pr-6">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <p className="text-lg text-gray-500 mb-8">Posted on {formattedDate}</p>
            <p className="text-lg mb-8">{blog.content}</p>
          </div>
  
          {/* Author Section */}
          <div className="col-span-4">
            <div className="bg-gray-100 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {blog.author.avatar ? (
                  <img
                    src={blog.author.avatar}
                    alt="Author Avatar"
                    className="rounded-full w-12 h-12 mr-4"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-full ${avatarColor} text-white flex items-center justify-center mr-4`}
                  >
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-xl font-semibold">{blog.author.name}</p>
                  <p className="text-sm text-gray-500">{blog.author.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default FullBlog;
  
