# VSEmbed AI DevTool

A comprehensive AI-powered development environment that provides a portable, embeddable application where conversational AI agents write, execute, debug, and live-preview user projects inside a VS Code engine with full CLI environment integration.

## 🚀 Features

### Core Capabilities
- **AI-Powered Development**: Conversational AI that understands context and performs development tasks
- **Full VS Code Integration**: Complete access to VS Code extensions, commands, and APIs
- **Security-First Design**: Permission-based system with audit logging and approval workflows
- **Portable Workspaces**: Self-contained `.devstudio/` project structure
- **Live Preview**: Real-time preview with responsive design testing
- **Multi-Platform Support**: Docker, GCP, Kali tools integration

### AI Model Support
- **OpenAI**: GPT-4, GPT-3.5 Turbo with function calling
- **Anthropic**: Claude with tool usage
- **Azure OpenAI**: Enterprise-grade AI integration
- **Local Models**: Support for locally hosted LLMs

### Extension Ecosystem
- **Dynamic Discovery**: Automatically detects and recommends extensions
- **Permission Management**: Granular control over extension access
- **Context-Aware Suggestions**: Smart recommendations based on project files
- **Installation Automation**: One-click extension installation

## 📁 Project Structure

```
src/
├── ai/                          # AI Core System
│   ├── config.ts               # Model configuration management
│   ├── orchestrator.ts         # Main AI orchestration engine
│   └── tool-executor.ts        # Tool execution and permission handling
├── extensions/                  # Extension Management
│   └── recommender.ts          # Smart extension recommendation engine
├── permissions/                 # Security & Permissions
│   └── manager.ts              # Permission management and audit logging
├── renderer/                   # React Frontend
│   ├── components/             # UI Components
│   │   ├── Layout.tsx          # Main application layout
│   │   ├── ChatPane.tsx        # AI conversation interface
│   │   ├── EditorPane.tsx      # Monaco code editor
│   │   ├── TerminalPane.tsx    # Multi-shell terminal
│   │   ├── PreviewPane.tsx     # Live preview panel
│   │   ├── FileExplorer.tsx    # File management
│   │   ├── StatusBar.tsx       # System status and monitoring
│   │   ├── MenuHandler.tsx     # Application menu system
│   │   ├── ModelSettings.tsx   # AI model configuration UI
│   │   └── PermissionRequestDialog.tsx # Permission approval dialogs
│   ├── contexts/               # React Context Providers
│   │   ├── AIContext.tsx       # AI state management
│   │   ├── WorkspaceContext.tsx # Workspace management
│   │   ├── RunnerContext.tsx   # Build/run operations
│   │   └── NotificationContext.tsx # System notifications
│   └── styles/                 # CSS Styling
├── main/                       # Electron Main Process
│   ├── main.ts                 # Application entry point
│   ├── preload.ts              # Secure IPC bridge
│   └── services/               # Backend services
└── types/                      # TypeScript definitions
    └── index.ts                # Global type definitions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/your-org/vsembed-ai-devtool.git
cd vsembed-ai-devtool

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Start development
npm run dev
```

### Production Build
```bash
# Build the application
npm run build

# Package for distribution
npm run package
```

## ⚙️ Configuration

### AI Model Configuration

Create a `.env` file with your API keys:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_azure_api_key

# Local Model Configuration (optional)
LOCAL_MODEL_ENDPOINT=http://localhost:11434
```

### VS Code Extensions Access

Configure which extensions the AI can access:

```json
{
  "ai": {
    "tools": {
      "vscode": {
        "fileAccess": true,
        "terminal": false,
        "extensions": true,
        "debugger": false
      },
      "docker": true,
      "gcp": true,
      "kali": false
    },
    "permissions": {
      "dangerousOperations": false,
      "networkAccess": true,
      "fileSystemWrite": false
    }
  }
}
```

## 🎯 Usage Examples

### Basic AI Interaction
```typescript
// Chat with AI about your project
"Please analyze my React project and suggest improvements"

// AI will:
// 1. Scan your project files
// 2. Recommend relevant extensions (ESLint, Prettier, etc.)
// 3. Suggest code improvements
// 4. Offer to implement changes
```

### Extension Recommendations
```typescript
// AI detects project needs
"I see you have a Python project. Let me recommend some extensions..."

// Automatically suggests:
// - ms-python.python (Language support)
// - ms-python.pylint (Linting)
// - ms-toolsai.jupyter (Notebook support)
```

### Security Tool Integration
```typescript
// Enable Kali tools for security testing
"Run a network scan on localhost"

