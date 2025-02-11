import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    console.log(`Attempting login for username ${userInfo.username}`);

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    });

    console.log(`Login response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage;

      if (response.status === 401) {
        errorMessage = "Unauthorized: Invalid credentials.";
      } else if (response.status === 404) {
        errorMessage =
          "User not found. Check the username or register for a new user.";
      } else {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || "Login failed";
        } catch {
          errorMessage = `Login failed with status: ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Login successful, received token");
    return data;
  } catch (err) {
    console.log("Error from user login: ", err);
    throw err;
  }
};

export { login };
