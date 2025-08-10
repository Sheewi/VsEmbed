# VSEmbed AI DevTool

A comprehensive AI-powered development environment that provides a portable, embeddable application where conversational AI agents write, execute, debug, and live-preview user projects inside a VS Code engine with full CLI environment integration.

## 🚀 Features

### Core Capabilities
- **AI-Powered Development**: Conversational AI that understands context and performs development tasks
- **Full VS Code Integration**: Complete access to VS Code extensions, commands, and APIs
- **Security-First Design**: Permission-based system with audit logging
- **Portable Workspaces**: Self-contained project structure
- **Live Preview**: Real-time preview with responsive design testing

### AI Model Support
- **OpenAI**: GPT-4, GPT-3.5 Turbo with function calling
- **Anthropic**: Claude with tool usage
- **Azure OpenAI**: Enterprise-grade AI integration
- **Local Models**: Support for locally hosted LLMs

## 📁 Installation Paths

VSEmbed uses these standard locations:
- **VSEmbed**: `/home/username/vsembed`
- **AI Models**: `/home/username/ai_models`
- **VS Code Config**: `/home/username/.vscode`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm 10+
- Git 2.40+
- Docker (optional, for sandboxing)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Sheewi/VsEmbed.git ~/vsembed
cd ~/vsembed

# Install dependencies
npm install --legacy-peer-deps

# Start the application
npm start
```

If you encounter missing dependencies, run:
```bash
npm install lucide-react @types/lucide-react --save-exact
npm run clean
npm run build
```

### Docker Configuration (Optional)

If you encounter Docker permission issues:
```bash
sudo usermod -aG docker $USER
newgrp docker
sudo systemctl restart docker
```

## ⚙️ Configuration

### AI Model Configuration

Set up API keys for cloud models:

```bash
export OPENAI_API_KEY='your_openai_api_key'
export ANTHROPIC_API_KEY='your_anthropic_api_key'
```

### Local Models Setup

1. Open VS Code and run the command:
   > AI Models: One-Click AI Model Setup

2. Follow the prompts to download and configure local models
   (Requires sufficient RAM - 16GB+ recommended)

## 🎯 Usage Examples

### AI Development Assistant

Start VSEmbed and use the chat interface to:
- Generate code based on requirements
- Debug existing code
- Get recommendations for improvements
- Access documentation and examples

### VS Code Integration

VSEmbed automatically detects project types and recommends appropriate extensions such as:
- JavaScript/TypeScript support
- Python tooling
- Git integration
- Testing frameworks

## 🔒 Security Features

- **Permission Management**: Control what the AI can access
- **Docker Sandboxing**: Isolate execution environments (when enabled)
- **Access Controls**: Limit filesystem and network access

## 🧩 Extension Integration

VSEmbed installs these extensions by default:
- **Python**: `ms-python.python`
- **TypeScript**: `ms-vscode.vscode-typescript-next`

## 🔧 Development

### Running Tests
```bash
npm test
```

Note: Some TypeScript test failures related to model caching are expected and won't prevent the application from running.

## 🚦 Roadmap

### Current Status
- ✅ Core AI integration
- ✅ VS Code extension support
- ✅ Basic security framework
- 🚧 Multi-model support (in progress)

## 📚 Documentation & Support

- **Documentation**: https://github.com/Sheewi/VsEmbed/blob/main/README.md
- **Issues**: https://github.com/Sheewi/VsEmbed/issues

## 📄 License

This project is licensed under the MIT License.

---

**VSEmbed AI DevTool** - Revolutionizing development with AI-powered assistance and full VS Code integration.

Sheewi: removeeandreplace placeholdes

GitHub Copilot: # VSEmbed AI DevTool

A comprehensive AI-powered development environment that provides a portable, embeddable application where conversational AI agents write, execute, debug, and live-preview user projects inside a VS Code engine with full CLI environment integration.

## 🚀 Features

### Core Capabilities
- **AI-Powered Development**: Conversational AI that understands context and performs development tasks
- **Full VS Code Integration**: Complete access to VS Code extensions, commands, and APIs
- **Security-First Design**: Permission-based system with audit logging
- **Portable Workspaces**: Self-contained project structure
- **Live Preview**: Real-time preview with responsive design testing

### AI Model Support
- **OpenAI**: GPT-4, GPT-3.5 Turbo with function calling
- **Anthropic**: Claude with tool usage
- **Azure OpenAI**: Enterprise-grade AI integration
- **Local Models**: Support for locally hosted LLMs

## 📁 Project Structure

```
src/
├── ai/                         # AI Core System
│   ├── config.ts               # Model configuration management
│   ├── orchestrator.ts         # Main AI orchestration engine
│   └── tool-executor.ts        # Tool execution and permission handling
├── extensions/                 # Extension Management
├── permissions/                # Security & Permissions
├── renderer/                   # React Frontend
│   ├── components/             # UI Components
│   ├── contexts/               # React Context Providers
│   └── styles/                 # CSS Styling
├── main/                       # Electron Main Process
│   ├── main.ts                 # Application entry point
│   └── services/               # Backend services
└── types/                      # TypeScript definitions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm 10+
- Git 2.40+
- Docker (optional, for sandboxing)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Sheewi/VsEmbed.git ~/vsembed
cd ~/vsembed

# Install dependencies
npm install --legacy-peer-deps

