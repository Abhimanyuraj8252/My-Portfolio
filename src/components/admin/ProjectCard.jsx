import React from 'react';
import { Edit, Trash, ExternalLink } from 'lucide-react';
import { m as motion } from 'framer-motion';

const ProjectCard = ({ project, onEdit, onDelete }) => {
    const isLive = project.status === 'Completed' && project.liveUrl;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-[#0f0f15]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] flex flex-col h-full z-10"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden">
                <motion.img
                    src={project.thumbnailUrl || 'https://via.placeholder.com/640x360?text=No+Image'}
                    alt={project.title}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-orange-400 shadow-[0_0_10px_#fb923c]'} animate-pulse`} />
                    <span className="text-xs font-semibold tracking-wider uppercase text-white/90">
                        {isLive ? 'Live' : project.status}
                    </span>
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(project)}
                        className="p-3 bg-white/10 text-white rounded-full border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-white/20 hover:border-white/40"
                        title="Edit Project"
                    >
                        <Edit size={20} />
                    </motion.button>

                    {project.liveUrl && (
                        <motion.a
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:bg-purple-500/40 hover:border-purple-500/50"
                            title="View Live"
                        >
                            <ExternalLink size={20} />
                        </motion.a>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(project.id)}
                        className="p-3 bg-red-500/20 text-red-300 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:bg-red-500/40 hover:border-red-500/50"
                        title="Delete Project"
                    >
                        <Trash size={20} />
                    </motion.button>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow relative z-20">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white tracking-wide truncate pr-4 group-hover:text-purple-300 transition-colors duration-300">{project.title}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-200/50 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20 shrink-0">
                        {project.category}
                    </span>
                </div>

                <p className="text-sm text-white/50 mb-6 line-clamp-2 leading-relaxed font-light">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {project.techStack?.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="text-[11px] font-semibold tracking-wider text-white/60 bg-white/5 px-2.5 py-1 rounded-md border border-white/5 hover:border-white/20 hover:text-white transition-colors duration-300"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack?.length > 4 && (
                            <span className="text-[11px] font-semibold tracking-wider text-white/40 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                +{project.techStack.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
