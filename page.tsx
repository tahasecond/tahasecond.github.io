'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Sticker {
  id: number;
  src: string;
  x: number;
  y: number;
}

interface Project {
  name: string;
  description: string;
  date: string;
  details: string[];
  githubLink?: string;
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('Hello World');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isStickersMenuOpen, setIsStickersMenuOpen] = useState(false);
  const [showStickers, setShowStickers] = useState(true);
  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);
  const sectionRefs = {
    skills: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    experience: useRef<HTMLElement>(null),
    education: useRef<HTMLElement>(null),
    certifications: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
    research: useRef<HTMLElement>(null),
  };

  const projects: Project[] = [
    {
      name: "Haircut Assistant App *work in progress*",
      description: "Innovative mobile application using AR and real-time image processing",
      date: "Aug 2024",
      details: [
        "Allows users to scan their hair, compare it with a desired haircut, and display precise measurements",
        "Enhances user satisfaction and confidence in haircut planning",
        "Implementing technologies in Python, OpenCV, ARKit/ARCore, React Native, and MATLAB"
      ],
      githubLink: "https://github.com/tahasecond/cutIt"
    },
    {
      name: "Form Validation System",
      description: "Robust form validation system using React.js with Formik and Yup",
      date: "April 2024",
      details: [
        "Ensured data integrity through comprehensive field validations",
        "Enhanced user experience and data accuracy with advanced error handling and user feedback"
      ],
      githubLink: "https://github.com/tahasecond/form-validation-react"
    },
    {
      name: "Passwordless Authentication System",
      description: "Secure authentication system using React.js, Node.js, Express, and Stytch API",
      date: "Feb 2024",
      details: [
        "Implemented magic link authentication sent to users' email",
        "Provides secure, passwordless entry for enhanced user experience"
      ],
      githubLink: "https://github.com/tahasecond/react-passwordless-ID"
    }
  ];

  const researchProjects: Project[] = [
    {
      name: "Experimental Flights",
      description: "Undergraduate Research @ Georgia Tech | Atlanta, GA | Aug 2024 – Present",
      date: "Aug 2024 – Present",
      details: [
        "Developing a drone delivery system, including hardware, flight testing, and user interface design for a consumer delivery app",
        "Improved flight plan algorithm, reducing average algorithm cost by 15%",
        "Implementing technologies in Python, ROS, MATLAB, Gazebo, and GitHub"
      ],
      githubLink: "https://github.com/yourusername/experimental-flights"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const texts = ['Hello World', 'My name is...', 'Taha Ahmad!'];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;

    const type = () => {
      const fullText = texts[currentIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setTypedText(currentText);

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => {
          isDeleting = true;
        }, 500);
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % texts.length;
      }

      const typingSpeed = isDeleting ? 50 : 100;
      setTimeout(type, typingSpeed);
    };

    type();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRefs.education.current) {
        const rect = sectionRefs.education.current.getBoundingClientRect();
        setShowStickers(rect.top > window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const backgroundStyle = {
    backgroundImage: `url('/background.jpg')`,
    backgroundPosition: `${50 + mousePosition.x / 50}% ${50 + mousePosition.y / 50}%`,
    transition: 'background-position 0.2s ease-out, background-color 0.5s ease-in-out, color 0.5s ease-in-out',
    backgroundColor: isDarkMode ? '#0a0a0a' : '#ffffff',
    color: isDarkMode ? '#ffffff' : '#0a0a0a',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('Sending...');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmitStatus(data.message || 'Message sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitStatus(errorData.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('An error occurred. Please try again later.');
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleStickerSelect = (sticker: string) => {
    setSelectedSticker(sticker);
    setIsStickersMenuOpen(false);
  };

  const handleStickerPlace = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedSticker) {
      const newSticker: Sticker = {
        id: Date.now(),
        src: selectedSticker,
        x: e.clientX,
        y: e.clientY,
      };
      setStickers([...stickers, newSticker]);
      setSelectedSticker(null);
    }
  };

  const clearStickers = () => {
    setStickers([]);
  };

  const toggleActivity = (index: number) => {
    setSelectedActivities(prevSelected => 
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  return (
    <div 
      className={`flex min-h-screen font-[family-name:var(--font-geist-sans)] ${isDarkMode ? 'dark' : ''}`} 
      style={backgroundStyle}
      onClick={handleStickerPlace}
    >
      <nav className="w-64 bg-background/80 p-8 flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Taha Ahmad</h1>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Navigation</h2>
          {Object.entries(sectionRefs).map(([key, ref]) => (
            <button
              key={key}
              onClick={() => scrollToSection(ref)}
              className="text-left hover:underline capitalize"
            >
              {key}
            </button>
          ))}
        </div>
        <button
          onClick={toggleTheme}
          className="mt-4 p-2 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
        >
          {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </nav>
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] p-8 pb-20 gap-16 sm:p-20">
        <header className="flex flex-row justify-between items-center bg-background/80 p-8 rounded-lg">
          <div className="flex flex-col gap-8 items-start">
            <Image
              className={isDarkMode ? 'invert' : ''}
              src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Georgia_Tech_Yellow_Jackets_logo.svg"
              alt="Georgia Tech logo"
              width={180}
              height={38}
              priority
            />
            <h1 className="text-4xl font-bold">
              {typedText}<span className="animate-pulse">|</span>
            </h1>
            <p className="text-xl">Undergraduate Student | Problem Solver | Tech Enthusiast</p>
            <p className="text-xl">
              <a href="https://www.linkedin.com/in/taha-ahmad-487878244/" target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a> | 
              <a href="https://github.com/tahasecond" target="_blank" rel="noopener noreferrer" className="hover:underline ml-2">GitHub</a>
            </p>
          </div>
          <Image
            src="/IMG_0807.PNG"
            alt="Taha Ahmad's profile picture"
            width={150}
            height={150}
            className="rounded-full"
          />
        </header>

        <main className="flex flex-col gap-16">
          <section ref={sectionRefs.education} className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Education</h2>
            <h3 className="text-2xl font-semibold">Georgia Institute of Technology</h3>
            <p>B.S. in Computer Science (Intelligence/Info Internetworks Thread)</p>
            <p>Minor in Law, Science, & Technology</p>
            <p>Expected Graduation: May 2026</p>
            <p>GPA: 3.5/4.0</p>
            <p className="mt-2"><strong>Relevant Coursework:</strong> Data Structures & Algorithms, Object Oriented Programming, Computer Architecture, Linear Algebra</p>
          </section>

          <section ref={sectionRefs.skills} className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Technical Skills</h2>
            <ul className="list-disc list-inside">
              <li><strong>Programming Languages:</strong> Proficient in Java, JavaScript, Lua, Python; Familiar with CSS, HTML, Swift</li>
              <li><strong>Tools & Technologies:</strong> Git, GitHub, XCode, AutoCAD, ARkit, React.js</li>
              <li><strong>Frameworks & Libraries:</strong> Familiar with TensorFlow, PyTorch</li>
              <li><strong>Other Skills:</strong> Video Editing, Photoshop, Microsoft Office</li>
            </ul>
          </section>

          <section ref={sectionRefs.experience} className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Experience</h2>
            <div className="mb-4">
              <h3 className="text-2xl font-semibold">Paid Assignment Developer</h3>
              <p className="text-xl">CS111 & CS112 Assignment Guru @ Rutgers University | New Brunswick, NJ | Apr 2024 – Aug 2024</p>
              <ul className="list-disc list-inside mt-2">
                <li>Collaborated with other developers to design and develop coding assignments for Intro to Computer Science and Data Structures & Algorithms Courses for over 1500+ students</li>
                <li>Designed a Data Structures (CS112) assignment featuring a two-level Hash Table Java assignment enabling the analysis of patterns in real-world data</li>
              </ul>
            </div>
          </section>

          <section ref={sectionRefs.projects} className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Projects</h2>
            <div className="grid grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="border border-foreground/20 rounded-lg p-4 cursor-pointer hover:bg-foreground/10 transition-colors"
                  onClick={() => setSelectedProject(project)}
                >
                  <h3 className="text-2xl font-semibold">{project.name}</h3>
                  <p className="text-sm text-foreground/60">{project.date}</p>
                </div>
              ))}
            </div>
            {selectedProject && !researchProjects.some(rp => rp.name === selectedProject.name) && (
              <div className="mt-8 border-t border-foreground/20 pt-4">
                <h3 className="text-2xl font-semibold">{selectedProject.name}</h3>
                <p className="text-xl mt-2">{selectedProject.description}</p>
                <ul className="list-disc list-inside mt-4">
                  {selectedProject.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                {selectedProject.githubLink && (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block p-2 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            )}
          </section>

          <section ref={sectionRefs.research} className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Research</h2>
            <div className="grid grid-cols-1 gap-4">
              {researchProjects.map((project, index) => (
                <div 
                  key={index} 
                  className="border border-foreground/20 rounded-lg p-4 cursor-pointer hover:bg-foreground/10 transition-colors"
                  onClick={() => setSelectedProject(project)}
                >
                  <h3 className="text-2xl font-semibold">{project.name}</h3>
                  <p className="text-sm text-foreground/60">{project.date}</p>
                </div>
              ))}
            </div>
            {selectedProject && researchProjects.some(rp => rp.name === selectedProject.name) && (
              <div className="mt-8 border-t border-foreground/20 pt-4">
                <h3 className="text-2xl font-semibold">{selectedProject.name}</h3>
                <p className="text-xl mt-2">{selectedProject.description}</p>
                <ul className="list-disc list-inside mt-4">
                  {selectedProject.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                {selectedProject.githubLink && (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block p-2 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            )}
          </section>
          <section ref={sectionRefs.certifications} className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Leadership and Community Engagement</h2>
            <ul className="list-none">
              {[
                {
                  title: "FIRST Robotics",
                  description: [
                    "Conducted projects to develop competition-ready robots, specializing in software for multiple robot subsystems.",
                    "Utilized automation and machine learning with a Limelight smart camera to accurately identify targets during competitions."
                  ]
                },
                {
                  title: "GT Data Science Initiative",
                  description: [
                    "Pursuing Machine Learning projects and the Intel Data Science Bootcamp organized by Intel Corporation."
                  ]
                },
                {
                  title: "GT Boxing Club",
                  description: [
                    "Participating in weekly team boxing sessions with the goal of competing at a competitive level."
                  ]
                },
                {
                  title: "Humanity First International Relief",
                  description: [
                    "Operated with community and disaster relief services communicating with non-native English speakers, refugees, and immigrants."
                  ]
                }
              ].map((activity, index) => (
                <li key={index} className="mb-4">
                  <button
                    onClick={() => setSelectedActivities(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])}
                    className="text-left w-full text-2xl font-semibold bg-foreground/10 p-2 rounded hover:bg-foreground/20 transition-colors"
                  >
                    {activity.title}
                  </button>
                  {selectedActivities.includes(index) && (
                    <ul className="mt-2 list-disc list-inside">
                      {activity.description.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-lg text-foreground/80 typewriter">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <style jsx>{`
            .typewriter {
              overflow: hidden;
              border-right: .15em solid orange;
              white-space: normal;
              margin: 0 auto;
              letter-spacing: .15em;
              animation: 
                typing 3.5s steps(40, end),
                blink-caret .75s step-end infinite;
            }

            @keyframes typing {
              from { width: 0 }
              to { width: 100% }
            }

            @keyframes blink-caret {
              from, to { border-color: transparent }
              50% { border-color: orange; }
            }
          `}</style>

          <section className="bg-background/80 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Additional Information</h2>
            <ul className="list-disc list-inside">
              <li><strong>Languages:</strong> English (Native), Hindi/Urdu (Full Professional Proficiency), Arabic (Intermediate Proficiency)</li>
              <li><strong>Certifications & Training:</strong> CodePath Intro to Web Development Certification, CodePath Technical Interview Prep</li>
              <li><strong>Interests:</strong> Video Game Development, Boxing, Spikeball, MMA Fighting, 3D Modeling</li>
            </ul>   
          </section>
        </main>

        <footer ref={sectionRefs.contact} className="bg-background/80 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Contact Me *work in progress*</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="p-2 rounded"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-2 rounded"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Your Message"
              className="p-2 rounded"
              required
            ></textarea>
            <button type="submit" className="p-2 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors">
              Send Message
            </button>
          </form>
          {submitStatus && <p className="mt-4">{submitStatus}</p>}
        </footer>
      </div>
      {showStickers && (
        <div className="fixed right-0 top-0 h-full w-64 bg-background/80 p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Stickers</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {['🎉', '🚀', '💡', '🌈', '🔥'].map((sticker) => (
              <button
                key={sticker}
                onClick={() => handleStickerSelect(sticker)}
                className="text-2xl p-2 border rounded hover:bg-foreground/10"
              >
                {sticker}
              </button>
            ))}
          </div>
          <button
            onClick={clearStickers}
            className="mt-auto p-2 bg-foreground text-background rounded hover:bg-foreground/90 transition-colors"
          >
            Clear Stickers
          </button>
        </div>
      )}
      {stickers.map((sticker) => (
        <div
          key={sticker.id}
          style={{
            position: 'fixed',
            left: sticker.x,
            top: sticker.y,
            fontSize: '2rem',
            userSelect: 'none',
          }}
        >
          {sticker.src}
        </div>
      ))}
      {selectedSticker && (
        <div
          style={{
            position: 'fixed',
            left: mousePosition.x,
            top: mousePosition.y,
            fontSize: '2rem',
            pointerEvents: 'none',
            opacity: 0.7,
          }}
        >
          {selectedSticker}
        </div>
      )}
    </div>
  );
}