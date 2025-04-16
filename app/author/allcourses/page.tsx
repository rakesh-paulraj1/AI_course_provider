import React from 'react'
import Link from 'next/link'
import { Layout } from '@/components/Layout'
import { NEXT_AUTH } from '@/utils/auth'
import { getServerSession } from 'next-auth'
import prisma from "@/utils/Prisma"
import Homepagecomponent from '@/components/Homepagecomponent'



export default  async function Page() {
  const session = await getServerSession(NEXT_AUTH)
  if (!session) {
    return <>unauthenticated</>
  }

  const courses = await prisma.course.findMany({
    include: {
      authors: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!courses || courses.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center p-4">
          <p className="text-gray-600 mb-4">No Courses available.</p>
          <Link href="/author/createcourse">
            <div className="px-6 py-2 bg-black text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400">
              Create New Subject
            </div>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
<Homepagecomponent courses={courses} />
  )
}

