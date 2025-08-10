/**
 * AI Model Management System - Main Export
 *
 * Comprehensive one-click AI model installation and management system for VS Code
 * Features:
 * - Automatic hardware detection and model recommendation
 * - 15+ preconfigured AI models (local and cloud)
 * - One-click installation with progress tracking
 * - Model optimization and configuration
 * - Beautiful UI for model management
 * - VS Code integration with commands and status bar
 */

export { AIModel, SystemHardware, ModelDetector } from './model-autodetect';
export { ModelInstaller, DownloadProgress, ModelInstallOptions } from './model-installer';
export { ModelSelectorUI, ModelSelectionResult } from './model-selector-ui';
export { OneClickModelSetup } from './one-click-setup';
export { AIModelManager } from './ai-model-manager';

import * as vscode from 'vscode';
import { AIModelManager } from './ai-model-manager';

/**
 * Activate the AI Model Management system
 */
export function activate(context: vscode.ExtensionContext): void {
	// Register all commands and initialize the system
	AIModelManager.registerCommands(context);

	// Show welcome message for new users
	const hasShownWelcome = context.globalState.get('ai.hasShownWelcome', false);
	if (!hasShownWelcome) {
		showWelcomeMessage(context);
	}
}

/**
 * Deactivate the AI Model Management system
 */
export function deactivate(): void {
	// Cleanup will be handled by the disposables
}

async function showWelcomeMessage(context: vscode.ExtensionContext): Promise<void> {
	const showWelcome = vscode.workspace.getConfiguration('ai.models').get('showWelcomeMessage', true);

	if (!showWelcome) return;

	const choice = await vscode.window.showInformationMessage(
		'🤖 Welcome to AI Model Manager!\n\nAutomatically install and manage AI models with one click. Get started now?',
		{ modal: false },
		'One-Click Setup',
		'Browse Models',
		'Learn More',
		"Don't Show Again"
	);

	switch (choice) {
		case 'One-Click Setup':
			vscode.commands.executeCommand('ai.oneClickModelSetup');
			break;
		case 'Browse Models':
			vscode.commands.executeCommand('ai.openModelManager');
			break;
		case 'Learn More':
			vscode.commands.executeCommand('workbench.action.openWalkthrough', 'aiModelSetup');
			break;
		case "Don't Show Again":
			await vscode.workspace.getConfiguration('ai.models').update('showWelcomeMessage', false, vscode.ConfigurationTarget.Global);
			break;
	}

	await context.globalState.update('ai.hasShownWelcome', true);
}

/**
 * Quick utility functions for external use
 */
export class AIModelUtils {
	/**
	 * Get the currently active AI model
	 */
	public static async getActiveModel(): Promise<any | null> {
		const manager = AIModelManager.getInstance();
		return await manager.getActiveModel();
	}

	/**
	 * Check if any AI models are available
	 */
	public static async hasAvailableModels(): Promise<boolean> {
		try {
			const { ModelDetector } = await import('./model-autodetect');
			const models = await ModelDetector.getAvailableModels();
			return models.some(m => m.status === 'available');
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get execution command for a model
	 */
	public static async getModelExecutionCommand(modelId?: string): Promise<string | null> {
		const manager = AIModelManager.getInstance();
		return await manager.getModelExecutionCommand(modelId);
	}

	/**
	 * Trigger one-click setup programmatically
	 */
	public static async runOneClickSetup(): Promise<boolean> {
		const manager = AIModelManager.getInstance();
		return await manager.runOneClickSetup();
	}

	/**
	 * Open model manager UI
	 */
	public static async openModelManager(): Promise<void> {
		const manager = AIModelManager.getInstance();
		await manager.openModelManager();
	}
}

// Export default for compatibility
export default {
	activate,
	deactivate,
	AIModelUtils
};
