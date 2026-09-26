import type { VercelRequest, VercelResponse } from '@vercel/node';

interface OpenAIResponse { output_text?: string; output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>; error?: { message?: string } }

const itemSchema = {
  type: 'object', additionalProperties: false, required: ['title', 'description'],
  properties: { title: { type: 'string' }, description: { type: 'string' } },
} as const;

const schema = {
  type: 'object', additionalProperties: false,
  required: ['company', 'brand', 'content', 'assets', 'imageQueries', 'form', 'sources', 'caveats'],
  properties: {
    company: {
      type: 'object', additionalProperties: false,
      required: ['name', 'sector', 'location', 'summary', 'audience', 'differentiators'],
      properties: { name: { type: 'string' }, sector: { type: 'string' }, location: { type: 'string' }, summary: { type: 'string' }, audience: { type: 'string' }, differentiators: { type: 'array', items: { type: 'string' } } },
    },
    brand: {
      type: 'object', additionalProperties: false,
      required: ['personality', 'tone', 'colors', 'fonts', 'visualDirection', 'avoid'],
      properties: {
        personality: { type: 'array', items: { type: 'string' } }, tone: { type: 'string' },
        colors: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'object', additionalProperties: false, required: ['name', 'hex', 'role'], properties: { name: { type: 'string' }, hex: { type: 'string' }, role: { type: 'string' } } } },
        fonts: { type: 'object', additionalProperties: false, required: ['display', 'body'], properties: { display: { type: 'string' }, body: { type: 'string' } } },
        visualDirection: { type: 'string' }, avoid: { type: 'array', items: { type: 'string' } },
      },
    },
    content: {
      type: 'object', additionalProperties: false,
      required: ['eyebrow', 'headline', 'introduction', 'primaryCta', 'services', 'trustPoints', 'about'],
      properties: { eyebrow: { type: 'string' }, headline: { type: 'string' }, introduction: { type: 'string' }, primaryCta: { type: 'string' }, services: { type: 'array', minItems: 3, maxItems: 6, items: itemSchema }, trustPoints: { type: 'array', items: { type: 'string' } }, about: { type: 'string' } },
    },
    assets: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['label', 'url', 'usage', 'kind'], properties: { label: { type: 'string' }, url: { type: 'string' }, usage: { type: 'string' }, kind: { type: 'string', enum: ['logo', 'image', 'video', 'document', 'other'] } } } },
    imageQueries: { type: 'array', items: { type: 'string' } },
    form: { type: 'object', additionalProperties: false, required: ['title', 'fields', 'submitLabel'], properties: { title: { type: 'string' }, fields: { type: 'array', items: { type: 'string' } }, submitLabel: { type: 'string' } } },
    sources: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'url', 'kind'], properties: { title: { type: 'string' }, url: { type: 'string' }, kind: { type: 'string', enum: ['website', 'social', 'directory', 'article', 'other'] } } } },
    caveats: { type: 'array', items: { type: 'string' } },
  },
} as const;

const extractText = (data: OpenAIResponse): string => data.output_text ?? data.output?.flatMap((item) => item.content ?? []).find((content) => content.type === 'output_text')?.text ?? '';

export default async function handler(request: VercelRequest, response: VercelResponse): Promise<void> {
  if (request.method !== 'POST') { response.status(405).json({ error: 'Méthode non permise.' }); return; }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) { response.status(503).json({ error: 'OPENAI_API_KEY n’est pas configurée sur le serveur.' }); return; }
  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) as Record<string, unknown> : request.body as Record<string, unknown>;
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!name) { response.status(400).json({ error: 'Le nom de l’entreprise est requis.' }); return; }
    const prompt = `Analyse en profondeur cette entreprise pour préparer un site web premium sur mesure.\nNom: ${name}\nSecteur indiqué: ${String(body.sector ?? '')}\nRégion: ${String(body.location ?? '')}\nAdresse fournie: ${String(body.address ?? '')}\nTéléphone fourni: ${String(body.phone ?? '')}\nSite connu: ${String(body.website ?? '')}\nRéseaux sociaux connus: ${String(body.socialLinks ?? '')}\nUtilise l’adresse et le téléphone uniquement pour identifier la bonne entreprise et recouper les résultats. Recherche le site officiel, les profils sociaux publics, annuaires et articles pertinents. Énumère toutes les sources réellement consultées. Repère séparément le logo, les images, les vidéos, les documents et les autres médias publics pertinents; classe chacun avec kind. Distingue les faits vérifiés des recommandations créatives. N’invente jamais statistique, témoignage, service, certification ou coordonnée. Propose une direction artistique distincte sans copier l’identité d’une autre entreprise. Pour les assets, retourne uniquement des URL publiques réellement trouvées qui semblent appartenir à l’entreprise et précise que les droits doivent être vérifiés. Rédige en français canadien. Les sources doivent être consultables.`;
    const configuredModel = process.env.OPENAI_MODEL?.trim();
    const model = configuredModel && configuredModel !== 'undefined' && configuredModel !== 'null' ? configuredModel : 'gpt-5.6-luna';
    const apiResponse = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, reasoning: { effort: 'medium' }, tools: [{ type: 'web_search', search_content_types: ['text', 'image'], image_settings: { max_results: 6, caption: true } }], include: ['web_search_call.action.sources', 'web_search_call.results'], text: { format: { type: 'json_schema', name: 'company_site_analysis', strict: true, schema } }, input: prompt }) });
    const data = await apiResponse.json() as OpenAIResponse;
    if (!apiResponse.ok) throw new Error(data.error?.message ?? 'La recherche OpenAI a échoué.');
    const text = extractText(data);
    if (!text) throw new Error('La recherche n’a retourné aucune analyse exploitable.');
    response.status(200).json(JSON.parse(text) as unknown);
  } catch (error: unknown) {
    console.error('Erreur pendant l’analyse de compagnie.', error);
    response.status(500).json({ error: error instanceof Error ? error.message : 'Erreur inattendue pendant l’analyse.' });
  }
}
