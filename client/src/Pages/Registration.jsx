import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    university: "",
    contact: "",
    nextOfKin: { name: "", contact: "" },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("nextOfKin.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nextOfKin: { ...prev.nextOfKin, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/auth/register", formData, {
        withCredentials: true,
      });

      setSuccess("Registration successful!");
      console.log(res.data); 
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

return (
    <div style={{ maxWidth: "500px", margin: "50px auto" }}>
        <h2>Student Hostel Registration</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
            <label>
                Full Name
                <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            </label>
            <label>
                Email
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            </label>
            <label>
                Password
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            </label>
            <label>
                University
                <input type="text" name="university" placeholder="University" onChange={handleChange} required />
            </label>
            <label>
                Contact Number
                <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} required />
            </label>
            <label>
                Next of Kin Name
                <input type="text" name="nextOfKin.name" placeholder="Next of Kin Name" onChange={handleChange} required />
            </label>
            <label>
                Next of Kin Contact
                <input type="text" name="nextOfKin.contact" placeholder="Next of Kin Contact" onChange={handleChange} required />
            </label>

            <button type="submit">Register</button>
        </form>
    </div>
);
};

export default RegisterPage;
