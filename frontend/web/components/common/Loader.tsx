function Loader() {
  // TODO: Add a nice loader animation, maybe with a pet theme?
  // TODO: Add more skeleton loaders in the forms instead of this full page loader
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default Loader