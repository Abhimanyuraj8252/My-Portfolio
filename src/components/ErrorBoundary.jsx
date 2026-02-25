import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 bg-black text-white">
                    <h1 className="text-2xl font-bold text-red-500">Something went wrong.</h1>
                    <p className="mt-4 text-gray-300">Please verify the following:</p>
                    <ul className="list-disc ml-6 mt-2">
                        <li>Check the console logs for detailed error messages.</li>
                        <li>Ensure all lazy-loaded components exist at their paths.</li>
                    </ul>
                    <details className="mt-4 text-sm text-gray-500 whitespace-pre-wrap">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
