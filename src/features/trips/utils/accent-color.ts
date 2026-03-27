const PALETTE = ['#4F46E5', '#F5A623', '#22C55E', '#EF4444', '#8B5CF6', '#0EA5E9'];

export function tripAccentColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
