export function ProfbrusHeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] select-none pointer-events-none">
      <img
        src={`${import.meta.env.BASE_URL}posters/hero-profbrus-gen.webp`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
