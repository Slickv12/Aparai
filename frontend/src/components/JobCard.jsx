import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, ChevronRight, Laptop, Heart, Eye } from 'lucide-react';

const JobCard = ({ job, isFavorite, onToggleFavorite, onQuickView }) => {
  return (
    <div className="card p-5 h-full transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-emerald-100 group-hover:text-emerald-300 transition-colors">
              {job.title}
            </h3>
            <p className="text-emerald-100/80 mt-1">{job.department}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuickView?.(job)}
              className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite?.(job._id)}
              className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300"
              aria-label="Save job"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-emerald-400 text-emerald-400' : ''}`} />
            </button>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              job.type === 'Internship' 
                ? 'bg-purple-100 text-purple-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {job.type}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mb-4 text-emerald-100/80 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
            {job.isRemote && (
              <span className="flex items-center space-x-1 text-emerald-300">
                <Laptop className="h-3 w-3" />
                <span className="text-sm">Remote</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{job.postedDate}</span>
          </div>
        </div>

        <p className="text-emerald-100/80 mb-5 line-clamp-3 text-sm leading-relaxed">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {job.techStack.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-emerald-500/10 text-emerald-100/90 text-sm rounded-full hover:bg-emerald-500/20 transition-colors"
            >
              {tech}
            </span>
          ))}
          {job.techStack.length > 4 && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-100/90 text-sm rounded-full">
              +{job.techStack.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20 mt-auto">
          <div className="text-base md:text-lg font-bold text-emerald-100">
            {job.salaryRange}
          </div>
          <Link
            to={`/apply?role=${encodeURIComponent(job.title)}`}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Apply Now</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
