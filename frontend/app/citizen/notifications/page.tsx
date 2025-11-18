import CitizenDashboardLayout from "@/app/components/CitizenDashboardLayout";
import { Bell } from "lucide-react";

export default function CitizenNotificationsPage() {
  return (
    <CitizenDashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Bell size={32} className="text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Notifications</h1>
        </div>
        <p className="text-slate-700 text-lg">
          This is your Notifications page. Stay tuned for real-time updates and alerts!
        </p>
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Recent Notifications</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Bell size={20} className="text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-blue-800">New Project Alert!</p>
                <p className="text-sm text-blue-700">"Road Widening Project" has started in your area.</p>
                <span className="text-xs text-blue-600 opacity-75">2 hours ago</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <Bell size={20} className="text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-emerald-800">Complaint Resolved!</p>
                <p className="text-sm text-emerald-700">Your complaint "Pothole on Main Street" has been resolved.</p>
                <span className="text-xs text-emerald-600 opacity-75">1 day ago</span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
              <Bell size={20} className="text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-orange-800">Action Required</p>
                <p className="text-sm text-orange-700">Please rate the "Community Park Renovation" project.</p>
                <span className="text-xs text-orange-600 opacity-75">3 days ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </CitizenDashboardLayout>
  );
}