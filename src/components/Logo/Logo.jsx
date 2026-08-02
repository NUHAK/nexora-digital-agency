function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3">

      <div className="relative w-9 h-9 rounded-full bg-[conic-gradient(from_220deg,#FF5A1F,#FF8A3D,#C13E0A,#FF5A1F)]">

        <div className="absolute inset-[5px] rounded-full bg-white"></div>

        <div className="absolute w-2 h-2 rounded-full bg-[#C13E0A] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      </div>

      <span className="font-bold text-xl tracking-tight">
        Nexora
      </span>

    </a>
  );
}

export default Logo;