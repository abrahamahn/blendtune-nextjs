import React from "react";

export default function Profile({ params }: { params: { username: string } }) {
  return (
    <div className="w-full h-screen">
      <div className="flex justify-center items-center">Hello!</div>
    </div>
  );
}
