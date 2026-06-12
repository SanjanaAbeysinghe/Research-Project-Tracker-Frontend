import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./Components/NavBar";
import Document from "./Documents/Document"; 
import Home from "./Components/Home";
import { SignIn } from "./Auth/SignIn";
import { SignUp } from "./Auth/Signup";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './Auth/AuthProvider';
import { Project } from "./Projects/Project";
import { Milestone } from "./MIlestone/MIlestone";
import { PrincipalInvestigator } from "./Pi/PI";
import { Member } from "./Member/Member";
import { Admin } from "./Admin/Admin";
import Footer from "./Components/Footer";
import DocumentUpload from "./Documents/Document";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <div className="flex-grow-1 container mt-4">
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/document" element={<DocumentUpload />} />
              <Route path="/projects" element={<Project />} />
              <Route path="/milestone" element={<Milestone />} />
              <Route path="/pi" element={<PrincipalInvestigator />} />
              <Route path="/member" element={<Member />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
          
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;