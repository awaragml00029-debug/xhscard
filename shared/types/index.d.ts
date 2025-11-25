export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export type CardTheme = 'pink' | 'blue' | 'orange' | 'green' | 'purple' | 'sunset';
export interface Card {
    id: string;
    title: string;
    content: string;
    tags: string[];
    theme: CardTheme;
    order: number;
}
export interface CardColorScheme {
    name: string;
    gradient: string;
    titleColor: string;
    contentColor: string;
    tagBg: string;
    tagText: string;
}
export type PPTSlideType = 'cover' | 'content' | 'ending';
export type PPTTheme = 'business-blue' | 'tech-purple' | 'fresh-green' | 'warm-orange' | 'elegant-gray' | 'vibrant-red';
export interface PPTSlide {
    id: string;
    type: PPTSlideType;
    title: string;
    content: string[];
    notes?: string;
    theme: PPTTheme;
    order: number;
}
export interface PPTThemeConfig {
    name: string;
    primary: string;
    secondary: string;
    background: string;
    textColor: string;
    accentColor: string;
}
export interface GeminiCardContent {
    title: string;
    content: string;
    tags: string[];
}
export interface GeminiPPTContent {
    type: PPTSlideType;
    title: string;
    content: string[];
    notes?: string;
}
export interface ConfigRequest {
    apiKey: string;
}
export interface GenerateCardsRequest {
    topic: string;
    count?: number;
    apiKey: string;
}
export interface GenerateCardsResponse {
    cards: Card[];
}
export interface GeneratePPTRequest {
    topic: string;
    slideCount?: number;
    theme?: PPTTheme;
    language?: string;
    apiKey: string;
}
export interface GeneratePPTResponse {
    slides: PPTSlide[];
}
export interface ExportPPTRequest {
    slides: PPTSlide[];
    theme: PPTTheme;
    title: string;
}
export interface ExportPPTResponse {
    downloadUrl: string;
    filename: string;
}
export interface GetPPTThemesResponse {
    themes: PPTThemeConfig[];
}
//# sourceMappingURL=index.d.ts.map