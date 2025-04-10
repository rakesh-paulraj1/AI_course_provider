"use client"
import { Layout } from '@/components/Layout'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CreateCoursePage = () => {
  const [description, setDescription] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedModules, setGeneratedModules] = useState<string[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [title, setTitle] = useState<string>("")
  const [editedModule, setEditedModule] = useState<string>("")
  const { status } = useSession()
  const router = useRouter()

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert("Please enter a course description")
      return
    }

    try {
      setIsGenerating(true)
      const response = await fetch('/api/course/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate course')
      }

      const data = await response.json()
      setGeneratedModules(data.data.modules)
    } catch (error) {
      console.error('Error generating course:', error)
      alert('Failed to generate course. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditStart = (index: number) => {
    setEditingIndex(index)
    setEditedModule(generatedModules[index])
  }

  const handleEditSave = () => {
    if (editingIndex !== null) {
      const updatedModules = [...generatedModules]
      updatedModules[editingIndex] = editedModule
      setGeneratedModules(updatedModules)
      setEditingIndex(null)
      setEditedModule("")
    }
  }

  const handleEditCancel = () => {
    setEditingIndex(null)
    setEditedModule("")
  }

  const handleCreateCourse = async () => {
    if (!title.trim()) {
      alert("Please enter a course title");
      return;
    }
    
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          modules: generatedModules,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
  
      const data = await response.json();
      router.push(`/courses/${data.courseId}`);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course. Please try again.');
    }
  };

  if (status === "loading") return <div>Loading...</div>
  if (status === "unauthenticated") {
    router.push("/")
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Create Course</h1>
        <p className="text-xl text-gray-600 mb-8">Elaborate about the course you need</p>
        
        <div className="space-y-6">
        <div>
            <label className="block text-lg font-medium mb-2">Course Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course title"
            />
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Course Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Describe your course in detail..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? 'Generating...' : 'Generate Modules'}
          </button>

          {generatedModules.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Generated Module Titles</h2>
              <div className="space-y-3">
                {generatedModules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editedModule}
                        onChange={(e) => setEditedModule(e.target.value)}
                        className="flex-1 p-2 border rounded"
                      />
                    ) : (
                      <span className="flex-1">{module}</span>
                    )}
                    <div className="flex space-x-2 ml-4">
                      {editingIndex === index ? (
                        <>
                          <button 
                            onClick={handleEditSave}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button 
                            onClick={handleEditCancel}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEditStart(index)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateCourse}
                className="mt-6 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Course
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default CreateCoursePage