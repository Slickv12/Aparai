import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import JobCard from "../components/JobCard";
import PageHeader from "../components/PageHeader";
import { Briefcase, Heart, X } from "lucide-react";

const OpenPositionsPage = () => {
  const [jobs, setJobs] = useState([]); // ✅ all jobs from backend
  const [filteredJobs, setFilteredJobs] = useState([]); // ✅ filtered jobs
  const [loading, setLoading] = useState(true);
  const [favoriteJobIds, setFavoriteJobIds] = useState([]);
  const [quickViewJob, setQuickViewJob] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    experience: "",
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ Fetch jobs from backend
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favoriteJobs") || "[]");
    setFavoriteJobIds(saved);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/jobs");
        const jobsFromApi = res.data.jobs || res.data; // depends on your response

        setJobs(jobsFromApi);
        setFilteredJobs(jobsFromApi);
      } catch (error) {
        console.log("❌ Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const toggleFavorite = (jobId) => {
    setFavoriteJobIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem("favoriteJobs", JSON.stringify(next));
      return next;
    });
  };

  // ✅ Apply filters on backend jobs
  useEffect(() => {
    let result = jobs;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower) ||
          job.techStack?.some((tech) =>
            tech.toLowerCase().includes(searchLower)
          ) ||
          job.department?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.location) {
      if (filters.location === "Remote") {
        result = result.filter((job) => job.isRemote);
      } else if (filters.location === "Hybrid") {
        result = result.filter((job) => job.location?.includes("Hybrid"));
      } else if (filters.location === "On-site") {
        result = result.filter((job) => job.location?.includes("On-site"));
      } else {
        result = result.filter((job) =>
          job.location?.includes(filters.location)
        );
      }
    }

    if (filters.type) {
      result = result.filter((job) => job.type === filters.type);
    }

    if (filters.experience) {
      result = result.filter((job) => {
        if (filters.experience === "entry") {
          return job.experience?.includes("0-") || job.experience?.includes("1+");
        }
        if (filters.experience === "mid") {
          return job.experience?.includes("2+") || job.experience?.includes("3+");
        }
        if (filters.experience === "senior") {
          return job.experience?.includes("4+") || job.experience?.includes("5+");
        }
        return true;
      });
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  const jobCount = filteredJobs.length;

  return (
    <div className="min-h-screen">
      <div className="section-padding py-8 md:py-10">
        <PageHeader
          title="Open Positions"
          subtitle="Find your perfect role and join our team of innovators"
        >
          <div className="flex items-center space-x-2 text-emerald-100/80 mt-4">
            <Briefcase className="h-5 w-5" />
            <span>
              {jobCount} open position{jobCount !== 1 ? "s" : ""}
            </span>
          </div>
        </PageHeader>

        <div className="sticky top-24 z-30 mb-8">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="card p-6 animate-pulse">
                <div className="h-6 w-2/3 bg-emerald-500/20 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-emerald-500/20 rounded mb-6"></div>
                <div className="h-4 w-full bg-emerald-500/10 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-emerald-500/10 rounded mb-6"></div>
                <div className="h-9 w-28 bg-emerald-500/20 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 items-stretch"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id} // ✅ IMPORTANT: MongoDB uses _id
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <JobCard
                  job={job}
                  isFavorite={favoriteJobIds.includes(job._id)}
                  onToggleFavorite={toggleFavorite}
                  onQuickView={setQuickViewJob}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-emerald-300" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-100 mb-3">
              No positions match your filters
            </h3>
            <p className="text-emerald-100/80 mb-8">
              Try adjusting your search criteria or check back later for new openings.
            </p>
            <button
              onClick={() =>
                handleFilterChange({
                  search: "",
                  location: "",
                  type: "",
                  experience: "",
                })
              }
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-emerald-500/20 text-center">
          <p className="text-emerald-100/80">
            Don't see the perfect role?{" "}
            <a
              href="mailto:careers@aparaitech.com"
              className="text-emerald-300 hover:text-emerald-200 font-medium"
            >
              Send us your resume
            </a>{" "}
            and we'll notify you when a matching position opens.
          </p>
        </div>

        {favoriteJobIds.length > 0 && (
          <div className="mt-6 text-sm text-emerald-300 flex items-center justify-center gap-2">
            <Heart className="h-4 w-4 fill-emerald-300" />
            Saved jobs: {favoriteJobIds.length}
          </div>
        )}

        {quickViewJob && (
          <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="w-full max-w-2xl card p-6 relative">
              <button
                type="button"
                className="absolute right-4 top-4 p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-200"
                onClick={() => setQuickViewJob(null)}
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-2xl font-bold text-emerald-100 mb-2">{quickViewJob.title}</h3>
              <p className="text-emerald-300 mb-4">{quickViewJob.department}</p>
              <p className="text-emerald-100/80 mb-4">{quickViewJob.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(quickViewJob.techStack || []).map((tech, i) => (
                  <span key={i} className="px-2 py-1 text-xs rounded-full bg-emerald-500/15 text-emerald-200">{tech}</span>
                ))}
              </div>
              <Link to={`/apply?role=${encodeURIComponent(quickViewJob.title)}`} className="btn-primary">
                Apply for this role
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenPositionsPage;
