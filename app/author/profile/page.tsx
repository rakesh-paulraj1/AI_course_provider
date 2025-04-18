"use client"
import { Layout } from '@/components/Layout'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { FaUserAlt } from "react-icons/fa";
import { BentoGrid,BentoGridItem } from '@/components/ui/bento-grid'
import Link from 'next/link'
import { cn } from '@/utils/utils'
// import { useRouter } from 'next/navigation'
import { motion } from "framer-motion";
interface Course {
  id: string;
  title: string;
  authors: { user: { name: string } }[];
}
const variants = {
  initial: {
    backgroundPosition: "0% 50%",
  },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  },
}
const Page = () => {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const { data: session,status } = useSession()
  const getallusercourses = React.useCallback(async () => {
    const response = await fetch(`/api/course/getallusercourses/${session?.user.id}`, {
      method: 'GET',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user courses')
    }
    const data = await response.json()
    console.log(data);
    setCourses(data.data || [])
  }, [session?.user.id]);

 useEffect(() => {
  if (session?.user.id) {
    getallusercourses();
  }
 }, [session?.user.id, getallusercourses])
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
   
      <div className='flex flex-col w-full'>
        <h1 className='text-2xl font-bold'>Profile</h1>
        <h1 className='text-xl font-bold'>{session?.user.name}</h1>
        </div>
        <div>
        {courses && courses.length>0?(courses.map(course=>(
          <div key={course.id} className="col-span-1 md:col-span-1">
<Link href={'/author/courses/' + course.id}>
<BentoGrid className="max-w-4xl w-full md:auto-rows-[20rem]">
                <BentoGridItem
                  title={course.authors[0]?.user.name}
                  description={<div className='flex item-center'>
                 </div>}
                  header={<motion.div
                    initial="initial"
                    animate="animate"
                    variants={variants}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
                    style={{
                      background:
                        "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
                      backgroundSize: "400% 400%",
                    }}
                  > <motion.div className="h-full w-full rounded-lg flex items-center justify-center"><div className=' text-center justify-center font-bold'>{course.title.toUpperCase()}</div></motion.div>
                  </motion.div>
                   }
                  className={cn("[&>p:text-lg]", "md:col-span-1")}
                  icon={<FaUserAlt className="h-4 w-4 text-neutral-500" />}
                />
              </BentoGrid>
</Link>
            </div>
        ))):(<div className="flex flex-col items-center p-4">
          <p className="text-gray-600 mb-4">No Courses available.</p>
          <Link href="/author/createcourse">
            <div className="px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
              Create New Subject
            </div>
          </Link>
        </div>)}
        </div>
     
  </Layout>
  )
}

export default Page