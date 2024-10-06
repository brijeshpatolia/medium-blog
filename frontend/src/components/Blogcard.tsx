import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string; // Assuming this is an ISO date string
  imageUrl: string;
}

const getInitials = (author: { name: string }) => {
  if (!author || !author.name) return "N/A"; // Fallback for missing author
  const names = author.name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials;
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

// Function to format the date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const BlogCard = ({
  id,
  title,
  description,
  author,
  createdAt,
  imageUrl,
}: BlogCardProps) => {
  const initials = getInitials(author);
  const avatarColor = getRandomColor();
  const formattedDate = formatDate(createdAt); // Format the date

  return (
    <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden mb-4 w-3/5 mx-auto">
      <div className="flex-1 p-6">
        <div className="flex items-center text-gray-500 mb-2">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} text-white flex items-center justify-center mr-2`}
          >
            {initials}
          </div>
          <span className="mr-2 font-semibold">{author.name}</span>
          <span className="ml-2">{formattedDate}</span> {/* Displaying the formatted date */}
          <span className="ml-2 text-yellow-500">Member-only</span>
        </div>
        <Link to={`/blog/${id}`} className="block">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </Link>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
      <div className="w-48 h-auto">
        <img src={imageUrl} alt={title} className="object-cover h-full w-full" />
      </div>
    </div>
  );
};
