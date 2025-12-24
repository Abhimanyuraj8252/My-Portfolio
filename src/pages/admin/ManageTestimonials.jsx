import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { supabase } from "../../lib/supabase/client";
import { Check, Trash2 } from "lucide-react";

const ManageTestimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReview, setEditingReview] = useState(null); // Track review being edited
    const [editForm, setEditForm] = useState({ name: "", message: "", rating: 5, approved: false });

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setReviews(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleApprove = async (id, currentStatus) => {
        const { error } = await supabase
            .from('reviews')
            .update({ approved: !currentStatus })
            .eq('id', id);

        if (!error) fetchReviews();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            const { error } = await supabase
                .from('reviews')
                .delete()
                .eq('id', id);

            if (!error) fetchReviews();
        }
    };

    const startEdit = (review) => {
        setEditingReview(review.id);
        setEditForm({
            name: review.name,
            message: review.message,
            rating: review.rating,
            approved: review.approved
        });
    };

    const cancelEdit = () => {
        setEditingReview(null);
    };

    const saveEdit = async () => {
        const { error } = await supabase
            .from('reviews')
            .update({
                name: editForm.name,
                message: editForm.message,
                rating: editForm.rating,
                approved: editForm.approved
            })
            .eq('id', editingReview);

        if (!error) {
            setEditingReview(null);
            fetchReviews();
        } else {
            alert("Error updating review");
        }
    };

    return (
        <div className="flex bg-primary min-h-screen">
            <Sidebar />
            <div className="ml-64 p-10 w-full text-white">
                <h1 className="text-4xl font-bold mb-8">Manage Testimonials</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="bg-black-100 rounded-2xl overflow-hidden p-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-700 text-secondary">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Rating</th>
                                    <th className="p-4">Review</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.id} className="border-b border-gray-800">
                                        {editingReview === review.id ? (
                                            <>
                                                <td className="p-4">
                                                    <input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="bg-tertiary text-white p-2 rounded"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="number" min="1" max="5"
                                                        value={editForm.rating}
                                                        onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                                                        className="bg-tertiary text-white p-2 rounded w-16"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <textarea
                                                        value={editForm.message}
                                                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                                        className="bg-tertiary text-white p-2 rounded w-full"
                                                        rows={2}
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => setEditForm({ ...editForm, approved: !editForm.approved })}
                                                        className={`px-2 py-1 rounded text-xs font-bold ${editForm.approved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}
                                                    >
                                                        {editForm.approved ? "Approved" : "Pending"}
                                                    </button>
                                                </td>
                                                <td className="p-4 flex gap-2">
                                                    <button onClick={saveEdit} className="text-green-400 hover:text-green-300 font-bold">Save</button>
                                                    <button onClick={cancelEdit} className="text-red-400 hover:text-red-300">Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-4">{review.name}</td>
                                                <td className="p-4 text-yellow-500">{"★".repeat(review.rating)}</td>
                                                <td className="p-4 truncate max-w-xs">{review.message}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${review.approved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                        {review.approved ? "Approved" : "Pending"}
                                                    </span>
                                                </td>
                                                <td className="p-4 flex gap-3">
                                                    <button onClick={() => startEdit(review)} className="text-blue-400 hover:text-blue-300">Edit</button>
                                                    <button
                                                        onClick={() => handleApprove(review.id, review.approved)}
                                                        className="p-2 bg-green-600 rounded-full hover:bg-green-700 hover:text-white transition-colors"
                                                        title={review.approved ? "Unapprove" : "Approve"}
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review.id)}
                                                        className="p-2 bg-red-600 rounded-full hover:bg-red-700 hover:text-white transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {reviews.length === 0 && <p className="text-center mt-6 text-secondary">No reviews found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTestimonials;
