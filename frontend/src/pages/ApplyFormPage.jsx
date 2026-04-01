import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import {
  CheckCircle,
  XCircle,
  Upload,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  Award,
  Code,
  MapPin,
  Linkedin,
  Github,
  FileText,
} from "lucide-react";

const ApplyFormPage = () => {
  const skillKeywords = {
    frontend: ["react", "javascript", "html", "css", "tailwind", "redux", "next.js"],
    backend: ["node", "express", "mongodb", "sql", "postgres", "rest api", "jwt"],
    data: ["python", "pandas", "machine learning", "numpy", "power bi", "tableau"],
    devops: ["docker", "kubernetes", "aws", "ci/cd", "terraform"],
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultRole = queryParams.get("role") || "";

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: defaultRole,
    experience: "",
    skills: "",
    location: "",
    linkedin: "",
    github: "",
    resume: null,
  });

  const [jobs, setJobs] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [suggestedRoles, setSuggestedRoles] = useState([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [resumeFeedback, setResumeFeedback] = useState([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const detectSkills = (text) => {
    const lowerText = text.toLowerCase();
    const found = [];

    Object.entries(skillKeywords).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        if (lowerText.includes(keyword.toLowerCase())) {
          found.push({ category, skill: keyword });
        }
      });
    });

    return Array.from(new Set(found.map((item) => `${item.category}:${item.skill}`))).map((item) => {
      const [category, skill] = item.split(":");
      return { category, skill };
    });
  };

  const suggestRoles = (skills) => {
    const categories = new Set(skills.map((s) => s.category));
    const roles = [];

    if (categories.has("frontend")) roles.push("Frontend Developer");
    if (categories.has("backend")) roles.push("Backend Developer");
    if (categories.has("frontend") && categories.has("backend")) roles.push("Full Stack Developer");
    if (categories.has("data")) roles.push("Data Analyst");
    if (categories.has("devops")) roles.push("DevOps Engineer");

    if (!roles.length) roles.push("Software Engineer (General)");
    return Array.from(new Set(roles));
  };

  const calculateResumeScore = (text, skills) => {
    let score = 0;
    const hasFramework = ["react", "angular", "vue", "node", "express", "django", "spring"].some((k) =>
      text.includes(k)
    );
    const hasExperience = ["experience", "internship", "intern", "worked at", "employment"].some((k) =>
      text.includes(k)
    );

    if (skills.length >= 5) score += 20;
    if (text.includes("github")) score += 20;
    if (text.includes("project")) score += 20;
    if (hasFramework) score += 20;
    if (hasExperience) score += 20;

    return Math.min(score, 100);
  };

  const generateResumeFeedback = (text, skills) => {
    const feedback = [];

    if (!text.includes("github")) feedback.push("Add GitHub profile or project links.");
    if (!text.includes("project")) feedback.push("Include a section describing your projects.");
    if (skills.length < 3) feedback.push("List more technical skills relevant to your target role.");
    if (!text.includes("internship") && !text.includes("experience")) {
      feedback.push("Mention internships, freelance work, or practical experience.");
    }
    if (!feedback.length) feedback.push("Great resume structure! Keep tailoring it for each role.");

    return feedback;
  };

  const extractResumeText = async (file) => {
    let pdfjsLib;
    try {
      const localPdfJsPath = "pdfjs-dist/build/pdf.mjs";
      pdfjsLib = await import(/* @vite-ignore */ localPdfJsPath);
    } catch (error) {
      pdfjsLib = await import(
        /* @vite-ignore */ "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs"
      );
    }

    const workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    const pages = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      pages.push(pageText);
    }

    return pages.join(" ").toLowerCase();
  };

  const analyzeResume = async (file) => {
    setAnalysisError("");
    setDetectedSkills([]);
    setSuggestedRoles([]);
    setResumeScore(0);
    setResumeFeedback([]);
    setResumeText("");

    if (!file) return;
    if (file.type !== "application/pdf") {
      setAnalysisError("Resume analysis supports PDF files only.");
      return;
    }

    try {
      setAnalysisLoading(true);
      const extractedText = await extractResumeText(file);
      const skills = detectSkills(extractedText);
      const roles = suggestRoles(skills);
      const score = calculateResumeScore(extractedText, skills);
      const feedback = generateResumeFeedback(extractedText, skills);

      setResumeText(extractedText);
      setDetectedSkills(skills);
      setSuggestedRoles(roles);
      setResumeScore(score);
      setResumeFeedback(feedback);
    } catch (error) {
      setAnalysisError("Unable to parse this PDF. Please try another resume file.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ✅ Fetch jobs from backend to generate roles list
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/jobs");

        // ✅ depending on backend response structure
        const jobsFromApi = res.data.jobs || res.data;

        setJobs(jobsFromApi);

        // ✅ unique roles (job titles)
        const roles = [...new Set(jobsFromApi.map((job) => job.title))];
        setAvailableRoles(roles);
      } catch (error) {
        console.log("❌ Failed to fetch jobs:", error.message);
      }
    };

    fetchJobs();
  }, []);

  const experienceOptions = [
    "0-1 years (Student/New Grad)",
    "1-2 years (Junior)",
    "2-4 years (Mid-level)",
    "4-7 years (Senior)",
    "7+ years (Lead/Principal)",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (
      !/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\D/g, ""))
    )
      newErrors.phone = "Phone number is invalid";

    if (!formData.role) newErrors.role = "Please select a role";
    if (!formData.experience)
      newErrors.experience = "Please select experience level";
    if (!formData.skills.trim()) newErrors.skills = "Skills are required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (!formData.resume) newErrors.resume = "Resume is required";
    else if (formData.resume.type !== "application/pdf")
      newErrors.resume = "Only PDF files are allowed";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      const file = files?.[0] || null;
      setResumeFile(file);
      setFormData((prev) => ({ ...prev, resume: file }));
      analyzeResume(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("experience", formData.experience);
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("github", formData.github);
      formDataToSend.append("resume", formData.resume);
      formDataToSend.append("timestamp", new Date().toISOString());

      const apiURL = "http://localhost:5000/api/applications/apply";

      const response = await fetch(apiURL, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to apply");
      }

      setIsSubmitted(true);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        experience: "",
        skills: "",
        location: "",
        linkedin: "",
        github: "",
        resume: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        "Failed to submit application. Please try again or email careers@aparaitech.com"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <div className="min-h-screen">
      <div className="section-padding py-8">
        <PageHeader
          title="Apply Now"
          subtitle="Submit your application to join our team of innovators"
        />

        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-100 mb-3">
                ✅ Application Submitted Successfully!
              </h3>
              <p className="text-emerald-100/80 mb-6">
                Thank you for applying to Aparaitech. Our hiring team will review
                your application and contact you within 5-7 business days.
              </p>
              <div className="bg-emerald-500/10 p-4 rounded-lg">
                <p className="text-blue-800">
                  <strong>Next steps:</strong> Check your email for a
                  confirmation and next steps.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card p-6 md:p-8"
            >
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Full Name *</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`input-field ${
                        errors.fullName
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Address *</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Phone Number *</span>
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-field ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Location *</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`input-field ${
                        errors.location
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      placeholder="City, Country"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Role Applying For *</span>
                      </div>
                    </label>

                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`input-field ${
                        errors.role
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select a role</option>

                      {availableRoles.length > 0 ? (
                        availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading roles...</option>
                      )}
                    </select>

                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Experience Level *</span>
                      </div>
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={`input-field ${
                        errors.experience
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select experience</option>
                      {experienceOptions.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4" />
                      <span>Skills & Technologies *</span>
                    </div>
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows={4}
                    className={`input-field ${
                      errors.skills
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    placeholder="List your technical skills, programming languages, frameworks, and tools (e.g., React, Node.js, Python, AWS, Docker...)"
                  />
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                  )}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn Profile (Optional)</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4" />
                        <span>GitHub Profile (Optional)</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-emerald-100/90 mb-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Resume (PDF only) *</span>
                    </div>
                  </label>
                  <div className="mt-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-emerald-500/10">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-emerald-200/60 mb-2" />
                        {formData.resume ? (
                          <p className="text-sm text-emerald-100 font-medium">
                            {formData.resume.name}
                          </p>
                        ) : (
                          <>
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF file only (Max 5MB)
                            </p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        name="resume"
                        accept=".pdf,application/pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.resume}
                      </p>
                    )}
                    {analysisError && (
                      <p className="mt-2 text-sm text-red-500">{analysisError}</p>
                    )}
                  </div>
                </div>

                {/* Resume Analysis */}
                <div className="card p-5">
                  <h4 className="text-lg font-semibold text-emerald-100 mb-3">Resume Analysis</h4>

                  {analysisLoading ? (
                    <div className="flex items-center gap-2 text-emerald-200">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Analyzing your resume...</span>
                    </div>
                  ) : resumeFile ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <p className="text-sm text-emerald-200 mb-2">Resume Score:</p>
                        <div className="w-full bg-slate-800 rounded-full h-3 border border-emerald-500/20 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-700"
                            style={{ width: `${resumeScore}%` }}
                          />
                        </div>
                        <p className="text-xs text-emerald-100/70 mt-1">{resumeScore}/100</p>
                        <p className="text-xs text-emerald-100/60 mt-1">Parsed text length: {resumeText.length} chars</p>
                      </div>

                      <div>
                        <p className="text-sm text-emerald-200 mb-2">Detected Skills:</p>
                        {detectedSkills.length ? (
                          <div className="flex flex-wrap gap-2">
                            {detectedSkills.map((item, idx) => (
                              <span
                                key={`${item.skill}-${idx}`}
                                className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-100"
                              >
                                {item.skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-emerald-100/70">No known skills detected yet.</p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-emerald-200 mb-2">Suggested Roles:</p>
                        <div className="flex flex-wrap gap-2">
                          {suggestedRoles.map((role) => (
                            <span
                              key={role}
                              className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-100"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-emerald-200 mb-2">Resume Feedback:</p>
                        <ul className="list-disc list-inside text-sm text-emerald-100/90 space-y-1">
                          {resumeFeedback.map((item, idx) => (
                            <li key={`${item}-${idx}`}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <p className="text-sm text-emerald-100/70">
                      Upload your resume to detect technical skills and get role suggestions.
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-emerald-500/20">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    By submitting this application, you agree to our{" "}
                    <a href="#" className="text-emerald-300 hover:text-emerald-200">
                      Privacy Policy
                    </a>
                    . We'll contact you via email regarding your application.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyFormPage;
