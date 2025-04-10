"use client"
import { Layout } from '@/components/Layout'
import React, { useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const [courses, setCourses] = React.useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  
  const getCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/course/getallcourses", {
        method: "GET",
      });
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    }
  }, []);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && session?.user.role !== "author") {
      router.push("/");
    }
  }, [status, session, router]);

  // Effect for fetching courses - only runs once when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      getCourses();
    }
  }, [status, getCourses]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="h-screen w-full flex justify-center items-center">
          <div className="text-neutral-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="h-[390px] w-[360px] bg-neutral-950 rounded-lg shadow-slate-800 shadow-[0_0_10px_2px_rgb(148,163,184)] flex flex-col items-center p-4">
          <div className="font-bold text-4xl p-4 text-neutral-400">
            Dashboard of {session?.user?.name || "Author"}
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;