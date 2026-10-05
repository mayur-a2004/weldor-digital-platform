export interface ProductCardTheme {
  cardBg: string;
  border: string;
  canvasBg: string;
  canvasBorder: string;
  glow: string;
  badgeBg: string;
  accentBar: string;
  footerBg: string;
  specBg: string;
  btnBg: string;
  accentText: string;
  dotColor: string;
}

/**
 * Unified, eye-comfortable warm industrial design theme for ALL product cards.
 * Uses a single cohesive palette matching Weldor's brand orange, warm ivory,
 * and clean technical dark slate to ensure high visual comfort and consistency.
 */
export const getProductCardTheme = (_category: string = ''): ProductCardTheme => {
  return {
    cardBg: 'bg-gradient-to-b from-white via-[#FCFAF7] to-[#FAF6EE]',
    border: 'border-slate-200/90 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10',
    canvasBg: 'bg-gradient-to-b from-[#F9F7F2] via-white to-[#FBF8F3]',
    canvasBorder: 'border-slate-200/70',
    glow: 'from-orange-500/10 via-amber-400/5 to-transparent',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200/80 shadow-2xs',
    accentBar: 'from-orange-500 via-amber-500 to-orange-600',
    footerBg: 'bg-[#F8F5EE]/80 border-slate-200/70',
    specBg: 'bg-white/80 border-slate-200/70',
    btnBg: 'bg-orange-600 hover:bg-orange-500 text-white',
    accentText: 'text-slate-900 group-hover:text-orange-600',
    dotColor: 'bg-orange-500'
  };
};
