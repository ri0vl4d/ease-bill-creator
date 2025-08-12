// Import types from separate file
export type { InvoiceData, TemplateConfig } from './pdfTemplates/types';

// Import template generators from separate files
import { generateModernTemplate } from './pdfTemplates/generators/modern';
import { generateClassicTemplate } from './pdfTemplates/generators/classic';
import { generateMinimalTemplate } from './pdfTemplates/generators/minimal';
import { generateExtrapeTemplate } from './pdfTemplates/generators/extrape';

import type { TemplateConfig } from './pdfTemplates/types';

export const INVOICE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and modern design with blue accents',
    preview: '/templates/modern-preview.png',
    colors: {
      primary: '#2563eb',
      secondary: '#f8fafc',
      accent: '#3b82f6'
    }
  },
  {
    id: 'classic',
    name: 'Classic Business',
    description: 'Traditional business invoice with elegant styling',
    preview: '/templates/classic-preview.png',
    colors: {
      primary: '#1f2937',
      secondary: '#f9fafb',
      accent: '#6b7280'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content clarity',
    preview: '/templates/minimal-preview.png',
    colors: {
      primary: '#374151',
      secondary: '#ffffff',
      accent: '#9ca3af'
    }
  },
  {
    id: 'Extrape',
    name: 'Extrape Format',
    description: 'Professional Extrape design ',
    preview: '/templates/Extrape-preview.png',
    colors: {
      primary: '#1f2937',
      secondary: '#f9fafb',
      accent: '#6b7280'
    }
  }
];

// Export template generators object for use by pdfGenerator
export const TEMPLATE_GENERATORS = {
  modern: generateModernTemplate,
  classic: generateClassicTemplate,
  minimal: generateMinimalTemplate,
  Extrape: generateExtrapeTemplate,
};