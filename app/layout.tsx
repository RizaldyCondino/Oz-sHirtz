import "./globals.css";
import {Toaster} from "react-hot-toast";
const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body  className="font-poppins antialiased">{children}
        <Toaster
        position="bottom-right"
        toastOptions={{
          style:{
            background: "#000000",
            color: "#fff"
          }
        }}
        >

        </Toaster>
      </body>
    </html>
  );
};
export default RootLayout;
