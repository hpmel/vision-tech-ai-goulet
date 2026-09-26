import { defineConfig, loadEnv, type Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import analyzeHandler from './api/analyze';

const readBody = async (request: IncomingMessage): Promise<string> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  return Buffer.concat(chunks).toString('utf8');
};

const localAnalyzeApi = (): Plugin => ({
  name: 'local-analyze-api',
  configureServer(server) {
    server.middlewares.use('/api/analyze', async (request: IncomingMessage, response: ServerResponse) => {
      try {
        const rawBody = await readBody(request);
        const body = rawBody ? JSON.parse(rawBody) as unknown : {};
        const vercelRequest = Object.assign(request, { body }) as VercelRequest;
        const vercelResponse = Object.assign(response, {
          status(code: number) { response.statusCode = code; return vercelResponse; },
          json(value: unknown) { response.setHeader('Content-Type', 'application/json; charset=utf-8'); response.end(JSON.stringify(value)); return vercelResponse; },
        }) as unknown as VercelResponse;
        await analyzeHandler(vercelRequest, vercelResponse);
      } catch (error: unknown) {
        console.error('Erreur de la route locale /api/analyze.', error);
        response.statusCode = 500;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur locale inattendue.' }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');
  if (environment.OPENAI_API_KEY) process.env.OPENAI_API_KEY = environment.OPENAI_API_KEY;
  if (environment.OPENAI_MODEL && environment.OPENAI_MODEL !== 'undefined' && environment.OPENAI_MODEL !== 'null') process.env.OPENAI_MODEL = environment.OPENAI_MODEL;
  else delete process.env.OPENAI_MODEL;
  return { plugins: [localAnalyzeApi()], build: { rollupOptions: { input: { atelier: 'index.html', goulet: 'goulet/index.html' } } } };
});
