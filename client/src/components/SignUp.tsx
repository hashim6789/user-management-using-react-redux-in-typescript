import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import useSignup from "../hooks/useSignup";

const Signup: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [userNameError, setUserNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { signup } = useSignup();

  const navigate = useNavigate();

  const handleFormSubmission = async (e: FormEvent) => {
    e.preventDefault();

    // Regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex for password validation (at least 6 characters)
    const passwordRegex = /^.{6,}$/;

    // Regex for username validation (at least 5 characters, alphabets only)
    const userNameRegex = /^[A-Za-z]{5,}$/;

    let isValid = true;

    // Trim and validate username
    const trimmedUserName = userName.trim();
    setUserName(trimmedUserName); // Update username state with trimmed value
    if (!userNameRegex.test(trimmedUserName)) {
      setUserNameError(
        "Username must be at least 5 characters long and contain only alphabets."
      );
      isValid = false;
    } else {
      setUserNameError(""); // Clear error
    }

    // Validate email
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(""); // Clear error
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(""); // Clear error
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError(""); // Clear error
    }

    if (!isValid) {
      return;
    }

    try {
      await signup({ username: trimmedUserName, email, password });
      navigate("/dashboard");
    } catch (error: any) {
      setEmailError("Something went wrong. Please try again."); // General error
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
          Sign up for your account
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

          {/* UserName Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              User Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="username"
                id="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
            {userNameError && (
              <div className="text-sm text-red-700">{userNameError}</div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
            {emailError && (
              <div className="text-sm text-red-700">{emailError}</div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
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
              <div className="text-sm text-red-700">{passwordError}</div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
            {confirmPasswordError && (
              <div className="text-sm text-red-700">{confirmPasswordError}</div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
