// frontend/app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Nagar Sewak. Empowering citizens, improving governance.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          A civic-tech platform for transparent local development.
        </p>
      </div>
    </footer>
  );
}
