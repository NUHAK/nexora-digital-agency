const HeroStats = () => {
  return (
    <div
      className="
      mt-14
      flex
      max-w-[520px]
      gap-[38px]
      border-t
      border-[#EFE6DD]
      pt-[30px]
    "
    >
      <div>

        <h3 className="font-['Bricolage_Grotesque'] text-[26px] font-bold">
          120+
        </h3>

        <p className="mt-1 font-mono text-[12.5px] text-[#8A8079]">
          BRANDS GROWN
        </p>

      </div>

      <div>

        <h3 className="font-['Bricolage_Grotesque'] text-[26px] font-bold">
          4.9/5
        </h3>

        <p className="mt-1 font-mono text-[12.5px] text-[#8A8079]">
          CLIENT RATING
        </p>

      </div>

      <div>

        <h3 className="font-['Bricolage_Grotesque'] text-[26px] font-bold">
          35+
        </h3>

        <p className="mt-1 font-mono text-[12.5px] text-[#8A8079]">
          COUNTRIES SERVED
        </p>

      </div>

    </div>
  );
};

export default HeroStats;