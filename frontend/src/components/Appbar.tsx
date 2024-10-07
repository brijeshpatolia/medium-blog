import { Link } from "react-router-dom";

const getInitials = (name: string) => {
  if (!name) return ""; // Handle the case when name is undefined
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
  return initials;
};

interface AppbarProps {
  name: string;
}

export const Appbar = ({ name }: AppbarProps) => {
  const initials = getInitials(name);

  return (
    <div className="border-b flex justify-between items-center px-10 py-3">
      <div className="text-lg font-semibold">Medium</div>
      <div className="flex items-center space-x-3">
        {/* New Blog Button as a Link */}
        <Link to="/publish">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            New Blog
          </button>
        </Link>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
};
