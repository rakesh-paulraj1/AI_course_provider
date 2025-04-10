"use client"
import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { useParams } from 'next/navigation'

type Module = {
  id: string
  moduleTitle: string
  contents: {
    content: string
    contentType?: string
    aiGenerated?: boolean
  }[]
}

const ModulePage = () => {
  const params = useParams()
  const courseId = params.id as string
  const [module, setModule] = useState<Module | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userPrompt, setUserPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [editableContent, setEditableContent] = useState('')

  // Fetch module data on mount
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await fetch(`/api/course/getmodule/${courseId}`)
        if (!response.ok) throw new Error('Failed to fetch module')
        
        const data = await response.json()
        console.log(data);
        const generatedContent = data.data?.contents?.[0]?.content || '';
        setModule(data.data)
        setEditableContent(generatedContent);

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
      const prompt = `Generate content for: ${module.moduleTitle} `
      
      const response = await fetch('/api/course/generatemodules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: courseId,
          prompt
        }),
      })

      if (!response.ok) throw new Error('Failed to generate content')

      const data = await response.json()
      setEditableContent(data.content)
      setModule(prev => {
        if (!prev) return prev; // Ensure prev is not null
        return {
          ...prev,
          contents: [{ 
            content: data.content,
          }]
        };
      })
    } catch (error) {
      console.error('Error generating content:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = async () => {
    if (!module) return
    
    try {
      const response = await fetch('/api/course/savemodulecontent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: courseId,
          content: editableContent,
        }),
      })

      if (!response.ok) throw new Error('Failed to save content')

      setModule(prev => {
        if (!prev) return null; // Ensure prev is not null
        return {
          ...prev,
          contents: [{
            ...prev.contents[0],
            content: editableContent,
          }]
        };
      })

      alert('Content saved successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content')
    }
  }
// console.log('Module:', module)
  if (isLoading) {
    return <Layout>Loading module...</Layout>
  }

  if (!module) {
    return <Layout>Module not found</Layout>
  }

  return (
    <Layout>
      <div className="p-4">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{module.moduleTitle}</h2>
          
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="w-full min-h-[300px] p-4 border rounded-lg resize-y text-lg"
            placeholder="Content will appear here..."
          />

          <div className="flex justify-between mt-4">
           
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={handleSaveContent}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ModulePage