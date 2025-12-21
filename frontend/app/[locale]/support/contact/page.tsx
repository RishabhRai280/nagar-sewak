"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactSupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    message: "",
    priority: "medium"
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert("Your support request has been submitted successfully! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "",
      subject: "",
      message: "",
      priority: "medium"
    });
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 lg:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Support</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Need help? Our support team is here to assist you with any questions or issues you may have.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Phone size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Phone Support</h3>
                    <p className="text-slate-600">+91 1800-123-4567</p>
                    <p className="text-sm text-slate-500">Mon-Fri, 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Mail size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Support</h3>
                    <p className="text-slate-600">support@nagarsewak.gov.in</p>
                    <p className="text-sm text-slate-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <MapPin size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Office Address</h3>
                    <p className="text-slate-600">
                      Municipal Corporation Office<br />
                      City Center, Main Road<br />
                      Your City - 123456
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Office Hours</h3>
                    <p className="text-slate-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Help</h3>
              <div className="space-y-3">
                <a href="/support/faq" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition">
                  <MessageCircle size={18} className="text-blue-600" />
                  <span className="font-medium text-slate-700">Frequently Asked Questions</span>
                </a>
                <a href="/support/tender-guidance" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition">
                  <FileText size={18} className="text-green-600" />
                  <span className="font-medium text-slate-700">Tender Guidance</span>
                </a>
                <button className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition w-full text-left">
                  <Download size={18} className="text-orange-600" />
                  <span className="font-medium text-slate-700">Download User Manual</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Related</option>
                      <option value="complaint">Complaint Support</option>
                      <option value="tender">Tender Related</option>
                      <option value="project">Project Related</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of your issue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}