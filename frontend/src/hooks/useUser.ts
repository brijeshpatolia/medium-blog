import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";


type DecodedToken = {
  userId: string;
  name: string;
};

export const useUser = () => {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found");
      setLoading(false);
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUser({
        id: decodedToken.userId,
        name: decodedToken.name,
      });
      console.log("Decoded User:", decodedToken); // Debugging line
    } catch (error) {
      console.error("Failed to decode token", error);
    } finally {
      setLoading(false); // Make sure to set loading to false after processing
    }
  }, []);

  return { user, loading };
};
