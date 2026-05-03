const ScreenContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

export default ScreenContainer;
