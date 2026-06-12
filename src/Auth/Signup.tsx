import React, { useState } from "react";
import { useNavigate } from "react-router";
import { SignUpProcess } from "../Service/AuthService";
import { useAuth } from "./AuthProvider";

import "../App.css";

const ROLES = [
  "Principal Investigator",
  "Admin",
  "Member",
];

interface SignUpForm {
  username: string;
  password: string;
  fullname: string;
  role: string;
  createdAt: string;
}

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<SignUpForm>({
    username: "",
    password: "",
    fullname: "",
    role: "",
    createdAt: new Date().toISOString().slice(0, 16),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await SignUpProcess(form);
      login(token);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page signup-shell">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="dot" />
          ResearchTrack
        </div>

        <div className="nav-right">        
        <button className="nav-cta" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </nav>

      {/* FORM */}
      <main className="signup-body">
        <div className="signup-card">
          
          <h1 className="signup-title">Create your account</h1>
          <p>---</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="fullname">Full Name</label>

              <input
                id="fullname"
                name="fullname"
                type="text"
                value={form.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* CREATED AT FIELD */}
            <div className="form-row">
              <label htmlFor="createdAt">Created At</label>

              <input
                id="createdAt"
                name="createdAt"
                type="datetime-local"
                value={form.createdAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="role">Role</label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your role…
                </option>

                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button className="signup-btn" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Free Account →"}
            </button>
          </form>

          <p className="signup-divider">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Sign in
            </a>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">
          <div className="dot" />
          ResearchTrack
        </div>
      </footer>
    </div>
  );
};

export default SignUp;