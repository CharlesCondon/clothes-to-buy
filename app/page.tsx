import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    {/* Logo/Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-slate-800 mb-6">
                        Your Digital
                        <span className="block mt-2 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Wardrobe
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-light">
                        Organize and track all the clothes you want to buy in
                        one beautiful, minimalistic space
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white text-lg font-medium rounded-xl hover:bg-slate-900 transition-all shadow-sm hover:shadow-md"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 text-lg font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm border border-slate-200"
                        >
                            Create Account
                        </Link>
                        <Link
                            href="/collection"
                            className="w-full sm:w-auto px-8 py-4 text-slate-600 text-lg font-medium hover:text-slate-800 transition-colors"
                        >
                            Continue as Guest →
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Quick & Easy
                        </h3>
                        <p className="text-slate-600">
                            Just paste a product URL and we&apos;ll
                            automatically extract all the details for you
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Stay Organized
                        </h3>
                        <p className="text-slate-600">
                            Filter by category, sort by price, and keep track of
                            everything you want
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Safe & Private
                        </h3>
                        <p className="text-slate-600">
                            Your collection is private and secure. Try as a
                            guest or create an account
                        </p>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-light text-slate-800 text-center mb-12">
                        How It Works
                    </h2>
                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="flex items-start gap-6">
                            <div className="shrink-0 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-semibold">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-800 mb-2">
                                    Add a Product
                                </h3>
                                <p className="text-slate-600">
                                    Copy the URL of any clothing item
                                    you&apos;re interested in and paste it into
                                    the app
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-6">
                            <div className="shrink-0 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-semibold">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-800 mb-2">
                                    Auto-Extract Details
                                </h3>
                                <p className="text-slate-600">
                                    We&apos;ll automatically grab the product
                                    name, image, price, and brand for you
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start gap-6">
                            <div className="shrink-0 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-semibold">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-slate-800 mb-2">
                                    Organize & Browse
                                </h3>
                                <p className="text-slate-600">
                                    View your collection, filter by category,
                                    sort by price, and access product links
                                    anytime
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-24 text-center">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-light text-slate-800 mb-4">
                            Ready to organize your style?
                        </h2>
                        <p className="text-slate-600 mb-8">
                            Join now to save your collection forever, or try it
                            as a guest
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="px-8 py-4 bg-slate-800 text-white text-lg font-medium rounded-xl hover:bg-slate-900 transition-all shadow-sm"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/collection"
                                className="px-8 py-4 bg-slate-100 text-slate-800 text-lg font-medium rounded-xl hover:bg-slate-200 transition-all"
                            >
                                Try as Guest
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 mt-24 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    <p>© 2024 Wardrobe. Keep your style organized.</p>
                </div>
            </footer>
        </div>
    );
}