// AI will:
// 1. Request permission for Kali tools
// 2. Execute nmap scan
// 3. Present formatted results
// 4. Suggest security improvements
```

### Docker Operations
```typescript
// Container management
"Build a Docker image for my Node.js app"

// AI will:
// 1. Analyze your project
// 2. Generate appropriate Dockerfile
// 3. Build the container
// 4. Offer deployment options
```

## 🔒 Security Features

### Permission System
- **Granular Control**: Per-extension, per-command permissions
- **Approval Workflows**: User confirmation for dangerous operations
- **Audit Logging**: Complete history of all permission grants/denials
- **Risk Assessment**: Automatic classification of operation safety

### Security Rules
```typescript
const securityRules = [
  {
    pattern: '*.terminal.*',
    defaultAction: 'deny',
    riskLevel: 'high',
    description: 'Terminal access'
  },
  {
    pattern: 'kali-*',
    defaultAction: 'deny',
    riskLevel: 'high',
    description: 'Security tools access'
  }
];
```

### Audit Trail
- All AI actions logged with timestamps
- Permission decisions tracked
- Security events monitored
- Export capability for compliance

## 🧩 Extension Integration

### Supported Extensions

#### Language Support
- **JavaScript/TypeScript**: `ms-vscode.vscode-typescript-next`
- **Python**: `ms-python.python`
- **Go**: `golang.go`
- **Rust**: `rust-lang.rust-analyzer`
- **Java**: `redhat.java`

#### Development Tools
- **Docker**: `ms-azuretools.vscode-docker`
- **Git**: `eamodio.gitlens`
- **Testing**: `ms-vscode.test-adapter-converter`
- **Debugging**: `ms-vscode.vscode-js-debug`

#### Formatters & Linters
- **Prettier**: `esbenp.prettier-vscode`
- **ESLint**: `dbaeumer.vscode-eslint`
- **Python Black**: `ms-python.black-formatter`

### Custom Extension Integration

```typescript
// Register custom extension tools
export class CustomExtensionTool {
  async execute(command: string, args: any[]): Promise<any> {
    // Your custom extension logic
    return await vscode.commands.executeCommand(command, ...args);
  }
}
```

## 🔧 Development

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Scripts
```bash
# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## 📊 Monitoring & Analytics

### System Metrics
- AI response times
- Extension usage statistics
- Permission approval rates
- Error frequencies

### Performance Monitoring
- Memory usage tracking
- CPU utilization
- Network request monitoring
- Extension load times

## 🚦 Roadmap

### Phase 1: Core Features ✅
- [x] AI conversation interface
- [x] VS Code extension integration
- [x] Permission management system
- [x] Basic security framework

### Phase 2: Advanced Integration 🚧
- [ ] Multi-model support completion
- [ ] Advanced extension recommendations
- [ ] Enhanced security policies
- [ ] Performance optimization

### Phase 3: Enterprise Features 📋
- [ ] Team collaboration
- [ ] Enterprise authentication
- [ ] Advanced audit reporting
- [ ] Custom model fine-tuning

## 📖 API Reference

### AI Orchestrator
```typescript
class AIOrchestrator {
  // Process user messages with AI
  async processUserMessage(message: string): Promise<AsyncIterable<StreamToken>>

  // Update AI model configuration
  async updateModelConfiguration(config: Partial<ModelConfig>): Promise<void>

  // Get conversation history
  getConversationHistory(): ChatMessage[]

  // Clear conversation
  clearConversation(): void
}
```

### Permission Manager
```typescript
class PermissionManager {
  // Request permission for extension usage
  async requestExtensionPermission(extensionId: string, command: string, purpose: string): Promise<boolean>

  // Check existing permissions
  hasPermission(extensionId: string, command?: string): boolean

  // Get security audit report
  getSecurityReport(): SecurityReport
}
```

### Extension Recommender
```typescript
class ExtensionRecommender {
  // Get recommendations based on workspace
  recommendExtensions(context: WorkspaceContext): ExtensionRecommendation[]

  // Generate installation scripts
  getInstallationScript(recommendations: ExtensionRecommendation[]): string[]
}
```

## 🤝 Community

- **Discord**: [Join our community](https://discord.gg/vsembed)
- **GitHub Discussions**: [Share ideas and feedback](https://github.com/your-org/vsembed/discussions)
- **Documentation**: [Comprehensive guides](https://docs.vsembed.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- VS Code team for the amazing editor platform
- OpenAI, Anthropic for AI model access
- Extension developers for the rich VS Code ecosystem
- Open source community for inspiration and contributions

---

**VSEmbed AI DevTool** - Revolutionizing development with AI-powered assistance and full VS Code integration.
