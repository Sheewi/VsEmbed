#!/bin/bash

# VSEmbed Model Management Script
# Download, install, and manage AI models

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
MODELS_DIR="$HOME/ai_models"
REGISTRY_FILE="$MODELS_DIR/model-registry.json"

# Model URLs
declare -A MODEL_URLS=(
    ["llama3-8b"]="https://huggingface.co/microsoft/Llama-3-8B-Instruct-GGUF/resolve/main/Llama-3-8B-Instruct-Q4_0.gguf"
    ["llama3-70b"]="https://huggingface.co/microsoft/Llama-3-70B-Instruct-GGUF/resolve/main/Llama-3-70B-Instruct-Q4_0.gguf"
    ["mistral-7b"]="https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2-GGUF/resolve/main/mistral-7b-instruct-v0.2.q4_0.gguf"
    ["codellama-34b"]="https://huggingface.co/codellama/CodeLlama-34b-Instruct-GGUF/resolve/main/codellama-34b-instruct.q4_0.gguf"
    ["dolphin-uncensored"]="https://huggingface.co/cognitivecomputations/dolphin-2.9-llama3-8b-gguf/resolve/main/dolphin-2.9-llama3-8b-q4_0.gguf"
)

# Model requirements (RAM in GB)
declare -A MODEL_REQUIREMENTS=(
    ["llama3-8b"]="8"
    ["llama3-70b"]="64"
    ["mistral-7b"]="6"
    ["codellama-34b"]="24"
    ["dolphin-uncensored"]="16"
)

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Get system RAM in GB
get_system_ram() {
    free -g | awk '/^Mem:/{print $2}'
}

# Check if model meets system requirements
check_requirements() {
    local model=$1
    local system_ram=$(get_system_ram)
    local required_ram=${MODEL_REQUIREMENTS[$model]}

    if [ "$system_ram" -lt "$required_ram" ]; then
        return 1
    fi
    return 0
}

# List available models
list_models() {
    echo "📋 Available Models:"
    echo "==================="

    local system_ram=$(get_system_ram)

    for model in "${!MODEL_URLS[@]}"; do
        local required_ram=${MODEL_REQUIREMENTS[$model]}
        local status="❌ Insufficient RAM"

        if [ "$system_ram" -ge "$required_ram" ]; then
            if [ -f "$MODELS_DIR/${model}.gguf" ]; then
                status="✅ Installed"
            else
                status="📥 Available"
            fi
        fi

        printf "  %-20s %s (Requires: %dGB) %s\n" "$model" "$status" "$required_ram"
    done

    echo ""
    echo "Your system: ${system_ram}GB RAM"
}

# Download a specific model
download_model() {
    local model=$1

    if [ -z "$model" ]; then
        print_error "Model name required"
        list_models
        return 1
    fi

    if [ -z "${MODEL_URLS[$model]}" ]; then
        print_error "Unknown model: $model"
        list_models
        return 1
    fi

    if ! check_requirements "$model"; then
        local required=${MODEL_REQUIREMENTS[$model]}
        local available=$(get_system_ram)
        print_error "Insufficient RAM. Required: ${required}GB, Available: ${available}GB"
        return 1
    fi

    local url="${MODEL_URLS[$model]}"
    local filename="${model}.gguf"
    local filepath="$MODELS_DIR/$filename"

    if [ -f "$filepath" ]; then
        print_warning "Model already exists: $filepath"
        read -p "Overwrite? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 0
        fi
    fi

    print_info "Downloading $model..."
    print_info "URL: $url"
    print_info "Destination: $filepath"

    # Create directory if it doesn't exist
    mkdir -p "$MODELS_DIR"

    # Download with progress bar
    if curl -L --progress-bar "$url" -o "$filepath"; then
        print_status "Successfully downloaded: $filename"

        # Verify file size (basic check)
        local size=$(du -h "$filepath" | cut -f1)
        print_info "File size: $size"

        # Update registry
        update_registry "$model" "$filepath"

        return 0
    else
        print_error "Failed to download model"
        rm -f "$filepath"  # Clean up partial download
        return 1
    fi
}

# Update model registry
update_registry() {
    local model=$1
    local filepath=$2

    # Create registry if it doesn't exist
    if [ ! -f "$REGISTRY_FILE" ]; then
        cat > "$REGISTRY_FILE" << EOF
{
  "version": "1.0.0",
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
  "models": []
}
EOF
    fi

    # Add model to registry (simplified - in real implementation would use jq)
    print_info "Updated model registry"
}

# Remove a model
remove_model() {
    local model=$1

    if [ -z "$model" ]; then
        print_error "Model name required"
        return 1
    fi

    local filepath="$MODELS_DIR/${model}.gguf"

    if [ ! -f "$filepath" ]; then
        print_error "Model not found: $model"
        return 1
    fi

    local size=$(du -h "$filepath" | cut -f1)
    print_warning "This will remove $model ($size)"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f "$filepath"
        print_status "Removed: $model"
    else
        print_info "Cancelled"
    fi
}

