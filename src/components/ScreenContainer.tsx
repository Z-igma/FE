const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="mx-auto min-h-screen bg-[#FCFCFC] w-full max-w-[393px] tablet:max-w-full desktop:max-w-full">
        {children}
      </div>
    </div>
  );
};

export default ScreenContainer;
