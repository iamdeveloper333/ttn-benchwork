import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { API_BASE_URL } from "../utils/config";

const UpdateProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employment, setEmployment] = useState("Public");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const setUserProfile = async () => {
      try {
        const { firstName, lastName, age, email, employment } = userDetails;
        setFirstName(firstName);
        setLastName(lastName);
        setAge(age);
        setEmail(email);
        setEmployment(employment);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    setUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("profilePicture", profilePicture);
    formData.append("age", age);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("employment", employment);
    formData.append("userId", userDetails.userId);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/user/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("userDetails", JSON.stringify(response?.data?.user));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Profile update failed! Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Update Profile
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Profile Picture
              </label>
              <div className="mt-2">
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  className="block w-full text-gray-900"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Age
              </label>
              <div className="mt-2">
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="employment"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Employment
              </label>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    id="employmentPublic"
                    name="employment"
                    type="radio"
                    value="Public"
                    checked={employment === "Public"}
                    onChange={(e) => setEmployment(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="employmentPublic" className="mr-4">
                    Public
                  </label>
                  <input
                    id="employmentPrivate"
                    name="employment"
                    type="radio"
                    value="Private"
                    checked={employment === "Private"}
                    onChange={(e) => setEmployment(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="employmentPrivate">Private</label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default UpdateProfilePage;
