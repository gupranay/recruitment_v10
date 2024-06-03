// Code: Auth Page
"use client";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { KeyRound } from "lucide-react";
import { useSearchParams } from "next/navigation";

import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const params = useSearchParams();
  let next;
  if(!params){
    next = "";
  }else {
    next = params.get("next") || "";
  }
  const handleLoginwithGoogle = async () => {
    const supabase = supabaseBrowser();
    const {data,error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=`+next,
      },
    });
    if(error){
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-96 h-min rounded-md border p-5 space-y-5">
        <div className="flex items-center gap-2">
          <KeyRound />
          <h1 className="text-2xl font-bold">Login</h1>
        </div>

        <p className="text-sm text-gray-300">
          Simplify your Org's Recruitment Today 👇
        </p>
        <div className="flex flex-col gap-5">
          <Button
            className="w-full flex items-center gap-2"
            variant="outline"
            onClick={handleLoginwithGoogle}
          >
            {" "}
            <FcGoogle /> Google
          </Button>
        </div>
      </div>
    </div>
  );
}
