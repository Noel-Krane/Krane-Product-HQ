import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllCompaniesWithCriteria } from '@/lib/supabase/queries'
import CompanyTabs from './CompanyTabs'
import CreateCompanyButton from './CreateCompanyButton'

export default async function CompaniesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all companies with their success criteria
  const companies = await getAllCompaniesWithCriteria()

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-dark mb-2">Companies</h1>
          <p className="text-charcoal-light">
            Manage companies and their success criteria requirements
          </p>
        </div>
        <CreateCompanyButton />
      </div>

      {/* Company Tabs */}
      <CompanyTabs companies={companies} />
    </div>
  )
}