# Start the application
npm start
```

If you encounter missing dependencies, run:
```bash
npm install lucide-react @types/lucide-react --save-exact
npm run clean
npm run build
```

### Docker Configuration (Optional)

If you encounter Docker permission issues:
```bash
sudo usermod -aG docker $USER
newgrp docker
sudo systemctl restart docker
```

## ⚙️ Configuration

### AI Model Configuration

Set up API keys for cloud models:

```bash
export OPENAI_API_KEY='your_openai_api_key'
export ANTHROPIC_API_KEY='your_anthropic_api_key'
```

### VS Code Integration

VSEmbed automatically detects project types and recommends appropriate extensions such as:
- JavaScript/TypeScript support
- Python tooling
- Git integration
- Testing frameworks

## 🔒 Security Features

- **Permission Management**: Control what the AI can access
- **Docker Sandboxing**: Isolate execution environments (when enabled)
- **Access Controls**: Limit filesystem and network access

## 🧩 Extension Integration

VSEmbed installs these extensions by default:
- **Python**: `ms-python.python`
- **TypeScript**: `ms-vscode.vscode-typescript-next`

## 🔧 Development

### Running Tests
```bash
npm test
```

Note: Some TypeScript test failures related to model caching are expected and won't prevent the application from running.

## 🚦 Roadmap

### Current Status
- ✅ Core AI integration
- ✅ VS Code extension support
- ✅ Basic security framework
- 🚧 Multi-model support (in progress)

## 📚 Documentation & Support

- **Documentation**: https://github.com/Sheewi/VsEmbed/blob/main/README.md
- **Issues**: https://github.com/Sheewi/VsEmbed/issues

## 📄 License

This project is licensed under the MIT License.

---

**VSEmbed AI DevTool** - Revolutionizing development with AI-powered assistance and full VS Code integration.

Sheewi: can you update it please

GitHub Copilot: # VSEmbed AI DevTool

A comprehensive AI-powered development environment that provides a portable, embeddable application where conversational AI agents write, execute, debug, and live-preview user projects inside a VS Code engine with full CLI environment integration.

## 🚀 Features

### Core Capabilities
- **AI-Powered Development**: Conversational AI that understands context and performs development tasks
- **Full VS Code Integration**: Complete access to VS Code extensions, commands, and APIs
- **Security-First Design**: Permission-based system with audit logging
- **Portable Workspaces**: Self-contained project structure
- **Live Preview**: Real-time preview with responsive design testing

### AI Model Support
- **OpenAI**: GPT-4, GPT-3.5 Turbo with function calling
- **Anthropic**: Claude with tool usage
- **Azure OpenAI**: Enterprise-grade AI integration
- **Local Models**: Support for locally hosted LLMs

## 📁 Installation Paths

VSEmbed uses these standard locations:
- **VSEmbed**: `/home/username/vsembed`
- **AI Models**: `/home/username/ai_models`
- **VS Code Config**: `/home/username/.vscode`

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm 10+
- Git 2.40+
- Docker (optional, for sandboxing)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Sheewi/VsEmbed.git ~/vsembed
cd ~/vsembed

# Install dependencies
npm install --legacy-peer-deps

# Start the application
npm start
```

If you encounter missing dependencies, run:
```bash
npm install lucide-react @types/lucide-react --save-exact
npm run clean
npm run build
```

### Docker Configuration (Optional)

If you encounter Docker permission issues:
```bash
sudo usermod -aG docker $USER
newgrp docker
sudo systemctl restart docker
```

## ⚙️ Configuration

### AI Model Configuration

Set up API keys for cloud models:

```bash
export OPENAI_API_KEY='your_openai_api_key'
export ANTHROPIC_API_KEY='your_anthropic_api_key'
```

### Local Models Setup

1. Open VS Code and run the command:
   > AI Models: One-Click AI Model Setup

2. Follow the prompts to download and configure local models
   (Requires sufficient RAM - 16GB+ recommended)

## 🎯 Usage Examples

### AI Development Assistant

Start VSEmbed and use the chat interface to:
- Generate code based on requirements
- Debug existing code
- Get recommendations for improvements
- Access documentation and examples

### VS Code Integration

VSEmbed automatically detects project types and recommends appropriate extensions such as:
- JavaScript/TypeScript support
- Python tooling
- Git integration
- Testing frameworks

## 🔒 Security Features

- **Permission Management**: Control what the AI can access
- **Docker Sandboxing**: Isolate execution environments (when enabled)
- **Access Controls**: Limit filesystem and network access

## 🧩 Extension Integration

VSEmbed installs these extensions by default:
- **Python**: `ms-python.python`
- **TypeScript**: `ms-vscode.vscode-typescript-next`

## 🔧 Development

### Running Tests
```bash
npm test
```

Note: Some TypeScript test failures related to model caching are expected and won't prevent the application from running.

## 🚦 Roadmap

### Current Status
- ✅ Core AI integration
- ✅ VS Code extension support
- ✅ Basic security framework
- 🚧 Multi-model support (in progress)

## 📚 Documentation & Support

- **Documentation**: https://github.com/Sheewi/VsEmbed/blob/main/README.md
- **Issues**: https://github.com/Sheewi/VsEmbed/issues

## 📄 License

This project is licensed under the MIT License.

---

**VSEmbed AI DevTool** - Revolutionizing development with AI-powered assistance and full VS Code integration.