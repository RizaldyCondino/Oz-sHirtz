import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-poppins antialiased">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: "#000000", color: "#fff" },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;