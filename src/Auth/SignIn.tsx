import { useState } from "react";
import { useNavigate } from "react-router";
import { SignInProcess } from "../Service/AuthService";
import { useAuth } from "./AuthProvider";
import "../App.css";

interface SignInForm {
  username: string;
  password: string;
}

export const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<SignInForm>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = await SignInProcess(form);
      if (token) {
        localStorage.setItem("authToken", token);
        login(token);
        navigate("/projects");
      } else {
        setError("Login failed. No token returned.");
      }
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page signup-shell">
      {/* NAV */}
      <nav className="nav">
        <div
          className="nav-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="dot" />
          ResearchTrack
        </div>
        <div className="nav-right">
          <button className="nav-cta" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </nav>

      {/* FORM BODY */}
      <main className="signup-body">
        <div className="signup-card">
          <p className="signup-eyebrow">Welcome back</p>
          <h1 className="signup-title">Sign in to your account</h1>
          <p>
            ---
          </p>

          {error && (
            <div className="signin-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-row">
              <label htmlFor="password">
                Password
                <a
                  href="#"
                  className="form-label-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button className="signup-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="signup-divider">
            Don't have an account?{" "}
            <a
              href="register"
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
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
        <div className="footer-copy">
          © 2026 ResearchTrack. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SignIn;
