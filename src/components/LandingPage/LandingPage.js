import { useEffect, useState } from "react";
import styles from './LandingPage.module.scss';
import { useNavigate } from "react-router-dom";
import { GetUserDetails } from "../../services/Storage/LocalStorage";
import docImage from "../assets/doc.png"; // path relative to LandingPage.jsx

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let userDetails = GetUserDetails();
    if (userDetails == null) {
      setIsUserLoggedIn(false);
      setUserName("");
    } else {
      setIsUserLoggedIn(true);
      setUserName("Welcome " + userDetails?.userName);
    }
  }, []);

  const sections = [
    { label: "Home", target: "overview" },
    { label: "About Us", target: "about" },
    { label: "How to Use", target: "howtouse" },
    { label: "Our Tools", target: "tools" },
    { label: "Outcomes", target: "outcomes" },
    { label: "Contact", target: "contact" }
  ];

  const scrollToSection = (target) => {
    const section = document.getElementsByName(target)[0];
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleToolClick = (e) => {
    const element = e.currentTarget;
    element.style.animation = "blink 0.4s ease-in-out 2";
    setTimeout(() => {
      element.style.animation = "";
    }, 800);
  };

  return (
<div style={{ background: "#080c14" }}>
  {/* Navbar */}
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "1.5rem 4vw",
      background: "#090e11",
      position: "fixed",
      width: "100vw",
      zIndex: 100,
      boxShadow: "0 2px 14px 2px #0e2b14a0",
      gap: "4vw"
    }}
  >
    <div
      style={{
        fontSize: "1.5rem",
        color: "#05fa8a",
        fontWeight: "bold",
        letterSpacing: "1px",
        marginRight: "2vw"
      }}
    >
      Tumor App
    </div>

    <div style={{ display: "flex", gap: "2vw", alignItems: "center" }}>
      {sections.map((item) => (
        <div
          key={item.label}
          style={{
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "1rem",
            borderBottom: "2px solid transparent",
            padding: "6px",
          }}
          onClick={() => scrollToSection(item.target)}
        >
          {item.label}
        </div>
      ))}
    </div>
  </nav>

  {/* Home / Overview */}
  <div
    name="overview"
    style={{
      paddingTop: "82px",
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#fff",
      background: `linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImage}) center/cover no-repeat`,
      borderBottom: "8px solid #05fa8a55",
      boxShadow: "0 2px 14px 2px #077e4380",
      textAlign: "center"
    }}
  >
    <h1 style={{ fontSize:"2.7rem", fontWeight:"bold", color:"#05fa8c", textShadow:"0 2px 14px #045d32" }}>
      Welcome to the AI-Powered Brain Tumor Detection Dashboard
    </h1>
    <p style={{ fontSize:"1.4rem", margin:"1.2rem 0 2.2rem", color:"#e0ffe2" }}>
      Our platform is designed to provide a seamless experience for uploading and analyzing MRI scans.
      Using advanced deep learning models, we aim to assist in early tumor detection, reducing delays in diagnosis, and supporting medical decision-making.
    </p>
    <div>
      <button 
        onClick={() => navigate("/login")}
        style={{
          padding:"0.9rem 2.5rem", margin:"0 1.0rem", background:"linear-gradient(90deg,#05fa8c,#14c48d)",
          color:"#1b2530", fontWeight:"bold", fontSize:"1.1rem", border:"none", borderRadius:"25px",
          boxShadow:"0 2px 12px #05fa8c90", cursor:"pointer"
        }}
      >
        Try Now
      </button>
      <button style={{
        padding:"0.9rem 2.5rem", margin:"0 1.0rem", background:"#212e23", color:"#05fa8a",
        fontWeight:"bold", fontSize:"1.1rem", border:"none", borderRadius:"25px", boxShadow:"0 2px 12px #05fa8c90", cursor:"pointer"
      }}>
        Learn More
      </button>
    </div>
    <h3 style={{ fontWeight:"bold", marginTop:"2rem" }}>✨ Key Features:</h3>
    <ul style={{ listStyle:"disc", textAlign:"left", maxWidth:"600px", margin:"1rem auto" }}>
      <li>Fast and accurate tumor classification</li>
      <li>Interactive results visualization</li>
      <li>Easy-to-use dashboard for doctors, researchers, and students</li>
    </ul>
  </div>

  {/* About Us */}
  <div name="about" style={{
    minHeight:"45vh", background:`linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImage}) center/cover no-repeat`,
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
    padding:"4.5rem 14vw"
  }}>
    <h2 style={{ fontSize:"2rem", fontWeight:700, marginBottom:"12px", color:"#05fa8a" }}>ℹ️ About Us</h2>
    <p>We are a team of passionate researchers and developers focused on combining Artificial Intelligence and Healthcare.</p>
    <p>This project was created as part of our academic/research initiative to showcase how machine learning can support medical imaging tasks.</p>
    <ul style={{ listStyle:"none", paddingLeft:0, textAlign:"left", maxWidth:"600px" }}>
      <li>👩‍💻 <b>Our Mission:</b> To make tumor detection faster, reliable, and accessible.</li>
      <li>🔬 <b>Our Approach:</b> Leveraging MRI data, preprocessing, and deep neural networks for classification.</li>
      <li>🏥 <b>Impact:</b> Supporting radiologists and reducing diagnostic workloads.</li>
      <li>📌 <b>Disclaimer:</b> For educational and research purposes only.</li>
    </ul>
  </div>

  {/* How to Use */}
  <div name="howtouse" style={{
    minHeight:"45vh", background:`linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImage}) center/cover no-repeat`,
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
    padding:"4.5rem 14vw"
  }}>
    <h2 style={{ fontSize:"2rem", fontWeight:700, marginBottom:"12px", color:"#05fa8a" }}>📤 How to Use</h2>
    <p>Here you can upload your MRI scans for analysis.</p>
    <ul style={{ listStyle:"none", paddingLeft:0, textAlign:"left", maxWidth:"600px" }}>
      <li>✅ Supported Formats: JPG, PNG, JPEG</li>
      <li>⚠️ File Size Limit: 10MB</li>
      <li>🔒 Security: Your files remain private and are not shared externally.</li>
    </ul>
    <p>After uploading, you’ll be redirected to the Outcomes section for predictions.</p>
  </div>

  {/* Our Tools */}
  <div name="tools" style={{
    minHeight:"35vh", background:`linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImage}) center/cover no-repeat`,
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
    padding:"4.5rem 14vw"
  }}>
    <h2 style={{ fontSize:"2rem", fontWeight:700, marginBottom:"12px", color:"#05fa8a" }}>🛠 Our Tools</h2>
    <div style={{ display:"flex", gap:"20px", flexWrap:"wrap", justifyContent:"center" }}>
      {[1,2,3,4].map((tool, index) => (
        <div key={index}
          onClick={handleToolClick}
          style={{
            width:"150px", height:"100px", border:"2px solid #05fa8a", borderRadius:"12px",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            fontWeight:"bold", color:"#05fa8a", fontSize:"1rem"
          }}
        >
          Tool {index + 1}
        </div>
      ))}
    </div>
  </div>

  {/* Outcomes */}
  <div name="outcomes" style={{
    minHeight:"45vh", background:`linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImage}) center/cover no-repeat`,
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
    padding:"4.5rem 14vw"
  }}>
    <h2 style={{ fontSize:"2rem", fontWeight:700, marginBottom:"12px", color:"#05fa8a" }}>📊 Outcomes</h2>
    <p>This section shows the AI’s analysis of your scan.</p>
    <ul style={{ listStyle:"none", paddingLeft:0, textAlign:"left", maxWidth:"600px" }}>
      <li>🔎 <b>Prediction:</b> Tumor / No Tumor</li>
      <li>📄 <b>Types:</b> Pituitary, Meningioma, Glioma</li>
      <li>📊 <b>Confidence Score:</b> Probability percentage</li>
      <li>🖼 <b>Model Explanation:</b> Highlighted tumor regions (Grad-CAM/heatmap)</li>
      <li>⚖️ <b>Comparison:</b> Results compared with baseline dataset</li>
    </ul>
  </div>

  {/* Contact */}
  <div name="contact" style={{
    minHeight:"30vh", background:`linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImage}) center/cover no-repeat`,
    color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
    padding:"4.5rem 14vw"
  }}>
    <h2 style={{ fontSize:"2rem", fontWeight:700, marginBottom:"12px", color:"#05fa8a" }}>📞 Contact</h2>
    <p>We’d love to hear from you!</p>
    <ul style={{ listStyle:"none", paddingLeft:0, textAlign:"left", maxWidth:"600px" }}>
      <li>📧 Email: tumorapp@gmail.com</li>
      <li>🌐 GitHub: [project repo link]</li>
      <li>📍 Institution: [Your college/hospital/organization name]</li>
      <li>💬 Feedback Form: [Google Form / link]</li>
    </ul>
  </div>

  <style>
    {`
      @keyframes blink {
        0%, 100% { background-color: transparent; }
        50% { background-color: #05fa8a50; }
      }
    `}
  </style>
</div>
  );
};