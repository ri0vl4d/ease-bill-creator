export enum PDFStyle {
  SIMPLE_LOGO = 'simple_logo',
  FORMAL_LETTERHEAD = 'formal_letterhead',
  MODERN_MINIMAL = 'modern_minimal'
}

export interface PDFStyleOption {
  value: PDFStyle;
  label: string;
  description: string;
}

export const PDF_STYLE_OPTIONS: PDFStyleOption[] = [
  {
    value: PDFStyle.SIMPLE_LOGO,
    label: 'Simple Logo',
    description: 'Clean design with company logo and name'
  },
  {
    value: PDFStyle.FORMAL_LETTERHEAD,
    label: 'Formal Letterhead',
    description: 'Traditional business letterhead format'
  },
  {
    value: PDFStyle.MODERN_MINIMAL,
    label: 'Modern Minimal',
    description: 'Contemporary design with clean typography'
  }
];