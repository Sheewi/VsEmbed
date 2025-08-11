export interface ModelConfig {
	name: string;
	provider: string;
	apiKey?: string;
	endpoint?: string;
	maxTokens?: number;
	temperature?: number;
}

export interface ExtensionRecommendation {
	extensionId: string;
	reason: string;
	urgency: 'low' | 'medium' | 'high';
	category: string;
	requiredForTask?: string;
}
