import profbrusHeroImage from "@assets/generated_images/profbrus-modern-house-hero.png";

export function ProfbrusHeroVideo() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d0d0d] select-none pointer-events-none">
      <img
        src={profbrusHeroImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
