type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 ">
      <div className="w-full max-w-5xl flex flex-col items-center">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
