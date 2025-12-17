import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Initialize OpenAI client with OpenRouter only if API key is available
let openai: OpenAI | null = null

if (process.env.OPENROUTER_API_KEY) {
  openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message, projectId } = await request.json()

    if (!message || !projectId) {
      return NextResponse.json(
        { error: 'Message and project ID are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENROUTER_API_KEY || !openai) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    // Get project context from Supabase
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to use AI Assistant.' },
        { status: 401 }
      )
    }
    
    // Get project details (ensure user owns the project)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Get project notes (ensure user owns them)
    const { data: notes } = await supabase
      .from('notes')
      .select('title, category, content')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get project features (ensure user owns them)
    const { data: features } = await supabase
      .from('features')
      .select('title, description, category, status, due_date')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get project releases (ensure user owns them)
    const { data: releases } = await supabase
      .from('releases')
      .select('version, notes, category, status, target_date, released_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(10)

    // Build context for AI
    const projectContext = `
Project Information:
- Name: ${project.name}
- Description: ${project.description || 'No description provided'}
- Status: ${project.status}
- Created: ${new Date(project.created_at).toLocaleDateString()}

Recent Notes (${notes?.length || 0} total):
${notes?.map(note => `- ${note.title} (${note.category})`).join('\n') || 'No notes yet'}

Features (${features?.length || 0} total):
${features?.map(feature => 
  `- ${feature.title} (${feature.category}, ${feature.status})${feature.description ? ': ' + feature.description : ''}`
).join('\n') || 'No features yet'}

Releases (${releases?.length || 0} total):
${releases?.map(release => 
  `- v${release.version} (${release.category}, ${release.status})${release.notes ? ': ' + release.notes : ''}`
).join('\n') || 'No releases yet'}
`

    const systemPrompt = `You are DevHub AI Assistant, a helpful AI that assists developers with their projects. You have access to the current project's information including notes, features, and releases.

Your role is to:
1. Help brainstorm new features and improvements
2. Provide technical guidance and best practices
3. Suggest project organization and planning strategies
4. Answer questions about the project's current state
5. Help with development workflows and methodologies

Always be helpful, concise, and practical. When suggesting features or improvements, consider the project's current state and existing features to avoid duplication.

Current Project Context:
${projectContext}

Respond in Indonesian (Bahasa Indonesia) since this is an Indonesian application.`

    // Call OpenRouter API
    const completion = await openai.chat.completions.create({
      model: 'google/gemma-2-27b-it:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('AI Chat Error:', error)
    
    // More specific error handling
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check if it's an OpenAI API error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Invalid OpenRouter API key' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process AI request. Please check server logs for details.' },
      { status: 500 }
    )
  }
}