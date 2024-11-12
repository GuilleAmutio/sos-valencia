declare module '*.md' {
  const content: string;
  export default content;
}

// Add this to ensure TypeScript recognizes the raw import
declare module '@/content/*.md' {
  const content: string;
  export default content;
} 