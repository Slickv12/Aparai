import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FilterBar from "../components/FilterBar";
import JobCard from "../components/JobCard";
import PageHeader from "../components/PageHeader";
import { Briefcase } from "lucide-react";

const OpenPositionsPage = () => {
  const [jobs, setJobs] = useState([]); // ✅ all jobs from backend
  const [filteredJobs, setFilteredJobs] = useState([]); // ✅ filtered jobs
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
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/jobs");
        const jobsFromApi = res.data.jobs || res.data; // depends on your response

        setJobs(jobsFromApi);
        setFilteredJobs(jobsFromApi);
      } catch (error) {
        console.log("❌ Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
      <div className="section-padding py-8">
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

        <FilterBar onFilterChange={handleFilterChange} />

        {filteredJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id} // ✅ IMPORTANT: MongoDB uses _id
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
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
      </div>
    </div>
  );
};

export default OpenPositionsPage;
