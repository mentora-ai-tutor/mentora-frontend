export default function Footer() {
  return (
    <footer className="w-full text-center py-6 border-t border-white/5 text-xs text-white/30 z-10 relative">
      <p className="mb-2">MENTORA – AI-Powered Personalized Learning</p>
      <div className="flex justify-center gap-4">
        <a href="#" className="hover:text-teal-400 transition-colors">Help</a>
        <a href="#" className="hover:text-teal-400 transition-colors">Privacy</a>
        <a href="#" className="hover:text-teal-400 transition-colors">Contact</a>
      </div>
    </footer>
  );
}
