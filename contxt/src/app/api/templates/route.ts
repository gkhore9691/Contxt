import { NextResponse } from 'next/server'
import { PACK_TEMPLATES } from '@/lib/pack/templates'

export async function GET() {
  return NextResponse.json({ templates: PACK_TEMPLATES })
}
