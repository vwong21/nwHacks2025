import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("student");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      navigate("/login");

      // Save additional user data to the database DO IT HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      const userData = {
        uid: user.uid, // Unique user ID from Firebase Authentication
        email,
        firstName,
        lastName,
        userType,
      };
      console.log(userData) //Replace with actually pushing data
    }
     catch (error: any) {
      console.log(error.code, error.message);
    }
  };
  return (
    <main>
      <section>
        <div>
          <div>
            <h1> NWhacks </h1>
            <form onSubmit={onSubmit}>
              <div>
                <label htmlFor="email-address">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
              </div>

              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="First Name"
                />
              </div>


              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Last Name"
                />
              </div>

              <div>
                <label htmlFor="userType">User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required>

                  <option value="student">Student</option>
                  <option value="event-planner">EventPlanner</option>
                </select>
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>

              <button type="submit">Sign up</button>
            </form>

            <p>
              Already have an account?{" "}
              <NavLink to="/login">Sign in</NavLink>
            </p>
          </div>
        </div>
      </section>
    </main>
    
  );
  
};

export default Signup;