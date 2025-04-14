"use client";
import { SigninCard } from "@/components/Signincard";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
export default function Home() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.data?.user?.role === "admin") {
      router.push("/admin");
    } else if (session?.data?.user?.role === "author") {
      router.push("/author/allcourses");
    } else if (session?.data?.user?.role === "consumer") {
      router.push("/consumer");
    }
  }, [session, router]); 

 
    
  return (
<div className="h-full w-full flex md:items-center md:justify-center bg-black/[0.98] antialiased bg-grid-white/[0.05] relative overflow-hidden">
        <div className="p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0 grid grid-cols-1 md:grid-cols-2">
        <div className=" p-5 flex justify-center items-center">
            <div>
            <div className="text-6xl lg:text-8xl animate-gradient to-65% bg-gradient-to-br bg-clip-text bg-right-bottom font-extrabold text-transparent from-white from-35% via-[#3178c6] to-[#3178c6] bg-[length:300%_300%]">
               Course GPT
                </div>
                <>
                <div className="text-2xl lg:text-3xl mt-4 text-neutral-400 dark:text-white">
                    Create your own course using AI
                </div>
                </>
                <div>
                    <TextGenerateEffect words="Created for Kalvium" />
                </div>
                
            </div>
        </div>
        <SigninCard />
    </div>
        
    </div>
  );
}
