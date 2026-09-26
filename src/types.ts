export interface SourceLink { title: string; url: string; kind: 'website' | 'social' | 'directory' | 'article' | 'other' }
export interface BrandAsset { label: string; url: string; usage: string; kind: 'logo' | 'image' | 'video' | 'document' | 'other' }
export interface CompanyAnalysis {
  company: { name: string; sector: string; location: string; summary: string; audience: string; differentiators: string[] };
  brand: { personality: string[]; tone: string; colors: Array<{ name: string; hex: string; role: string }>; fonts: { display: string; body: string }; visualDirection: string; avoid: string[] };
  content: { eyebrow: string; headline: string; introduction: string; primaryCta: string; services: Array<{ title: string; description: string }>; trustPoints: string[]; about: string };
  assets: BrandAsset[]; imageQueries: string[];
  form: { title: string; fields: string[]; submitLabel: string };
  sources: SourceLink[]; caveats: string[];
}
export interface AnalyzeRequest { name: string; sector?: string; location?: string; address?: string; phone?: string; website?: string; socialLinks?: string }
