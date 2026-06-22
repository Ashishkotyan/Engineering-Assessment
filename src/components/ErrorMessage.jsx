export default function ErrorMessage({ message }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-red-700 max-w-md text-center">
        <p className="font-semibold text-lg mb-1">Something went wrong</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}
