import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import RichTextEditor from "../../components/admin/RichTextEditor";
import { supabase } from "../../lib/supabase/client";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !content) {
            alert("Please fill in all fields");
            return;
        }

        setLoading(true);
        // Slug generation
        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        const { error } = await supabase
            .from('blogs')
            .insert([
                { title, content, slug, published: true }
            ]);

        if (error) {
            alert("Error saving blog: " + error.message);
        } else {
            alert("Blog published successfully!");
            setTitle("");
            setContent("");
        }
        setLoading(false);
    };

    return (
        <div className="flex bg-primary min-h-screen">
            <Sidebar />
            <div className="ml-64 p-10 w-full text-white">
                <h1 className="text-4xl font-bold mb-8">Create New Blog</h1>

                <div className="flex flex-col gap-6 max-w-4xl">
                    <input
                        type="text"
                        placeholder="Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-tertiary py-4 px-6 rounded-lg text-white text-xl outline-none font-bold"
                    />

                    <div className="bg-white rounded-lg overflow-hidden text-black">
                        <RichTextEditor
                            initialValue=""
                            onEditorChange={(newContent) => setContent(newContent)}
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 py-3 px-8 rounded-lg text-white font-bold hover:bg-green-700 transition-colors self-end"
                    >
                        {loading ? "Publishing..." : "Publish Blog"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;
