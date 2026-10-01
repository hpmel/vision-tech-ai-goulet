import { copyFile, mkdir } from 'node:fs/promises';

// Keep a standalone API in each project's repository and deployment.
try {
  const target = new URL('../upstream/vision-tech-ai-garageSTR/', import.meta.url);
  for (const directory of ['api', 'src/api', 'src/services']) await mkdir(new URL(directory, target), { recursive: true });
  for (const file of ['api/demo-inquiry.ts', 'api/demo-health.ts', 'src/api/demoInquiry.ts', 'src/api/demoHealth.ts', 'src/services/demoInquiryTypes.ts', 'src/services/demoInquiryValidation.ts', 'src/services/demoEmailTemplates.ts', 'src/services/demoEmailDelivery.ts']) {
    await copyFile(new URL(`../${file}`, import.meta.url), new URL(file, target));
  }
  console.log('Standalone STR demo API exported.');
} catch (error) {
  console.error('Demo API export failed.', error);
  process.exitCode = 1;
}
