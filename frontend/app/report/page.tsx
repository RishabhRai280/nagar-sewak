// frontend/app/report/page.tsx

import CitizenComplaintForm from '../components/CitizenComplaintForm';

export default function ReportPage() {
    return (
        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center py-12 px-4">
            <CitizenComplaintForm />
        </div>
    );
}