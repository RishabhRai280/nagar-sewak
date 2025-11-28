import CitizenDashboardLayout from "@/app/components/CitizenDashboardLayout";
import { Bell, Info, CheckCircle, AlertTriangle } from "lucide-react";

export default function CitizenNotificationsPage() {
  return (
    <CitizenDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/30 text-white">
             <Bell size={32} />
          </div>
          <div>
             <h1 className="text-4xl font-extrabold text-slate-900">Notifications</h1>
             <p className="text-slate-600 font-medium">Stay updated on your reports and community</p>
          </div>
        </div>

        <div className="space-y-4">
            <NotificationCard 
                type="info"
                title="New Project Alert!"
                message='"Road Widening Project" has started in your area.'
                time="2 hours ago"
            />
            <NotificationCard 
                type="success"
                title="Complaint Resolved!"
                message='Your complaint "Pothole on Main Street" has been resolved.'
                time="1 day ago"
            />
             <NotificationCard 
                type="warning"
                title="Action Required"
                message='Please rate the "Community Park Renovation" project.'
                time="3 days ago"
            />
        </div>
      </div>
    </CitizenDashboardLayout>
  );
}

function NotificationCard({ type, title, message, time }: { type: 'info' | 'success' | 'warning', title: string, message: string, time: string }) {
    const styles = {
        info: { bg: 'bg-blue-50/50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
        success: { bg: 'bg-emerald-50/50', border: 'border-emerald-200', icon: CheckCircle, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
        warning: { bg: 'bg-orange-50/50', border: 'border-orange-200', icon: AlertTriangle, iconColor: 'text-orange-600', iconBg: 'bg-orange-100' },
    }[type];

    const Icon = styles.icon;

    return (
        <div className={`p-5 ${styles.bg} backdrop-blur-md border ${styles.border} rounded-2xl shadow-sm flex items-start gap-4 transition hover:scale-[1.01]`}>
            <div className={`p-2 rounded-xl ${styles.iconBg} ${styles.iconColor} flex-shrink-0`}>
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                    <span className="text-xs font-bold text-slate-400 bg-white/50 px-2 py-1 rounded-lg">{time}</span>
                </div>
                <p className="text-slate-600 font-medium mt-1">{message}</p>
            </div>
        </div>
    )
}