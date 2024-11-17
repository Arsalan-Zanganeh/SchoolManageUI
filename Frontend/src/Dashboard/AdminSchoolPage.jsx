import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useSchool } from "../context/SchoolContext";
import { usePrincipal } from "../context/PrincipalContext";
import "./AdminSchoolPage.css";

const AdminSchoolPage = () => {
  const navigate = useNavigate();
  const { loginSchool, logoutSchool } = useSchool();
  const { logoutPrincipal } = usePrincipal();
  const [schools, setSchools] = useState([]);
  const [newSchool, setNewSchool] = useState({
    School_Name: "",
    Province: "",
    City: "",
    Address: "",
    School_Type: "",
    Education_Level: "",
    Postal_Code: "",
  });

  const fetchSchools = useCallback(async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/school/", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSchools(data);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to load schools. Please try again later.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchool((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/add_school/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchool),
        credentials: "include",
      });

      if (response.ok) {
        const addedSchool = await response.json();
        setSchools((prev) => [...prev, addedSchool]);
        Swal.fire({
          title: "Success",
          text: "School added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setNewSchool({
          School_Name: "",
          Province: "",
          City: "",
          Address: "",
          School_Type: "",
          Education_Level: "",
          Postal_Code: "",
        });
      } else {
        const errorData = await response.json();
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");

        Swal.fire({
          title: "Error",
          text: errorMessages || "Failed to add school. Please check your input.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleNavigateToDashboard = async (schoolId, Postal_Code) => {
    try {
      const loginResponse = await fetch(
        `http://127.0.0.1:8000/api/login_school/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Postal_Code }),
          credentials: "include",
        }
      );

      if (loginResponse.ok) {
        const token = await loginResponse.json();
        loginSchool(token);
        navigate(`/dashboard/school/${schoolId}`);
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to login to the school. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error or server is unavailable. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleLogout = async () => {
    try 
    {
      const adminLogoutResponse = await fetch(
        "http://127.0.0.1:8000/api/logout_school/",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!adminLogoutResponse.ok) {
        throw new Error("Failed to logout admin");
      }
      const schoolLogoutResponse = await fetch(
        "http://127.0.0.1:8000/api/logout/",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!schoolLogoutResponse.ok) {
        throw new Error("Failed to logout school");
      }
      logoutPrincipal();
      logoutSchool();
      Swal.fire({
        title: "Logged Out",
        text: "You have been logged out successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/principal-login");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to logout completely. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <div className="admin-school-container">
      <h1>Manage Schools</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <form onSubmit={handleAddSchool} className="add-school-form">
        <h2>Add a New School</h2>
        <input
          type="text"
          name="School_Name"
          placeholder="School Name"
          value={newSchool.School_Name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="Province"
          placeholder="Province"
          value={newSchool.Province}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="City"
          placeholder="City"
          value={newSchool.City}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="Address"
          placeholder="Address"
          value={newSchool.Address}
          onChange={handleInputChange}
          required
        />
        <select
          name="School_Type"
          value={newSchool.School_Type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select School Type</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <select
          name="Education_Level"
          value={newSchool.Education_Level}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Education Level</option>
          <option value="primary">Primary</option>
          <option value="middle">Middle</option>
          <option value="high school">High School</option>
        </select>
        <input
          type="text"
          name="Postal_Code"
          placeholder="Postal Code"
          value={newSchool.Postal_Code}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="add-school-button">
          Add School
        </button>
      </form>
      <div className="school-list">
        <h2>Existing Schools</h2>
        {schools.length > 0 ? (
          schools.map((school) => (
            <div key={school.id} className="school-item">
              <h3>{school.School_Name}</h3>
              <p>
                {school.City}, {school.Province}
              </p>
              <p>Postal Code: {school.Postal_Code}</p>
              <button
                className="view-dashboard-button"
                onClick={() =>
                  handleNavigateToDashboard(school.id, school.Postal_Code)
                }
              >
                Go to Dashboard
              </button>
            </div>
          ))
        ) : (
          <p>No schools found. Please add a new school.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSchoolPage;
