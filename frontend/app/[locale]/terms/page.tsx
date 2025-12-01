import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service - Nagar Sewak',
    description: 'Terms of service and user agreement for Nagar Sewak platform',
};

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-24 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                            <FileText className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">Terms of Service</h1>
                            <p className="text-slate-600 mt-1">Last updated: November 27, 2025</p>
                        </div>
                    </div>

                    <p className="text-lg text-slate-700 leading-relaxed">
                        Welcome to Nagar Sewak. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                By creating an account or using Nagar Sewak, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>Nagar Sewak is a civic engagement platform that enables:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Citizens to report civic issues and complaints</li>
                                <li>Municipal authorities to manage and resolve complaints</li>
                                <li>Contractors to receive and complete assigned work</li>
                                <li>Public tracking of civic projects and their progress</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. User Accounts</h2>
                        <div className="space-y-4 text-slate-700">
                            <p><strong>3.1 Registration</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You must provide accurate and complete information</li>
                                <li>You are responsible for maintaining account security</li>
                                <li>You must be at least 13 years old to create an account</li>
                                <li>One person may maintain only one account</li>
                            </ul>

                            <p className="mt-4"><strong>3.2 Account Security</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Keep your password confidential</li>
                                <li>Notify us immediately of any unauthorized access</li>
                                <li>You are responsible for all activities under your account</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. User Conduct</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>You agree NOT to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Submit false, misleading, or fraudulent complaints</li>
                                <li>Upload inappropriate, offensive, or illegal content</li>
                                <li>Harass, threaten, or abuse other users or staff</li>
                                <li>Attempt to hack, disrupt, or compromise the platform</li>
                                <li>Use automated tools to scrape or collect data</li>
                                <li>Impersonate others or misrepresent your identity</li>
                                <li>Spam or send unsolicited communications</li>
                                <li>Violate any applicable laws or regulations</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Content Guidelines</h2>
                        <div className="space-y-4 text-slate-700">
                            <p><strong>5.1 User-Generated Content</strong></p>
                            <p>When submitting complaints or reports, you must:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide accurate information and descriptions</li>
                                <li>Upload genuine photos of the reported issue</li>
                                <li>Use appropriate language and tone</li>
                                <li>Respect privacy of others (no personal information)</li>
                            </ul>

                            <p className="mt-4"><strong>5.2 Content Ownership</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You retain ownership of content you submit</li>
                                <li>You grant us a license to use, display, and share your content for platform purposes</li>
                                <li>We may remove content that violates these terms</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Complaint Resolution</h2>
                        <div className="space-y-4 text-slate-700">
                            <p><strong>6.1 Processing</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>We will forward complaints to relevant municipal authorities</li>
                                <li>Resolution times vary based on issue severity and complexity</li>
                                <li>We do not guarantee specific resolution timeframes</li>
                            </ul>

                            <p className="mt-4"><strong>6.2 Updates</strong></p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You will receive status updates on your complaints</li>
                                <li>You can track progress through your dashboard</li>
                                <li>You may be contacted for additional information</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Intellectual Property</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                The Nagar Sewak platform, including its design, code, logos, and trademarks, is protected by intellectual property laws. You may not copy, modify, or distribute our platform without permission.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Disclaimer of Warranties</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                Nagar Sewak is provided "as is" without warranties of any kind. We do not guarantee:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Uninterrupted or error-free service</li>
                                <li>Specific complaint resolution outcomes</li>
                                <li>Accuracy of all information on the platform</li>
                                <li>Compatibility with all devices or browsers</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Limitation of Liability</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                To the maximum extent permitted by law, Nagar Sewak and its operators shall not be liable for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Indirect, incidental, or consequential damages</li>
                                <li>Loss of data, profits, or business opportunities</li>
                                <li>Actions or inactions of municipal authorities</li>
                                <li>User-generated content or third-party conduct</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Termination</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>We reserve the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Suspend or terminate accounts that violate these terms</li>
                                <li>Remove content that violates our guidelines</li>
                                <li>Modify or discontinue services at any time</li>
                            </ul>
                            <p className="mt-4">
                                You may delete your account at any time through your profile settings.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Changes to Terms</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                We may update these Terms of Service from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                These terms are governed by the laws of India. Any disputes shall be resolved in the courts of [Your Jurisdiction].
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact Information</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>For questions about these Terms of Service, contact us:</p>
                            <div className="bg-slate-50 rounded-xl p-6 mt-4">
                                <p><strong>Email:</strong> <a href="mailto:legal@nagarsewak.com" className="text-blue-600 hover:underline">legal@nagarsewak.com</a></p>
                                <p className="mt-2"><strong>Address:</strong> Nagar Sewak, Civic Technology Division</p>
                                <p className="mt-2"><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-600">
                    <p>© 2025 Nagar Sewak. All rights reserved.</p>
                    <p className="mt-2">
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
