import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

interface BrainstormIdea {
	id: string;
	title: string;
	description: string;
	category: 'feature' | 'improvement' | 'architecture' | 'ui' | 'performance';
	confidence: number;
	mockup?: string;
	implementation?: string;
	selected?: boolean;
}

interface BrainstormSession {
	id: string;
	topic: string;
	ideas: BrainstormIdea[];
	timestamp: Date;
}

interface BrainstormPanelProps {
	onIdeaSelected: (idea: BrainstormIdea) => void;
	onNewBrainstorm: (topic: string) => void;
	currentSession?: BrainstormSession;
}

export const BrainstormPanel: React.FC<BrainstormPanelProps> = ({
	onIdeaSelected,
	onNewBrainstorm,
	currentSession
}) => {
	const [topic, setTopic] = useState('');
	const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [mindMapData, setMindMapData] = useState<any>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (currentSession) {
			setIdeas(currentSession.ideas);
			setTopic(currentSession.topic);
			generateMindMap(currentSession.ideas);
		}
	}, [currentSession]);

	const handleBrainstorm = async () => {
		if (!topic.trim()) return;

		setIsGenerating(true);
		try {
			// Trigger brainstorming through the parent component
			onNewBrainstorm(topic);
		} finally {
			setIsGenerating(false);
		}
	};

	const generateMindMap = (ideas: BrainstormIdea[]) => {
		// Create mind map data structure
		const mindMap = {
			central: topic,
			branches: ideas.map(idea => ({
				id: idea.id,
				text: idea.title,
				category: idea.category,
				confidence: idea.confidence,
				children: idea.description.split('.').slice(0, 3).map((desc, i) => ({
					id: `${idea.id}-${i}`,
					text: desc.trim()
				}))
			}))
		};

		setMindMapData(mindMap);
		drawMindMap(mindMap);
	};

	const drawMindMap = (data: any) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Set up drawing parameters
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const centralRadius = 60;
		const branchRadius = 40;
		const branchDistance = 120;

		// Draw central node
		ctx.fillStyle = '#2196f3';
		ctx.beginPath();
		ctx.arc(centerX, centerY, centralRadius, 0, 2 * Math.PI);
		ctx.fill();

		// Draw central text
		ctx.fillStyle = 'white';
		ctx.font = 'bold 14px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const centralText = data.central.length > 20 ? data.central.substring(0, 20) + '...' : data.central;
		ctx.fillText(centralText, centerX, centerY);

		// Draw branches
		data.branches.forEach((branch: any, index: number) => {
			const angle = (2 * Math.PI * index) / data.branches.length;
			const branchX = centerX + Math.cos(angle) * branchDistance;
			const branchY = centerY + Math.sin(angle) * branchDistance;

			// Draw connection line
			ctx.strokeStyle = '#666';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(centerX + Math.cos(angle) * centralRadius, centerY + Math.sin(angle) * centralRadius);
			ctx.lineTo(branchX - Math.cos(angle) * branchRadius, branchY - Math.sin(angle) * branchRadius);
			ctx.stroke();

			// Draw branch node
			const categoryColors: Record<string, string> = {
				feature: '#4caf50',
				improvement: '#ff9800',
				architecture: '#9c27b0',
				ui: '#e91e63',
				performance: '#f44336'
			};

			ctx.fillStyle = categoryColors[branch.category] || '#666';
			ctx.beginPath();
			ctx.arc(branchX, branchY, branchRadius, 0, 2 * Math.PI);
			ctx.fill();

			// Draw branch text
			ctx.fillStyle = 'white';
			ctx.font = '12px Arial';
			const branchText = branch.text.length > 15 ? branch.text.substring(0, 15) + '...' : branch.text;
			ctx.fillText(branchText, branchX, branchY);

			// Draw confidence indicator
			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.font = '10px Arial';
			ctx.fillText(`${Math.round(branch.confidence * 100)}%`, branchX, branchY + 20);
		});
	};

	const handleIdeaClick = (idea: BrainstormIdea) => {
		setIdeas(ideas.map(i =>
			i.id === idea.id ? { ...i, selected: !i.selected } : i
		));
		onIdeaSelected({ ...idea, selected: !idea.selected });
	};

	const filteredIdeas = selectedCategory === 'all'
		? ideas
		: ideas.filter(idea => idea.category === selectedCategory);

	const getCategoryIcon = (category: string) => {
		const icons: Record<string, string> = {
			feature: '⭐',
			improvement: '🔧',
			architecture: '🏗️',
			ui: '🎨',
			performance: '⚡'
		};
		return icons[category] || '💡';
	};

	return (
		<div className="brainstorm-panel">
			<div className="brainstorm-header">
				<h3>💡 AI Brainstorming</h3>
				<div className="brainstorm-input">
					<input
						type="text"
						placeholder="What would you like to brainstorm? (e.g., 'user authentication system')"
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleBrainstorm()}
						disabled={isGenerating}
					/>
					<button
						onClick={handleBrainstorm}
						disabled={isGenerating || !topic.trim()}
						className="brainstorm-btn"
					>
						{isGenerating ? '🤔 Thinking...' : '🚀 Brainstorm'}
					</button>
				</div>
			</div>

			{mindMapData && (
				<div className="mind-map-section">
					<h4>Mind Map</h4>
					<canvas
						ref={canvasRef}
						width={600}
						height={400}
						className="mind-map-canvas"
					/>
				</div>
			)}

			<div className="ideas-section">
				<div className="ideas-header">
					<h4>Ideas ({ideas.length})</h4>
					<div className="category-filter">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
						>
							<option value="all">All Categories</option>
							<option value="feature">Features</option>
							<option value="improvement">Improvements</option>
							<option value="architecture">Architecture</option>
							<option value="ui">UI/UX</option>
							<option value="performance">Performance</option>
						</select>
					</div>
				</div>

				<div className="ideas-grid">
					{filteredIdeas.map(idea => (
						<div
							key={idea.id}
							className={`idea-card ${idea.selected ? 'selected' : ''}`}
							onClick={() => handleIdeaClick(idea)}
						>
							<div className="idea-header">
								<span className="idea-icon">{getCategoryIcon(idea.category)}</span>
								<span className="idea-category">{idea.category}</span>
								<span className="idea-confidence">{Math.round(idea.confidence * 100)}%</span>
							</div>
							<h5 className="idea-title">{idea.title}</h5>
							<p className="idea-description">{idea.description}</p>

							{idea.mockup && (
								<div className="idea-mockup">
									<img src={idea.mockup} alt="Mockup" />
								</div>
							)}

							{idea.implementation && (
								<div className="idea-implementation">
									<details>
										<summary>Implementation Notes</summary>
										<p>{idea.implementation}</p>
									</details>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<style jsx>{`
				.brainstorm-panel {
					height: 100%;
					display: flex;
					flex-direction: column;
					padding: 16px;
					background: var(--vscode-editor-background);
					color: var(--vscode-editor-foreground);
				}

				.brainstorm-header h3 {
					margin: 0 0 12px 0;
					font-size: 16px;
				}

				.brainstorm-input {
					display: flex;
					gap: 8px;
					margin-bottom: 16px;
				}

				.brainstorm-input input {
					flex: 1;
					padding: 8px;
					background: var(--vscode-input-background);
					border: 1px solid var(--vscode-input-border);
					color: var(--vscode-input-foreground);
					border-radius: 4px;
				}

				.brainstorm-btn {
					padding: 8px 16px;
					background: var(--vscode-button-background);
					color: var(--vscode-button-foreground);
					border: none;
					border-radius: 4px;
					cursor: pointer;
					white-space: nowrap;
				}

				.brainstorm-btn:hover {
					background: var(--vscode-button-hoverBackground);
				}

				.brainstorm-btn:disabled {
					opacity: 0.6;
					cursor: not-allowed;
				}

				.mind-map-section {
					margin: 16px 0;
					padding: 16px;
					background: var(--vscode-input-background);
					border-radius: 4px;
				}

				.mind-map-section h4 {
					margin: 0 0 12px 0;
				}

				.mind-map-canvas {
					width: 100%;
					height: 300px;
					border: 1px solid var(--vscode-panel-border);
					border-radius: 4px;
				}

				.ideas-section {
					flex: 1;
					overflow: hidden;
					display: flex;
					flex-direction: column;
				}

				.ideas-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 12px;
				}

				.ideas-header h4 {
					margin: 0;
				}

				.category-filter select {
					padding: 4px 8px;
					background: var(--vscode-input-background);
					border: 1px solid var(--vscode-input-border);
					color: var(--vscode-input-foreground);
					border-radius: 4px;
				}

				.ideas-grid {
					flex: 1;
					overflow-y: auto;
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
					gap: 12px;
				}

				.idea-card {
					padding: 12px;
					background: var(--vscode-input-background);
					border: 1px solid var(--vscode-panel-border);
					border-radius: 4px;
					cursor: pointer;
					transition: all 0.2s ease;
				}

				.idea-card:hover {
					border-color: var(--vscode-focusBorder);
					transform: translateY(-1px);
				}

				.idea-card.selected {
					border-color: var(--vscode-button-background);
					background: var(--vscode-list-activeSelectionBackground);
				}

				.idea-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 8px;
				}

				.idea-icon {
					font-size: 16px;
				}

				.idea-category {
					font-size: 12px;
					text-transform: uppercase;
					opacity: 0.8;
				}

				.idea-confidence {
					font-size: 12px;
					font-weight: bold;
					color: var(--vscode-charts-green);
				}

				.idea-title {
					margin: 0 0 8px 0;
					font-size: 14px;
					font-weight: bold;
				}

				.idea-description {
					margin: 0 0 8px 0;
					font-size: 12px;
					line-height: 1.4;
					opacity: 0.9;
				}

				.idea-mockup img {
					width: 100%;
					max-height: 120px;
					object-fit: cover;
					border-radius: 4px;
					margin-bottom: 8px;
				}

				.idea-implementation {
					margin-top: 8px;
				}

				.idea-implementation details summary {
					font-size: 12px;
					cursor: pointer;
					opacity: 0.8;
				}

				.idea-implementation details p {
					margin: 4px 0 0 0;
					font-size: 11px;
					background: var(--vscode-textCodeBlock-background);
					padding: 8px;
					border-radius: 4px;
				}
			`}</style>
		</div>
	);
};
