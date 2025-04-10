"use client"
import * as React from 'react'
import { Layout } from '@/components/Layout'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { motion } from 'framer-motion'
import { FaBookOpen } from 'react-icons/fa'
import { cn } from '@/utils/utils'
import { useState } from 'react'
import Link from 'next/link'
import { useEffect } from 'react'
const variants = {
  initial: {
    backgroundPosition: "0% 50%",
  },
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  },
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = React.use(params)
  const [courseData, setCourseData] = useState<{
    title: React.ReactNode
    id: any
    
    course: { id: string; title: string; description: string } | null;
    modules: Array<{
      id: string;
      title: string;
      description: string;
      position: number;
      contents: Array<{
        id: string;
        title: string;
        contentType: string;
      }>
    }>
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCourseModules = async () => {
      try {
        const response = await fetch(`/api/course/${id}/getmodules`);
        if (!response.ok) {
          throw new Error('Failed to fetch course modules');
        }
        const data = await response.json();
        setCourseData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseModules();
  }, [id]);
  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>Error: {error}</div></Layout>;
  if (!courseData) return <Layout><div>Course not found</div></Layout>;
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Title Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {courseData.title}
          </h1>
          <p className="text-2xl  dark:text-gray-900 font-bold">
            Select a module to continue learning
          </p>
        </div>

        {/* Modules Grid */}
        {courseData.course && courseData.modules && courseData.modules.length > 0 ? (
          <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
            {courseData.modules.map((module, i) => (
              <Link href={`/author/modules/${module.id}`} key={module.id}>
                <BentoGridItem
                  title={module.title}
                  description={module.description}
                  header={
                    <motion.div
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
                    >
                      <motion.div className="h-full w-full rounded-lg flex items-center justify-center">
                        <div className='text-center justify-center font-bold text-white text-xl'>
                          {module.title}
                        </div>
                      </motion.div>
                    </motion.div>
                  }
                  className={cn("[&>p:text-lg]", i === 3 || i === 6 ? "md:col-span-2" : "")}
                  icon={<FaBookOpen className="h-4 w-4 text-neutral-500" />}
                />
              </Link>
            ))}
          </BentoGrid>
        ) : (
          <div className="flex flex-col items-center p-4">
            <p className="text-gray-600 mb-4">No modules available for this course.</p>
            <Link href={`/author/courses/${courseData.id}/create-module`}>
              <div className="px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
                Create New Module
              </div>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Page