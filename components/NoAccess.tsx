import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const NoAccess = () => {
  return (
    <div className="flex justify-center items-center py-12 md:py-32 bg-gray-100 p-4">
      <Card className="w-full max-w-md py-5 px-5">
        <CardHeader className="flex flex-col items-center">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
        </CardHeader>

        <CardContent className="py-4 border-none">
          <p className="font-medium text-center text-darkColor/80">
            Log in to view your cart items and checkout. Don’t miss out on your
            favorite products.
          </p>

          <SignInButton mode="modal">
            <Button className="w-full mt-5 mb-2 bg-shop_dark_green/90 hover:bg-shop_btn_dark_green/80 text-white">
              Sign In
            </Button>
          </SignInButton>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Don’t have an account?
          </div>

          <SignUpButton mode="modal">
            <Button variant="outline" className="w-full" size="lg">
              Create an account
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;