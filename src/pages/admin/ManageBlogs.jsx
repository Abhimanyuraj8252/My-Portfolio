import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import API_BASE_URL from "../../config";
import RichTextEditor from "../../components/admin/RichTextEditor";

import { uploadToCloudinary } from "../../lib/cloudinary/service";
import { Pencil, Trash2, Eye, EyeOff, Star, Plus, X, ChevronDown, ChevronUp, Menu, ArrowLeft, Search, ArrowUpDown } from "lucide-react";

const ManageBlogs = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState('list');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [expandedBlog, setExpandedBlog] = useState(null);
    const [blogSearch, setBlogSearch] = useState('');
    const [blogFilter, setBlogFilter] = useState('all');
    const [blogSort, setBlogSort] = useState('newest');
    const [showBlogSort, setShowBlogSort] = useState(false);

    const filteredBlogs = useMemo(() => {
        let result = [...blogs];
        if (blogSearch) {
            const q = blogSearch.toLowerCase();
            result = result.filter(b => b.title.toLowerCase().includes(q) || b.category?.toLowerCase().includes(q) || b.tags?.some(t => t.toLowerCase().includes(q)));
        }
        if (blogFilter === 'published') result = result.filter(b => b.published);
        else if (blogFilter === 'draft') result = result.filter(b => !b.published);
        else if (blogFilter === 'featured') result = result.filter(b => b.featured);
        if (blogSort === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        else if (blogSort === 'oldest') result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        else if (blogSort === 'title_az') result.sort((a, b) => a.title.localeCompare(b.title));
        else if (blogSort === 'title_za') result.sort((a, b) => b.title.localeCompare(a.title));
        return result;
    }, [blogs, blogSearch, blogFilter, blogSort]);

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        category: '',
        tags: [],
        reading_time: 5,
        featured: false,
        published: false
    });
    const [tagInput, setTagInput] = useState('');
    const [coverUploading, setCoverUploading] = useState(false);

    const categories = [
        'Technology', 'Web Development', 'App Development',
        'UI/UX Design', 'SEO', 'Digital Marketing',
        'Programming', 'Tutorial', 'News', 'Personal', 'Other'
    ];

    useEffect(() => {
        fetchBlogs();
    }, []);

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/blogs`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setBlogs(data || []);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setForm({
            title: '',
            excerpt: '',
            content: '',
            cover_image: '',
            category: '',
            tags: [],
            reading_time: 5,
            featured: false,
            published: false
        });
        setTagInput('');
        setEditingBlog(null);
    };

    const handleCreateNew = () => {
        resetForm();
        setView('create');
    };

    const handleEdit = (blog) => {
        setForm({
            title: blog.title || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            cover_image: blog.cover_image || '',
            category: blog.category || '',
            tags: blog.tags || [],
            reading_time: blog.reading_time || 5,
            featured: blog.featured || false,
            published: blog.published || false
        });
        setEditingBlog(blog);
        setView('edit');
    };

    const handleCancel = () => {
        resetForm();
        setView('list');
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCoverUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setForm({ ...form, cover_image: url });
        } catch (err) {
            alert('Cover image upload failed: ' + err.message);
        }
        setCoverUploading(false);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleSave = async () => {
        if (!form.title || !form.content) {
            alert("Please fill in Title and Content");
            return;
        }

        setSaving(true);
        const slug = form.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        const blogData = {
            title: form.title,
            slug: slug,
            excerpt: form.excerpt,
            content: form.content,
            cover_image: form.cover_image,
            category: form.category,
            tags: form.tags,
            reading_time: form.reading_time,
            featured: form.featured,
            published: form.published,
            /* updated_at is handled by DB automatically usually, but passing is fine if schema allows */
        };

        try {
            let res;
            if (editingBlog) {
                res = await fetch(`${API_BASE_URL}/api/blogs/${editingBlog.id}`, {
                    method: 'PUT',
                    headers: getHeaders(),
                    body: JSON.stringify(blogData)
                });
            } else {
                res = await fetch(`${API_BASE_URL}/api/blogs`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(blogData)
                });
            }

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Unknown error');
            }

            alert(editingBlog ? "Blog updated!" : "Blog created!");
            resetForm();
            setView('list');
            fetchBlogs();
        } catch (error) {
            alert("Error saving blog: " + error.message);
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (res.ok) {
                fetchBlogs();
            } else {
                const errData = await res.json();
                alert("Error deleting: " + (errData.error || 'Unknown error'));
            }
        } catch (err) {
            alert("Error deleting: " + err.message);
        }
    };

    const togglePublish = async (blog) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/blogs/${blog.id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ published: !blog.published })
            });

            if (res.ok) fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleFeatured = async (blog) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/blogs/${blog.id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ featured: !blog.featured })
            });

            if (res.ok) fetchBlogs();
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const calculateReadingTime = (text) => {
        const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
        return Math.max(1, Math.ceil(words / 200));
    };

    const handleContentChange = (newContent) => {
        const readingTime = calculateReadingTime(newContent);
        setForm({ ...form, content: newContent, reading_time: readingTime });
    };

    const getPageTitle = () => {
        if (view === 'list') return 'Manage Blogs';
        if (view === 'create') return 'Create Blog';
        return 'Edit Blog';
    };

    return (
        <div className="flex min-h-screen bg-[#0f1117]">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 md:ml-64 min-h-screen">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center gap-4 p-4 bg-[#161822] border-b border-[#252836] sticky top-0 z-30">
                    {view === 'list' ? (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                    ) : (
                        <button
                            onClick={handleCancel}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-white text-lg font-bold flex-1">{getPageTitle()}</h1>
                    {view === 'list' && (
                        <button
                            onClick={handleCreateNew}
                            className="p-2 bg-green-600 rounded-lg"
                        >
                            <Plus size={20} />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-6 xl:p-8 text-white">
                    {/* Desktop Header */}
                    <div className="hidden md:flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white/90">{getPageTitle()}</h1>
                            {view === 'list' && <p className="text-white/30 text-xs mt-0.5">{blogs.length} total · {blogs.filter(b => b.published).length} published</p>}
                        </div>
                        {view === 'list' ? (
                            <button onClick={handleCreateNew}
                                className="flex items-center gap-2 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/25 text-violet-300 py-2.5 px-5 rounded-xl font-semibold text-sm transition-all">
                                <Plus size={16} /> New Blog
                            </button>
                        ) : (
                            <button onClick={handleCancel}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-white/50 py-2.5 px-5 rounded-xl font-semibold text-sm transition-all">
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>

                    {/* LIST VIEW */}
                    {view === 'list' && (
                        <div className="space-y-4">
                            {/* Search + Sort */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input type="text" placeholder="Search by title, category, tags..." value={blogSearch} onChange={(e) => setBlogSearch(e.target.value)}
                                        className="w-full bg-[#1a1d2e] text-white text-sm py-3 pl-11 pr-4 rounded-xl border border-[#252836] focus:border-purple-500/50 outline-none placeholder:text-white/25 transition-all" />
                                </div>
                                <div className="relative">
                                    <button onClick={() => setShowBlogSort(!showBlogSort)}
                                        className="flex items-center gap-2 bg-[#1a1d2e] border border-[#252836] px-4 py-3 rounded-xl text-sm text-white/50 hover:text-white/80 hover:border-[#353849] transition-all whitespace-nowrap">
                                        <ArrowUpDown size={14} />
                                        {{ newest: 'Newest', oldest: 'Oldest', title_az: 'A→Z', title_za: 'Z→A' }[blogSort]}
                                        <ChevronDown size={14} />
                                    </button>
                                    {showBlogSort && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setShowBlogSort(false)} />
                                            <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1d2e] border border-[#252836] rounded-xl shadow-2xl z-40 py-2">
                                                {[{ v: 'newest', l: 'Newest First' }, { v: 'oldest', l: 'Oldest First' }, { v: 'title_az', l: 'Title A→Z' }, { v: 'title_za', l: 'Title Z→A' }].map(o => (
                                                    <button key={o.v} onClick={() => { setBlogSort(o.v); setShowBlogSort(false); }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm ${blogSort === o.v ? 'text-purple-400 bg-purple-500/10 font-bold' : 'text-white/50 hover:text-white hover:bg-[#252836]'}`}>{o.l}</button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Filter Tabs */}
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {[{ v: 'all', l: 'All', c: blogs.length }, { v: 'published', l: 'Published', c: blogs.filter(b => b.published).length }, { v: 'draft', l: 'Draft', c: blogs.filter(b => !b.published).length }, { v: 'featured', l: 'Featured', c: blogs.filter(b => b.featured).length }].map(f => (
                                    <button key={f.v} onClick={() => setBlogFilter(f.v)}
                                        className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${blogFilter === f.v ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20' : 'bg-[#1a1d2e] text-white/40 border border-[#252836] hover:text-white/70'}`}>
                                        {f.l} <span className="ml-1 opacity-60">({f.c})</span>
                                    </button>
                                ))}
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div></div>
                            ) : filteredBlogs.length === 0 ? (
                                <div className="text-center py-10 md:py-20 text-secondary">
                                    <p className="text-lg md:text-xl mb-4">{blogSearch || blogFilter !== 'all' ? 'No matching blogs found' : 'No blogs yet!'}</p>
                                    {blogFilter === 'all' && !blogSearch && <button onClick={handleCreateNew} className="bg-violet-600 hover:bg-violet-700 py-3 px-6 rounded-lg font-bold">Create Your First Blog</button>}
                                </div>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <div key={blog.id} className="bg-black-100 rounded-2xl overflow-hidden">
                                        {/* Blog Header */}
                                        <div
                                            className="p-4 md:p-6 cursor-pointer hover:bg-black-200 transition-colors"
                                            onClick={() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                                <div className="flex gap-3 md:gap-4 min-w-0 flex-1">
                                                    {blog.cover_image && (
                                                        <img src={blog.cover_image} alt="" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0" />
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="text-base md:text-xl font-bold flex items-center gap-2 flex-wrap">
                                                            <span className="line-clamp-2 break-words">{blog.title}</span>
                                                            {blog.featured && <Star className="text-yellow-500 flex-shrink-0" size={16} fill="currentColor" />}
                                                        </h3>
                                                        <p className="text-secondary text-xs md:text-sm mt-1">
                                                            {blog.category && <span className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded mr-2">{blog.category}</span>}
                                                            {formatDate(blog.created_at)} • {blog.reading_time || 5} min
                                                        </p>
                                                        {blog.tags?.length > 0 && (
                                                            <div className="hidden md:flex gap-1 mt-2 flex-wrap">
                                                                {blog.tags.map((tag, i) => (
                                                                    <span key={i} className="bg-tertiary text-xs px-2 py-1 rounded">{tag}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 self-end sm:self-start">
                                                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold ${blog.published ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {blog.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    {expandedBlog === blog.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Actions */}
                                        {expandedBlog === blog.id && (
                                            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-2 border-t border-gray-800">
                                                {blog.excerpt && (
                                                    <p className="text-secondary mb-4 text-sm">{blog.excerpt}</p>
                                                )}
                                                <div className="flex flex-wrap gap-2 md:gap-3">
                                                    <button
                                                        onClick={() => handleEdit(blog)}
                                                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm"
                                                    >
                                                        <Pencil size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => togglePublish(blog)}
                                                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm ${blog.published ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
                                                    >
                                                        {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        <span className="hidden sm:inline">{blog.published ? 'Unpublish' : 'Publish'}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => toggleFeatured(blog)}
                                                        className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm ${blog.featured ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                                                    >
                                                        <Star size={16} fill={blog.featured ? "currentColor" : "none"} />
                                                        <span className="hidden sm:inline">{blog.featured ? 'Unfeature' : 'Feature'}</span>
                                                    </button>
                                                    <a
                                                        href={`/blog/${blog.slug}`}
                                                        target="_blank"
                                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm"
                                                    >
                                                        <Eye size={16} /> <span className="hidden sm:inline">View</span>
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(blog.id)}
                                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 md:px-4 py-2 rounded-lg transition-colors text-sm"
                                                    >
                                                        <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* CREATE/EDIT VIEW */}
                    {(view === 'create' || view === 'edit') && (
                        <div className="max-w-5xl space-y-4 md:space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-secondary mb-2 text-sm md:text-base">Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Enter blog title..."
                                    className="w-full bg-tertiary py-3 md:py-4 px-4 md:px-6 rounded-lg text-white text-base md:text-xl outline-none font-bold"
                                />
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-secondary mb-2 text-sm md:text-base">Cover Image</label>
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 sm:items-center">
                                    {form.cover_image && (
                                        <img src={form.cover_image} alt="Cover" className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg" />
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            className="hidden"
                                            id="cover-upload"
                                        />
                                        <label
                                            htmlFor="cover-upload"
                                            className="bg-tertiary hover:bg-[#1f1b3c] py-3 px-6 rounded-lg cursor-pointer transition-colors text-center"
                                        >
                                            {coverUploading ? 'Uploading...' : 'Upload'}
                                        </label>
                                        <span className="text-secondary text-center">or</span>
                                        <input
                                            type="text"
                                            value={form.cover_image}
                                            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                                            placeholder="Paste image URL..."
                                            className="flex-1 bg-tertiary py-3 px-4 rounded-lg text-white outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category & Reading Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label className="block text-secondary mb-2 text-sm md:text-base">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-tertiary py-3 px-4 rounded-lg text-white outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-secondary mb-2 text-sm md:text-base">Reading Time (min)</label>
                                    <input
                                        type="number"
                                        value={form.reading_time}
                                        onChange={(e) => setForm({ ...form, reading_time: parseInt(e.target.value) || 1 })}
                                        min="1"
                                        className="w-full bg-tertiary py-3 px-4 rounded-lg text-white outline-none"
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-secondary mb-2 text-sm md:text-base">Tags</label>
                                <div className="flex gap-2 flex-wrap mb-2">
                                    {form.tags.map((tag, i) => (
                                        <span key={i} className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                                            {tag}
                                            <X size={14} className="cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        placeholder="Add a tag..."
                                        className="flex-1 bg-tertiary py-3 px-4 rounded-lg text-white outline-none"
                                    />
                                    <button
                                        onClick={handleAddTag}
                                        className="bg-violet-600 hover:bg-violet-700 px-4 rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-secondary mb-2 text-sm md:text-base">Excerpt / Short Description</label>
                                <textarea
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    placeholder="Brief description of the blog..."
                                    rows={3}
                                    className="w-full bg-tertiary py-3 px-4 rounded-lg text-white outline-none resize-none"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-secondary mb-2 text-sm md:text-base">Content *</label>
                                <div className="rounded-lg overflow-hidden">
                                    <RichTextEditor
                                        value={form.content}
                                        onEditorChange={handleContentChange}
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.published}
                                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span>Publish Immediately</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.featured}
                                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                        className="w-5 h-5 rounded"
                                    />
                                    <span>Featured Blog</span>
                                </label>
                            </div>

                            {/* Save Button */}
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-green-600 hover:bg-green-700 py-3 px-8 rounded-lg font-bold transition-colors w-full sm:w-auto"
                                >
                                    {saving ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-600 hover:bg-gray-700 py-3 px-8 rounded-lg font-bold transition-colors w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBlogs;
