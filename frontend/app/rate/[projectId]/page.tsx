// frontend/app/rate/[projectId]/page.tsx

import RatingForm from '../../components/RatingForm';

export default function RateProjectPage({ params }: { params: { projectId: string }}) {
    const projectId = Number(params.projectId);
    const isInvalid = Number.isNaN(projectId);

    return (
        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center py-12 px-4">
            {isInvalid ? (
                <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Project</h2>
                    <p className="text-gray-600">Please select a valid project from the map before rating.</p>
                </div>
            ) : (
                <RatingForm projectId={projectId} />
            )}
        </div>
    );
}