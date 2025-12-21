"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "General",
    question: "What is Nagar Sewak and how does it work?",
    answer: "Nagar Sewak is a comprehensive citizen engagement platform that allows residents to report complaints, track municipal projects, participate in tenders, and access various government services. Citizens can submit complaints with photos/videos, contractors can bid on tenders, and administrators can manage the entire process efficiently."
  },
  {
    id: 2,
    category: "General",
    question: "How do I create an account?",
    answer: "To create an account, click on 'Register' on the homepage, choose your role (Citizen, Contractor, or Admin), fill in your details including email, phone number, and create a secure password. You'll receive a verification email to activate your account."
  },
  {
    id: 3,
    category: "Complaints",
    question: "How do I file a complaint?",
    answer: "To file a complaint: 1) Log in to your account, 2) Click 'Report Issue' or 'File Complaint', 3) Select the complaint category, 4) Provide a detailed description, 5) Add photos or videos as evidence, 6) Mark the location on the map, 7) Submit your complaint. You'll receive a unique complaint ID for tracking."
  },
  {
    id: 4,
    category: "Complaints",
    question: "Can I track the status of my complaint?",
    answer: "Yes! After filing a complaint, you can track its status in real-time through your dashboard. You'll see updates like 'Submitted', 'Under Review', 'In Progress', 'Resolved', etc. You'll also receive notifications via email and SMS for major status changes."
  },
  {
    id: 5,
    category: "Complaints",
    question: "What types of complaints can I file?",
    answer: "You can file complaints related to: Road maintenance, Water supply issues, Electricity problems, Garbage collection, Street lighting, Drainage issues, Public facilities, Environmental concerns, and other municipal services."
  },
  {
    id: 6,
    category: "Tenders",
    question: "How do contractors participate in tenders?",
    answer: "Contractors can: 1) Register with valid license details, 2) Browse available tender opportunities, 3) Submit proposals with quotations and timelines, 4) Upload supporting documents, 5) Track tender status. Only verified contractors can participate in the bidding process."
  },
  {
    id: 7,
    category: "Tenders",
    question: "What documents are required for tender submission?",
    answer: "Required documents typically include: Valid contractor license, Company registration certificate, Tax compliance certificates, Previous work portfolio, Financial statements, Technical specifications, and any project-specific documents mentioned in the tender notice."
  },
  {
    id: 8,
    category: "Projects",
    question: "How can I track project progress?",
    answer: "Citizens can track project progress through: 1) Project dashboard showing completion percentage, 2) Timeline with milestone updates, 3) Progress photos uploaded by contractors, 4) Status updates and notes, 5) Real-time notifications for major milestones."
  },
  {
    id: 9,
    category: "Projects",
    question: "How do contractors update project progress?",
    answer: "Contractors can update progress by: 1) Accessing their assigned projects, 2) Clicking 'Update Progress', 3) Setting completion percentage, 4) Adding progress notes, 5) Uploading current photos, 6) Updating project status. These updates are visible to citizens and administrators."
  },
  {
    id: 10,
    category: "Technical",
    question: "What browsers are supported?",
    answer: "Nagar Sewak works best on modern browsers including: Chrome (recommended), Firefox, Safari, and Edge. For optimal experience, please ensure your browser is updated to the latest version and JavaScript is enabled."
  },
  {
    id: 11,
    category: "Technical",
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. We use: SSL encryption for all data transmission, Secure authentication systems, Regular security audits, GDPR-compliant data handling, and encrypted storage for sensitive information. Your personal data is never shared with third parties without consent."
  },
  {
    id: 12,
    category: "Account",
    question: "How do I reset my password?",
    answer: "To reset your password: 1) Go to the login page, 2) Click 'Forgot Password', 3) Enter your registered email address, 4) Check your email for reset instructions, 5) Click the reset link and create a new password. The reset link expires in 24 hours for security."
  },
  {
    id: 13,
    category: "Account",
    question: "Can I change my registered mobile number?",
    answer: "Yes, you can update your mobile number from your profile settings. You'll need to verify the new number via OTP. This ensures security and helps us send you important notifications about your complaints and projects."
  },
  {
    id: 14,
    category: "Payments",
    question: "How are contractor payments processed?",
    answer: "Contractor payments are processed based on project milestones: 1) Milestone completion verification, 2) Admin approval, 3) Invoice submission, 4) Payment processing through secure banking channels, 5) Payment confirmation. Typical processing time is 7-14 business days."
  },
  {
    id: 15,
    category: "Support",
    question: "How can I contact customer support?",
    answer: "You can reach our support team through: Phone: +91 1800-123-4567 (Mon-Fri, 9 AM-6 PM), Email: support@nagarsewak.gov.in, Contact form on our website, or visit our office during business hours. We aim to respond within 24 hours."
  }
];

const categories = ["All", "General", "Complaints", "Tenders", "Projects", "Technical", "Account", "Payments", "Support"];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 lg:pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about using Nagar Sewak platform
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No FAQs found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                  </div>
                  {expandedItems.includes(faq.id) ? (
                    <ChevronUp className="text-slate-400 flex-shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400 flex-shrink-0" size={20} />
                  )}
                </button>
                
                {expandedItems.includes(faq.id) && (
                  <div className="px-6 pb-6 border-t border-slate-100">
                    <p className="text-slate-700 leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition"
            >
              <MessageCircle size={18} />
              Contact Support
            </a>
            <a
              href="tel:+911800123456"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition"
            >
              <Phone size={18} />
              Call Now
            </a>
            <a
              href="mailto:support@nagarsewak.gov.in"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition"
            >
              <Mail size={18} />
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}