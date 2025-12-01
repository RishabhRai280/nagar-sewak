"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        // if (typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="text-red-600" size={40} />
                            </div>

                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                Something went wrong
                            </h1>

                            <p className="text-slate-600 mb-6">
                                We encountered an unexpected error. Please try refreshing the page.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="w-full mb-6 p-4 bg-slate-100 rounded-xl text-left">
                                    <p className="text-xs font-mono text-slate-700 break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                            >
                                <RefreshCw size={18} />
                                Reload Page
                            </button>

                            <a
                                href="/"
                                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Return to Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
