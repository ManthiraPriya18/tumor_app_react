
import { useEffect, useState } from "react";
import { Phone, Mail, Github, Instagram, FileText } from "lucide-react";
import docImg from "../assets/doc.png";
import doc5 from "../assets/doc2.jpeg";
import doc4 from "../assets/doc4.png";
import doc10 from "../assets/doc10.png";  
import doc2 from "../assets/doc2.png";
import { useNavigate } from "react-router-dom";




export const LandingPage = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    // Simulated user details check
    const userDetails = null; // Replace with GetUserDetails()
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
    { label: "Contact", target: "contact" }
  ];

  const scrollToSection = (target) => {
    const section = document.getElementsByName(target)[0];
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const contactLinks = [
    { icon: Phone, label: "Phone", value: "8243383539", href: "tel:8243383539" },
    { icon: Mail, label: "Email", href: "mailto:tumorapp@gmail.com" },
    { icon: Github, label: "GitHub", href: "https://github.com/ManthiraPriya18/tumor_app_react" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/novalogic_6" },
    { icon: FileText, label: "Form", href: "https://docs.google.com/forms/d/e/1FAIpQLSf2AzJoNHE74ad9RAtULR95T7LiqxX_O8rtH8Ayk3-cD-cM6A/viewform?usp=sharing&ouid=107565279234321863271" }
  ];

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
          TumorApp🩺
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
    background: `linear-gradient(rgba(8,9,20,0.66), rgba(16,16,24,0.88)), url(${docImg}) center/cover no-repeat`,
    borderBottom: "8px solid #05fa8a55",
    boxShadow: "0 2px 14px 2px #077e4380",
    textAlign: "center",
  }}
>
        <h1 style={{ fontSize:"2.7rem", fontWeight:"bold", color:"#05fa8c", textShadow:"0 2px 14px #045d32" }}>
          Welcome to the AI-Powered Brain Tumor Detection Dashboard
        </h1>
        <p style={{ fontSize:"1.4rem", margin:"1.2rem 0 2.2rem", color:"#e0ffe2" }}>
          Our platform makes it simple to upload and analyze MRI scans. With the help of advanced AI, it quickly checks for brain tumors, helping doctors and patients get faster results and make better treatment decisions.
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
  Get Started
</button>

        </div>

        {/* Brain Tumor Information Section */}
        <div style={{ marginTop:"4rem", maxWidth:"900px", width:"100%", padding:"0 2rem" }}>
          <div 
            style={{
              background:"rgba(16,24,34,0.8)",
              border:"2px solid #05fa8a",
              borderRadius:"15px",
              padding:"2rem",
              transition:"all 0.3s ease",
              cursor:"pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 25px #05fa8a88";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0px)";
            }}
          >
            <h3 style={{ color:"#05fa8c", fontSize:"1.8rem", marginBottom:"1.5rem", fontWeight:"bold" }}>
              Understanding Brain Tumors: The Critical Need for Early Detection
            </h3>
            <div style={{ textAlign:"left", lineHeight:"1.8", color:"#e0ffe2" }}>
              <p style={{ marginBottom:"1rem" }}>
                <strong>Brain tumors affect over 700,000 people in the United States alone</strong>, with approximately 88,970 new cases diagnosed annually. These abnormal cell growths in the brain can be benign or malignant, but both types can cause serious health complications.
              </p>
              <p style={{ marginBottom:"1rem" }}>
                <strong>Impact on Children:</strong> Brain tumors are the second most common cancer in children, accounting for about 26% of childhood cancers. Early detection is crucial as it can improve survival rates by up to 90% when caught in early stages.
              </p>
              <p style={{ marginBottom:"1rem" }}>
                <strong>Our Solution:</strong> Traditional diagnostic methods can take weeks, but our AI-powered system provides preliminary analysis in minutes, helping healthcare professionals prioritize urgent cases and expedite treatment decisions. This rapid screening can be the difference between life and death.
              </p>
              <p style={{ color:"#05fa8c", fontWeight:"bold" }}>
                Early detection saves lives - every minute counts in brain tumor diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>

{/* About Us */}
<div 
  name="about" 
  style={{
    minHeight: "60vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4.5rem 8vw",
    background: `linear-gradient(rgba(13,18,32,0.85), rgba(13,18,32,0.9)), url(${doc5}) center/cover no-repeat`
  }}
