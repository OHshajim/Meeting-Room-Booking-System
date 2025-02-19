import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/nextjs";
import Sidebar from "@/Components/Sidebar";

export const metadata: Metadata = {
  title: "Spade Meet",
  description: "Meeting Room Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">
          <header className="flex justify-between items-center p-4 bg-gray-300 shadow-md">
            <h1 className="text-2xl font-bold pl-14">Spade Meet</h1>
            <UserButton showName />
          </header>
          <main className="flex justify-between min-h-screen">
            <Sidebar />
            <div className="flex-1 ">
              <SignedIn>{children}</SignedIn>
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
