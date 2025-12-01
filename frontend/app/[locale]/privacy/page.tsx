import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy - Nagar Sewak',
    description: 'Privacy policy and data protection information for Nagar Sewak platform',
};

export default function PrivacyPolicy() {
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
                            <Shield className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                            <p className="text-slate-600 mt-1">Last updated: November 27, 2025</p>
                        </div>
                    </div>

                    <p className="text-lg text-slate-700 leading-relaxed">
                        At Nagar Sewak, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>We collect information you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, and physical address</li>
                                <li><strong>Location Data:</strong> GPS coordinates when you submit complaints or reports</li>
                                <li><strong>Media Files:</strong> Photos and descriptions of reported civic issues</li>
                                <li><strong>Account Credentials:</strong> Username and encrypted password for authentication</li>
                                <li><strong>Usage Data:</strong> Information about how you interact with our platform</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Process and respond to your civic complaints and reports</li>
                                <li>Communicate with you about the status of your submissions</li>
                                <li>Improve our services and user experience</li>
                                <li>Ensure platform security and prevent fraud</li>
                                <li>Comply with legal obligations and government requests</li>
                                <li>Generate anonymized statistics for public transparency</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>We may share your information with:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Municipal Authorities:</strong> To process and resolve your complaints</li>
                                <li><strong>Contractors:</strong> Assigned to work on reported issues</li>
                                <li><strong>Public Display:</strong> Complaint locations and descriptions may be visible on the public map (without personal details)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                            </ul>
                            <p className="mt-4">
                                We <strong>never</strong> sell your personal information to third parties.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>We implement industry-standard security measures to protect your data:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Encrypted data transmission using HTTPS/SSL</li>
                                <li>Secure password storage with bcrypt hashing</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication mechanisms</li>
                                <li>Automated backup systems</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Your Rights</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Access:</strong> Request a copy of your personal data</li>
                                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                                <li><strong>Export:</strong> Download your data in a portable format</li>
                                <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, contact us at <a href="mailto:privacy@nagarsewak.com" className="text-blue-600 hover:underline">privacy@nagarsewak.com</a>
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies and Tracking</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>We use cookies and similar technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintain your login session</li>
                                <li>Remember your preferences (language, theme)</li>
                                <li>Analyze platform usage and performance</li>
                                <li>Improve user experience</li>
                            </ul>
                            <p className="mt-4">
                                You can control cookies through your browser settings.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Children's Privacy</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                Nagar Sewak is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Changes to This Policy</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Us</h2>
                        <div className="space-y-4 text-slate-700">
                            <p>If you have questions about this Privacy Policy, please contact us:</p>
                            <div className="bg-slate-50 rounded-xl p-6 mt-4">
                                <p><strong>Email:</strong> <a href="mailto:privacy@nagarsewak.com" className="text-blue-600 hover:underline">privacy@nagarsewak.com</a></p>
                                <p className="mt-2"><strong>Address:</strong> Nagar Sewak, Civic Technology Division</p>
                                <p className="mt-2"><strong>Phone:</strong> +91-XXXX-XXXXXX</p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-slate-600">
                    <p>© 2025 Nagar Sewak. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
