"use client"
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { motion } from "framer-motion"
import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { cn } from '@/utils/utils'
import { FaUserAlt } from "react-icons/fa"

const variants = {
  initial: {
    backgroundPosition: "0 50%",
  },
  animate: {
    backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
  },
}

interface HomepageProps {
  courses: Course[];
}
interface Course {
  id: string;
  title: string;
  authors: { user: { name: string } }[];
}

const Homepagecomponent = ({courses}:HomepageProps) => {

    if (!courses) {
        return (
          <Layout>
            <div className="h-screen w-full flex justify-center items-center">
              <div className="text-neutral-400">No courses available</div>
            </div>
          </Layout>
        )
      }
    
  return (
    <Layout>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {courses.map(course => (
        <div key={course.id} className="col-span-1 md:col-span-1">
          <Link href={'/author/courses/' + course.id}>
            <BentoGrid className="max-w-4xl w-full md:auto-rows-[20rem]">
              <BentoGridItem
                title={course.authors.length > 0 ? course.authors[0].user.name : "Unknown Author"}
                description={<div className='flex item-center'></div>}
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
                      <div className='text-center justify-center font-bold'>{course.title.toUpperCase()}</div>
                    </motion.div>
                  </motion.div>
                }
                className={cn("[&>p:text-lg]", "md:col-span-1")}
                icon={<FaUserAlt className="h-4 w-4 text-neutral-500" />}
              />
            </BentoGrid>
          </Link>
        </div>
      ))}
    </div>
  </Layout>
  )
}

export default Homepagecomponent