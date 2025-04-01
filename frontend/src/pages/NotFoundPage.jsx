import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg text-center max-w-lg w-full">
                <h1 className="text-5xl md:text-6xl font-extrabold text-red-700 mb-4">404</h1>
                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-500 mb-4">Page Not Found</h2>
                <p className="text-gray-500 mb-4 text-sm md:text-base">We can't find the page that you're looking for. Back to</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl hover:bg-blue-700 transition duration-300">
                    Home Page
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
