import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ClerkProvider
  appearance={{
    layout: {
      unsafe_disableDevelopmentModeWarnings: true,
    },
    elements: {
      footer: "hidden",                    // This hides the Secured by Clerk footer
      developmentModeNotice: "hidden",    // This hides dev mode notice
    },
  }}
  unsafe_disableDevelopmentModeConsoleWarning={true}
>
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