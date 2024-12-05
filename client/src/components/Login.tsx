import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Login: React.FC = () => {
  console.log("sign component rendered");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { login } = useLogin();

  const navigate = useNavigate();

  const handleFormSubmission = async (e: FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setEmailError("");
    setPasswordError("");

    // Regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex for password validation (at least 6 characters)
    const passwordRegex = /^.{6,}$/;

    let isValid = true;

    // Validate email
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await login({ email, password });
      navigate("/dashboard");
    } catch (error: any) {
      setEmailError("Invalid credentials, please try again."); // Example error
      setPasswordError(""); // Clear password error if any
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleFormSubmission}>
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
            {emailError && (
              <div className="text-sm text-red-600">{emailError}</div>
            )}
            {!emailError && email && (
              <div className="text-sm text-green-600">Looks good!</div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
            {passwordError && (
              <div className="text-sm text-red-600">{passwordError}</div>
            )}
            {!passwordError && password && (
              <div className="text-sm text-green-600">Looks good!</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
              }`}
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Create new user?
          <a
            onClick={() => navigate("/signup")}
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Sign Up
          </a>
        </p>
        <p className="mt-10 text-center text-sm text-gray-500">
          <a
            onClick={() => navigate("/admin/login")}
            className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
          >
            Admin Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
