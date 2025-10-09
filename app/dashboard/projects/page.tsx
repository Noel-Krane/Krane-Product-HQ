import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllProjectsWithCriteria } from '@/lib/supabase/queries'
import ProjectTabs from './ProjectTabs'
import CreateProjectButton from './CreateProjectButton'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all projects with their success criteria
  const projects = await getAllProjectsWithCriteria()

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-dark mb-2">Projects</h1>
          <p className="text-charcoal-light">
            Manage projects and their success criteria requirements
          </p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Project Tabs */}
      <ProjectTabs projects={projects} />
    </div>
  )
}

