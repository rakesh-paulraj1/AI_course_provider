"use client"
import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useParams } from 'next/navigation'

type Content = {
  id: string
  content: string
  title?: string
  contentType?: string
  aiGenerated?: boolean
}

type Module = {
  id: string
  moduleTitle: string
  contents: Content[]
}

const ModulePage = () => {
  const params = useParams()
  const courseId = params.id as string
  const [module, setModule] = useState<Module | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
const [editableTitle, seteditableTitle] = useState<string[]>([])
const [moduleid,setmouduleid] = useState('')
  const [editableContents, setEditableContents] = useState<string[]>([])
const [moduleIds, setModuleIds] = useState<string[]>([])

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`/api/course/getmodule/${courseId}`)
        if (!response.ok) throw new Error('Failed to fetch module')
        
        const data = await response.json()
        setModule(data.data)
        console.log('Fetched module:', data.data)
        
      setModuleIds(data.data.contents.map((c: Content) => c.id));
        if (data.data?.contents?.length > 0) {
          seteditableTitle(data.data.contents.map((c: Content) => c.title ||'' ))
          setEditableContents(data.data.contents.map((c:Content) => c.content || ''))
          setmouduleid(data.data.contents.map((c: Content) => c.id))
        }
      } catch (error) {
        console.error('Error fetching module:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) fetchModule()
  }, [courseId])
 

  const handleGenerateContent = async () => {
    if (!module) return
    try {
      setIsGenerating(true)
      const prompt = `Generate content for: ${module.moduleTitle}`
      const response = await fetch('/api/course/generatemodules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleIds,
          prompt,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate content')

      const data = await response.json()
      console.log('Generated content:', data)
      if (!data.sections || !Array.isArray(data.sections)) {
        throw new Error('Invalid response format');
      }
     
      const newContents = data.sections.map((section: any) => ({
        id: section.id,
        title: section.title || 'Untitled Section',
        content: section.content || '',
      }));
      setmouduleid(newContents.map((c:Content) => c.id));
      setEditableContents(newContents.map((c:Content) => c.content));
      seteditableTitle(newContents.map((c:Content) => c.title || ''))
      setModule(prev => ({
        ...prev!,
        contents: newContents
      }));
      setCurrentSlideIndex(0);
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContents = [...editableContents]
    newContents[currentSlideIndex] = e.target.value
    setEditableContents(newContents)
  }

  const handleSaveContent = async () => {
    if (!module || !module.contents[currentSlideIndex]) return
    // console.log('Saving content:', editableContents[currentSlideIndex], 'for slide index:', moduleid[currentSlideIndex],editableTitle[currentSlideIndex]);
    try {
      setIsSaving(true)
      const currentContent = module.contents[currentSlideIndex]
      
      const response = await fetch('/api/course/savecontent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: currentContent.id,
          content: editableContents[currentSlideIndex],
          title: editableTitle[currentSlideIndex],
        }),
      })

      if (!response.ok) throw new Error('Failed to save content')
      const updatedContents = [...module.contents]
      updatedContents[currentSlideIndex].content = editableContents[currentSlideIndex]
      setModule({ ...module, contents: updatedContents })
      
      alert('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <Layout>Loading module...</Layout>
  }

  if (!module) {
    return <Layout>Module not found</Layout>
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{module.moduleTitle}</h2>
          
         
          {module.contents?.length > 0 && (
            <div className="mb-6">
              <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg bg-white mb-4">
                <div className="relative h-64 flex">
                  {module.contents.map((content, index) => (
                    <div
                      key={content.id || index}
                      className={`w-full flex-shrink-0 p-6 transition-opacity duration-300 ${
                        index === currentSlideIndex ? 'opacity-100' : 'opacity-0 absolute'
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {content.title || `Slide ${index + 1}`}
                      </h3>
                      <div className="text-gray-600 h-40 overflow-y-auto">
                        {editableContents[index] || 'No content available'}
                      </div>
                    </div>
                  ))}
                </div>

                {module.contents.length > 1 && (
                  <>
                    <button
                      onClick={() => handleSlideChange(
                        currentSlideIndex === 0 ? module.contents.length - 1 : currentSlideIndex - 1
                      )}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleSlideChange(
                        currentSlideIndex === module.contents.length - 1 ? 0 : currentSlideIndex + 1
                      )}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-white"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                <div className="flex justify-center space-x-2 p-4">
                  {module.contents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`h-3 w-3 rounded-full ${
                        index === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
<div className='text-2xl font-bold '>
 Edit Title
</div>
<textarea
            value={editableTitle[currentSlideIndex] || ''}
            onChange={handleContentChange}
            className="w-full min-h-[50px] p-4 border rounded-lg resize-y text-lg"
            placeholder="Content will appear here..."
          />
          <div className='text-2xl font-bold '>
   Edit Content
</div>
          <textarea
            value={editableContents[currentSlideIndex] || ''}
            onChange={handleContentChange}
            className="w-full min-h-[300px] p-4 border rounded-lg resize-y text-lg"
            placeholder="Content will appear here..."
          />

          <div className="flex justify-between mt-4">
            <div className="flex gap-2">
          
              <button
                onClick={handleSaveContent}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
        <button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isGenerating ? 'Generating...' : 'Generate for all modules '}
              </button>
      </div>
    </Layout>
  )
}

export default ModulePage