>
  <h2 
    style={{ 
      fontSize: "2.5rem", 
      fontWeight: 700, 
      marginBottom: "3rem", 
      color: "#05fa8a" 
    }}
  >
    About Us
  </h2>
  
  <div 
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "2rem",
      width: "100%",
      maxWidth: "1200px"
    }}
  >
    {[
      {
        title: "Mission",
        content: "We believe early diagnosis can save lives, and technology should make it easier for everyone. Our goal is to democratize advanced medical imaging analysis."
      },
      {
        title: "Approach", 
        content: "By training AI on medical images, we aim to provide accurate and trustworthy tumor predictions using cutting-edge machine learning algorithms."
      },
      {
        title: "Impact",
        content: "This allows doctors to focus more on patient care while AI assists with routine scan analysis, reducing diagnostic time from hours to minutes."
      },
      {
        title: "Disclaimer",
        content: "This tool is not a substitute for professional medical advice or clinical diagnosis. Always consult with qualified healthcare professionals."
      }
    ].map((item, index) => (
      <div
        key={index}
        style={{
          background: "rgba(16,24,34,0.7)",
          border: "2px solid #05fa8a",
          borderRadius: "15px",
          padding: "2rem",
          textAlign: "center",
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 0 20px #05fa8a77";
          e.currentTarget.style.background = "rgba(5,250,138,0.1)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.background = "rgba(16,24,34,0.7)";
        }}
      >
        <h3 
          style={{ 
            color: "#05fa8c", 
            fontSize: "1.5rem", 
            marginBottom: "1rem", 
            fontWeight: "bold" 
          }}
        >
          {item.title}
        </h3>
        <p style={{ color: "#e0ffe2", lineHeight: "1.6" }}>
          {item.content}
        </p>
      </div>
    ))}
  </div>
</div>

{/* How to Use */}
<div
  name="howtouse"
  style={{
    minHeight: "60vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4.5rem 8vw",
    background: `linear-gradient(rgba(18,26,40,0.9), rgba(18,26,40,0.95)), url(${doc4}) center/cover no-repeat`

  }}
>
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "3rem",
      color: "#05fa8a"
    }}
  >
    How to Use
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2.5rem",
      width: "100%",
      maxWidth: "1000px"
    }}
  >
    {[
      {
        step: "01",
        title: "Upload Your MRI Scan",
        description:
          "Simply drag and drop or click to upload your brain MRI image. We support JPG, PNG, and JPEG formats up to 10MB.",
        icon: "📤"
      },
      {
        step: "02",
        title: "AI Analysis",
        description:
          "Our advanced AI models analyze your scan using deep learning algorithms trained on thousands of medical images.",
        icon: "🧠"
      },
      {
        step: "03",
        title: "Get Results",
        description:
          "Receive detailed analysis with confidence levels and visual explanations highlighting areas of interest in seconds.",
        icon: "📊"
      }
    ].map((item, index) => (
      <div
        key={index}
        style={{
          background:
            "linear-gradient(135deg, rgba(16,24,34,0.8), rgba(20,30,45,0.9))",
          border: "2px solid #05fa8a33",
          borderRadius: "20px",
          padding: "2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.4s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 15px 35px #05fa8a44";
          e.currentTarget.style.borderColor = "#05fa8a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.borderColor = "#05fa8a33";
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, #05fa8a11 0%, transparent 70%)",
            pointerEvents: "none"
          }}
        ></div>

        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem"
          }}
        >
          {item.icon}
        </div>

        <div
          style={{
            fontSize: "1rem",
            color: "#05fa8c",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            letterSpacing: "2px"
          }}
        >
          STEP {item.step}
        </div>

        <h3
          style={{
            color: "#05fa8c",
            fontSize: "1.4rem",
            marginBottom: "1rem",
            fontWeight: "bold"
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            color: "#e0ffe2",
            lineHeight: "1.6",
            fontSize: "1rem"
          }}
        >
          {item.description}
        </p>
      </div>
    ))}
  </div>

  <div
    style={{
      marginTop: "3rem",
      padding: "1.5rem",
      background: "rgba(5,250,138,0.1)",
      border: "1px solid #05fa8a",
      borderRadius: "10px",
      textAlign: "center",
      maxWidth: "600px"
    }}
  >
    <p
      style={{
        color: "#05fa8c",
        fontWeight: "bold",
        marginBottom: "0.5rem"
      }}
    >
      🔒 Privacy & Security
    </p>
    <p
      style={{
        color: "#e0ffe2",
        fontSize: "0.9rem"
      }}
    >
      Your medical data is completely secure. We don't store your images
      permanently and all processing happens securely on our servers.
    </p>
  </div>
</div>


{/* Tools */}
<div
  name="tools"
  style={{
    minHeight: "50vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "4.5rem 8vw",
    background: `linear-gradient(rgba(18,26,40,0.9), rgba(18,26,40,0.95)), url(${doc10}) center/cover no-repeat`
  }}
