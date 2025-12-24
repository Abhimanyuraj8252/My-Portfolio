import React from "react";
import Sidebar from "../../components/admin/Sidebar";

const Dashboard = () => {
    return (
        <div className="flex bg-primary min-h-screen">
            <Sidebar />
            <div className="ml-64 p-10 w-full text-white">
                <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black-100 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-2">Total Blogs</h3>
                        <p className="text-5xl text-violet-500">0</p>
                    </div>
                    <div className="bg-black-100 p-8 rounded-2xl">
                        <h3 className="text-2xl font-bold mb-2">Testimonials</h3>
                        <p className="text-5xl text-blue-500">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