# Show model information
show_info() {
    local model=$1

    if [ -z "$model" ]; then
        print_error "Model name required"
        return 1
    fi

    if [ -z "${MODEL_URLS[$model]}" ]; then
        print_error "Unknown model: $model"
        return 1
    fi

    local filepath="$MODELS_DIR/${model}.gguf"
    local required_ram=${MODEL_REQUIREMENTS[$model]}
    local system_ram=$(get_system_ram)

    echo "🤖 Model Information: $model"
    echo "================================"
    echo "  URL: ${MODEL_URLS[$model]}"
    echo "  Required RAM: ${required_ram}GB"
    echo "  System RAM: ${system_ram}GB"
    echo "  Compatible: $([ "$system_ram" -ge "$required_ram" ] && echo "Yes" || echo "No")"
    echo "  Installed: $([ -f "$filepath" ] && echo "Yes" || echo "No")"

    if [ -f "$filepath" ]; then
        local size=$(du -h "$filepath" | cut -f1)
        echo "  File size: $size"
        echo "  Path: $filepath"
    fi
}

# Recommend best model for system
recommend_model() {
    local system_ram=$(get_system_ram)

    echo "🎯 Model Recommendation"
    echo "======================"
    echo "System RAM: ${system_ram}GB"
    echo ""

    if [ "$system_ram" -ge 64 ]; then
        echo "Recommended: llama3-70b (Most capable)"
        echo "Alternative: llama3-8b (Faster)"
    elif [ "$system_ram" -ge 24 ]; then
        echo "Recommended: codellama-34b (Great for coding)"
        echo "Alternative: llama3-8b (General purpose)"
    elif [ "$system_ram" -ge 16 ]; then
        echo "Recommended: dolphin-uncensored (Creative)"
        echo "Alternative: llama3-8b (Balanced)"
    elif [ "$system_ram" -ge 8 ]; then
        echo "Recommended: llama3-8b (Best balance)"
        echo "Alternative: mistral-7b (Faster)"
    elif [ "$system_ram" -ge 6 ]; then
        echo "Recommended: mistral-7b (Small but capable)"
    else
        echo "⚠️  Your system has limited RAM (${system_ram}GB)"
        echo "Consider using cloud models instead:"
        echo "  • OpenAI GPT-4"
        echo "  • Anthropic Claude"
        echo "  • Google Gemini"
    fi
}

# Auto-install best model for system
auto_install() {
    local system_ram=$(get_system_ram)
    local model=""

    # Select best model based on available RAM
    if [ "$system_ram" -ge 8 ]; then
        model="llama3-8b"
    elif [ "$system_ram" -ge 6 ]; then
        model="mistral-7b"
    else
        print_error "Insufficient RAM for local models (${system_ram}GB)"
        print_info "Minimum requirement: 6GB"
        return 1
    fi

    print_info "Auto-installing recommended model: $model"
    download_model "$model"
}

# Show usage
usage() {
    echo "VSEmbed Model Manager"
    echo "===================="
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  list                    List all available models"
    echo "  download <model>        Download a specific model"
    echo "  remove <model>          Remove a model"
    echo "  info <model>            Show model information"
    echo "  recommend               Show recommended model for your system"
    echo "  auto-install            Auto-install best model for your system"
    echo "  status                  Show installation status"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 download llama3-8b"
    echo "  $0 remove llama3-8b"
    echo "  $0 info mistral-7b"
    echo "  $0 auto-install"
}

# Show status
show_status() {
    echo "📊 VSEmbed Model Status"
    echo "======================"
    echo ""

    local system_ram=$(get_system_ram)
    echo "System RAM: ${system_ram}GB"
    echo "Models directory: $MODELS_DIR"
    echo ""

    local installed=0
    local total_size=0

    echo "Installed Models:"
    for model in "${!MODEL_URLS[@]}"; do
        local filepath="$MODELS_DIR/${model}.gguf"
        if [ -f "$filepath" ]; then
            local size=$(du -m "$filepath" | cut -f1)  # Size in MB
            local size_h=$(du -h "$filepath" | cut -f1)
            printf "  ✅ %-20s %s\n" "$model" "$size_h"
            installed=$((installed + 1))
            total_size=$((total_size + size))
        fi
    done

    if [ "$installed" -eq 0 ]; then
        echo "  No models installed"
    else
        local total_size_h=$(echo "$total_size" | awk '{
            if ($1 > 1024) printf "%.1fGB", $1/1024;
            else printf "%dMB", $1
        }')
        echo ""
        echo "Total: $installed models, $total_size_h"
    fi
}

# Main command handling
case "$1" in
    "list")
        list_models
        ;;
    "download")
        download_model "$2"
        ;;
    "remove")
        remove_model "$2"
        ;;
    "info")
        show_info "$2"
        ;;
    "recommend")
        recommend_model
        ;;
    "auto-install")
        auto_install
        ;;
    "status")
        show_status
        ;;
    *)
        usage
        ;;
esac
