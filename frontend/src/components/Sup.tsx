import { signupInput } from "medium-common-brijeshp";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Sup = () => {
    const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<signupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest(data: signupInput) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, data);
      const jwt = response.data.jwt
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = () => {
    sendRequest(postInputs);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md">
        <div className="text-center">
          <div className="text-3xl font-extrabold">Create an account</div>
          <div className="text-slate-400 mt-2">
            Already have an account?
            <Link className="pl-2 underline" to="/signin">
              Login
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <LabelledInput
            label="Username"
            placeholder="Enter your username"
            onChange={(e) =>
              setPostInputs({ ...postInputs, name: e.target.value })
            }
          />
          <LabelledInput
            label="Email"
            placeholder="m@example.com"
            onChange={(e) =>
              setPostInputs({ ...postInputs, email: e.target.value })
            }
          />
          <LabelledInput
            label="Password"
            placeholder="Enter your password"
            onChange={(e) =>
              setPostInputs({ ...postInputs, password: e.target.value })
            }
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({ label, placeholder, onChange }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        onChange={onChange}
        type="text"
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
