import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { supabase } from "../../lib/supabase/client";
import { Trash2, Mail, MailOpen } from "lucide-react";

const ManageContacts = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) {
            setMessages(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkRead = async (id, currentStatus) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ is_read: !currentStatus })
            .eq('id', id);

        if (!error) fetchMessages();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            const { error } = await supabase
                .from('contact_messages')
                .delete()
                .eq('id', id);

            if (!error) fetchMessages();
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex bg-primary min-h-screen">
            <Sidebar />
            <div className="ml-64 p-10 w-full text-white">
                <h1 className="text-4xl font-bold mb-8">Contact Messages</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <p className="text-secondary text-center mt-10">No contact messages yet.</p>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`bg-black-100 p-6 rounded-2xl border ${msg.is_read ? 'border-gray-800' : 'border-violet-500'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold">{msg.name}</h3>
                                            <p className="text-secondary text-sm">{msg.email} | {msg.mobile || 'No phone'}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${msg.is_read ? 'bg-gray-700 text-gray-400' : 'bg-violet-500/20 text-violet-400'}`}>
                                                {msg.is_read ? 'Read' : 'New'}
                                            </span>
                                            <span className="text-secondary text-xs">{formatDate(msg.created_at)}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        {msg.service && (
                                            <span className="inline-block bg-tertiary px-3 py-1 rounded-full text-sm mr-2 mb-2">
                                                {msg.service}
                                            </span>
                                        )}
                                        {msg.budget && msg.budget !== 'Not Specified' && (
                                            <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                                                Budget: {msg.budget}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-white bg-tertiary p-4 rounded-xl">{msg.message}</p>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => handleMarkRead(msg.id, msg.is_read)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${msg.is_read ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                                        >
                                            {msg.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                                            {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                                        </button>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your Portfolio Inquiry`}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Mail size={16} /> Reply
                                        </a>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageContacts;