>
  <h2
    style={{
      fontSize: "2.5rem",
      fontWeight: 700,
      marginBottom: "2rem",
      color: "#05fa8a"
    }}
  >
    🛠 Our Technology Stack
  </h2>
  <p
    style={{
      textAlign: "center",
      maxWidth: "800px",
      marginBottom: "3rem",
      color: "#e0ffe2",
      fontSize: "1.1rem",
      lineHeight: "1.6"
    }}
  >
    Our platform leverages cutting-edge technologies to deliver accurate and
    reliable brain tumor detection. From advanced neural networks to secure data
    management, every component is carefully selected for optimal performance.
  </p>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "2rem",
      width: "100%",
      maxWidth: "1000px"
    }}
  >
    {[
      {
        title: "AI & ML",
        subtitle: "Python, PyTorch, CNN",
        description:
          "Advanced neural networks trained on medical imaging data"
      },
      {
        title: "Database",
        subtitle: "Supabase",
        description:
          "Secure and scalable cloud database for reliable data storage"
      },
      {
        title: "Visualization",
        subtitle: "Grad-CAM",
        description:
          "Explainable AI showing exact tumor regions in MRI scans"
      },
      {
        title: "Backend API",
        subtitle: "FastAPI",
        description:
          "High-performance API handling predictions and responses"
      }
    ].map((tool, index) => (
      <div
        key={index}
        style={{
          background: "linear-gradient(135deg, #1a2332, #0f1419)",
          border: "2px solid #05fa8a",
          borderRadius: "15px",
          padding: "2rem",
          textAlign: "center",
          fontWeight: "bold",
          color: "#fff",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = "borderBlink 1.5s infinite";
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 25px #05fa8a33";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = "none";
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <h3
          style={{
            color: "#05fa8c",
            fontSize: "1.3rem",
            marginBottom: "0.5rem"
          }}
        >
          {tool.title}
        </h3>
        <div
          style={{
            color: "#05fa8a",
            fontSize: "1rem",
            marginBottom: "1rem",
            fontWeight: "normal"
          }}
        >
          {tool.subtitle}
        </div>
        <p
          style={{
            color: "#b0b8c1",
            fontSize: "0.9rem",
            lineHeight: "1.4",
            fontWeight: "normal"
          }}
        >
          {tool.description}
        </p>
      </div>
    ))}
  </div>
</div>

{/* Contact */}
<div name="contact" style={{
  minHeight:"40vh",
  color:"#fff",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  flexDirection:"column",
  padding:"4.5rem 8vw",
  background: `linear-gradient(rgba(18,26,40,0.9), rgba(18,26,40,0.95)), url(${doc2}) center/cover no-repeat`
}}>

  <h2 style={{ fontSize:"2.5rem", fontWeight:700, marginBottom:"1.5rem", color:"#05fa8a" }}>Get In Touch</h2>
  <p style={{ textAlign:"center", maxWidth:"600px", marginBottom:"3rem", color:"#e0ffe2", fontSize:"1.1rem" }}>
    We'd love to hear from you! Whether you have questions, feedback, or collaboration ideas, feel free to reach out through any of these channels.
  </p>
  
  <div style={{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:"2rem",
    flexWrap:"wrap"
  }}>
    {contactLinks.map((contact, index) => {
      const IconComponent = contact.icon;
      return (
        <div key={index} style={{ textAlign:"center" }}>
          <div
            style={{
              width:"80px",
              height:"80px",
              borderRadius:"50%",
              background:"linear-gradient(135deg, #05fa8a22, #05fa8a11)",
              border:"3px solid #05fa8a",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              cursor:"pointer",
              transition:"all 0.3s ease",
              marginBottom:"0.5rem"
            }}
            onClick={() => window.open(contact.href, '_blank')}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 0 20px #05fa8a77";
              e.currentTarget.style.background = "linear-gradient(135deg, #05fa8a44, #05fa8a22)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.background = "linear-gradient(135deg, #05fa8a22, #05fa8a11)";
            }}
          >
            <IconComponent size={32} color="#05fa8a" />
          </div>
          {contact.label === "Phone" && (
            <div style={{ color:"#e0ffe2", fontSize:"0.9rem", fontWeight:"bold" }}>
              {contact.value}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>

      <style>
        {`
          @keyframes borderBlink {
            0%, 100% { border-color: #05fa8a; }
            50% { border-color: #05fa8a88; }
          }
        `}
      </style>
    </div>
  );
};
