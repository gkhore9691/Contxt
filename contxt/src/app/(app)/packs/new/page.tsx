'use client'

import { useState } from 'react'
import PackWizard from '@/components/app/PackWizard'
import TemplateGallery from '@/components/app/TemplateGallery'
import type { PackTemplate } from '@/lib/pack/templates'

export default function NewPackPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [template, setTemplate] = useState<PackTemplate | undefined>(undefined)

  if (showWizard) {
    return <PackWizard template={template} />
  }

  return (
    <TemplateGallery
      onSelect={(t) => {
        setTemplate(t)
        setShowWizard(true)
      }}
      onSkip={() => setShowWizard(true)}
    />
  )
}
