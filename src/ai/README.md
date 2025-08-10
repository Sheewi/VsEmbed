# AI Model Management System - Usage Examples

This document shows how to use the comprehensive AI Model Management system.

## 🚀 Quick Start

### One-Click Setup
```typescript
import { AIModelUtils } from './ai';

// Run automatic setup - detects hardware and installs best model
const success = await AIModelUtils.runOneClickSetup();
if (success) {
    console.log('AI model ready to use!');
}
```

### Check Available Models
```typescript
// Check if any models are available
const hasModels = await AIModelUtils.hasAvailableModels();
if (!hasModels) {
    // Trigger setup
    await AIModelUtils.runOneClickSetup();
}
```

## 📊 Model Management

### Get Active Model
```typescript
const activeModel = await AIModelUtils.getActiveModel();
if (activeModel) {
    console.log(`Using: ${activeModel.name}`);
    console.log(`Type: ${activeModel.type}`);
    console.log(`Capabilities: ${activeModel.capabilities.join(', ')}`);
}
```

### Get Execution Command
```typescript
// Get command to run the active model
const command = await AIModelUtils.getModelExecutionCommand();
if (command) {
    console.log(`Run with: ${command}`);
}

// Get command for specific model
const specificCommand = await AIModelUtils.getModelExecutionCommand('llama3-8b-q4');
```

## 🎛️ Advanced Usage

### Manual Model Detection
```typescript
import { ModelDetector } from './ai';

// Check system hardware
const systemInfo = await ModelDetector.checkSystemHardware();
console.log(`CPU Cores: ${systemInfo.cpuCores}`);
console.log(`RAM: ${systemInfo.totalRam / (1024**3)} GB`);
console.log(`GPU: ${systemInfo.hasGpu ? 'Available' : 'Not available'}`);

// Find best model for system
const recommendedModel = await ModelDetector.findBestModel();
console.log(`Recommended: ${recommendedModel?.name}`);

// Get all available models
const models = await ModelDetector.getAvailableModels();
console.log(`Total models: ${models.length}`);
```

### Manual Installation
```typescript
import { ModelInstaller } from './ai';

const installer = new ModelInstaller();

// Listen for progress
installer.on('downloadProgress', (progress) => {
    console.log(`${progress.modelId}: ${progress.progress}%`);
});

installer.on('downloadComplete', (progress) => {
    console.log(`${progress.modelId} installation complete!`);
});

// Install specific model
await installer.installModel('llama3-8b-q4', {
    quantization: 'q4_0',
    force: false,
    skipVerification: false
});
```

### Model Selection UI
```typescript
import { ModelSelectorUI } from './ai';

// Show model selection interface
const result = await ModelSelectorUI.showModelSelector();

if (result.action === 'select' && result.selectedModel) {
    console.log(`Selected: ${result.selectedModel.name}`);
} else if (result.action === 'install') {
    console.log('User chose to install a model');
}
```

## 🛠️ Configuration

### VS Code Settings
```json
{
    "ai.activeModel": "llama3-8b-q4",
    "ai.models.autoDetect": true,
    "ai.models.downloadPath": "~/ai_models",
    "ai.models.enableGpuAcceleration": true,
    "ai.models.defaultQuantization": "q4_0",
    "ai.models.contextLength": 2048
}
```

### Environment Variables
```bash
# For cloud models
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export GOOGLE_API_KEY="..."
```

## 📋 Available Models

### Local Models (GGUF)
- **Llama 3 70B** - Most capable, requires 64GB+ RAM
- **Llama 3 8B** - Balanced performance, requires 8GB+ RAM
- **Dolphin Uncensored** - Creative writing, fewer restrictions
- **CodeLlama 34B** - Specialized for coding tasks
- **Mistral 7B** - Efficient general-purpose model
- **Phi-3 Medium** - Microsoft's efficient model
- **WizardCoder 15B** - Code generation specialist
- **Neural Chat 7B** - Conversational AI
- **DeepSeek Coder 33B** - Advanced coding model
- **Vicuna 13B Uncensored** - Open conversations

### Cloud Models (API)
- **Claude 3 Sonnet** - Anthropic's balanced model
- **Claude 3 Haiku** - Fast and cost-effective
- **GPT-4** - OpenAI's most capable
- **GPT-3.5 Turbo** - Fast and affordable
- **Gemini Pro** - Google's multimodal model

## 🎮 VS Code Commands

Access through Command Palette (`Ctrl+Shift+P`):

- `AI Models: One-Click AI Model Setup` - Automatic setup
- `AI Models: Open Model Manager` - Browse and manage models
- `AI Models: Quick Model Switch` - Switch between installed models
- `AI Models: Show Model Statistics` - View model info
- `AI Models: Test Active Model` - Verify model works

## ⌨️ Keyboard Shortcuts

- `Ctrl+Shift+M` (`Cmd+Shift+M` on Mac) - Quick Model Switch
- `Ctrl+Shift+A` (`Cmd+Shift+A` on Mac) - Open Model Manager

## 🔧 Troubleshooting

### Model Not Downloading
```typescript
// Check download progress
const installer = new ModelInstaller();
const activeDownloads = installer.getActiveDownloads();
console.log('Active downloads:', activeDownloads);

// Cancel stuck download
await installer.cancelDownload('model-id');
```

### GPU Not Detected
```typescript
// Check GPU status
const systemInfo = await ModelDetector.checkSystemHardware();
if (!systemInfo.hasGpu) {
    console.log('GPU not available, using CPU only');
}

// Force GPU check
const hasGpu = await ModelDetector.hasGpu();
```

### Model Path Issues
```typescript
// Get model information
const models = await ModelDetector.getAvailableModels();
const model = models.find(m => m.id === 'your-model-id');

if (model && model.path) {
    console.log(`Model path: ${model.path}`);

    // Check if file exists
    const fs = require('fs/promises');
    try {
        await fs.access(model.path.replace('~', os.homedir()));
        console.log('Model file exists');
    } catch (error) {
        console.log('Model file not found');
    }
}
```

## 🚀 Integration Example

Complete example of integrating AI models into your extension:

```typescript
import * as vscode from 'vscode';
import { AIModelUtils, ModelDetector } from './ai';

export async function activate(context: vscode.ExtensionContext) {
    // Initialize AI models
    const hasModels = await AIModelUtils.hasAvailableModels();

    if (!hasModels) {
        // Show setup prompt
        const setup = await vscode.window.showInformationMessage(
            'No AI models found. Set up now?',
            'One-Click Setup',
            'Manual Setup'
        );

        if (setup === 'One-Click Setup') {
            await AIModelUtils.runOneClickSetup();
        } else if (setup === 'Manual Setup') {
            await AIModelUtils.openModelManager();
        }
    }

    // Register command that uses AI
    const aiCommand = vscode.commands.registerCommand('myext.askAI', async () => {
        const activeModel = await AIModelUtils.getActiveModel();

        if (!activeModel) {
            vscode.window.showErrorMessage('No AI model available');
            return;
        }

        const question = await vscode.window.showInputBox({
            prompt: `Ask ${activeModel.name} a question`
        });

        if (question) {
            // Use the model to process the question
            const command = await AIModelUtils.getModelExecutionCommand();
            if (command) {
                // Execute AI model with question
                console.log(`Would run: ${command} "${question}"`);
            }
        }
    });

    context.subscriptions.push(aiCommand);
}
```

This system provides everything needed for comprehensive AI model management in VS Code!
