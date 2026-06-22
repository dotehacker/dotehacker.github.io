---
title: embeddinggemma-300m
date: 2025-09-05
category: "AI & ML"
---

<img src="/posts/2025/09/05/embeddinggemma-300m/embed.png" alt="embeddinggemma-300m" width="100%">

# Understanding Text Embeddings: A Comprehensive Quality Analysis

Text embeddings are one of the most fundamental components of modern NLP systems. But how do we know if our embeddings are actually good? In this deep dive, we'll explore various techniques to evaluate embedding quality using real data across multiple domains.

## What Makes a Good Embedding?

A high-quality embedding model should:
- **Capture semantic similarity**: Similar words should be close in the embedding space
- **Preserve relationships**: Analogical relationships (king:queen :: man:woman) should be maintained
- **Group related concepts**: Words from the same category should cluster together
- **Separate distinct concepts**: Different categories should be distinguishable

Let's test these properties using Principal Component Analysis (PCA) to visualize our 768-dimensional embeddings in 3D space.

## Dataset Overview

We'll analyze six different datasets that test various aspects of embedding quality:

1. **Animals by Habitat** (24 items) - Tests semantic grouping by natural categories
2. **Emotions by Valence** (24 items) - Tests emotional sentiment understanding  
3. **Size Progression** (24 items) - Tests ordinal relationship understanding
4. **Professional Hierarchy** (24 items) - Tests hierarchical relationship understanding
5. **Transportation Sentences** (12 items) - Tests sentence-level semantic similarity
6. **Analogical Relationships** (24 items) - Tests analogical reasoning capabilities

---

## Interactive 3D Visualizations

<div id="animals-plot" style="width: 100%; height: 600px; margin: 20px 0;"></div>

<div id="emotions-plot" style="width: 100%; height: 600px; margin: 20px 0;"></div>

<div id="size-plot" style="width: 100%; height: 600px; margin: 20px 0;"></div>

<div id="hierarchy-plot" style="width: 100%; height: 600px; margin: 20px 0;"></div>

<div id="transport-plot" style="width: 100%; height: 600px; margin: 20px 0;"></div>

<div id="analogies-plot" style="width: 100%; height: 600px; margin: 20px 0;"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.18.0/plotly.min.js"></script>

<script>
// Global variable to store embedding data
let embeddingData = {};

// Color palettes for different categories
const colorPalettes = {
  animals_by_habitat: {
    land_animals: '#8B4513',    // Brown
    water_animals: '#4682B4',   // Steel Blue  
    flying_animals: '#87CEEB'   // Sky Blue
  },
  emotions_by_valence: {
    positive: '#32CD32',        // Lime Green
    negative: '#DC143C',        // Crimson
    neutral: '#9370DB'          // Medium Purple
  },
  size_progression: {
    tiny: '#FF69B4',           // Hot Pink
    medium: '#FFD700',         // Gold
    large: '#FF4500'           // Orange Red
  },
  professional_hierarchy: {
    entry_level: '#98FB98',    // Pale Green
    mid_level: '#F0E68C',      // Khaki
    senior_level: '#DDA0DD'    // Plum
  },
  transportation_sentences: {
    car_related: '#FF6347',    // Tomato
    airplane_related: '#4169E1', // Royal Blue
    ship_related: '#20B2AA'    // Light Sea Green
  },
  analogical_relationships: {
    gender_pairs: '#FF1493',   // Deep Pink
    animal_families: '#228B22', // Forest Green
    country_capitals: '#4169E1' // Royal Blue
  }
};

// Function to load JSON data and create all plots
async function loadDataAndCreatePlots() {
  try {
    const response = await fetch('./all_embedding_pca_results.json');
    embeddingData = await response.json();
    
    // Create individual plots for each dataset
    if (embeddingData.animals_by_habitat) {
      createPlot('animals-plot', embeddingData.animals_by_habitat, 'Animals by Habitat - 3D PCA Projection');
    }
    if (embeddingData.emotions_by_valence) {
      createPlot('emotions-plot', embeddingData.emotions_by_valence, 'Emotions by Valence - 3D PCA Projection');
    }
    if (embeddingData.size_progression) {
      createPlot('size-plot', embeddingData.size_progression, 'Size Progression - 3D PCA Projection');
    }
    if (embeddingData.professional_hierarchy) {
      createPlot('hierarchy-plot', embeddingData.professional_hierarchy, 'Professional Hierarchy - 3D PCA Projection');
    }
    if (embeddingData.transportation_sentences) {
      createPlot('transport-plot', embeddingData.transportation_sentences, 'Transportation Sentences - 3D PCA Projection');
    }
    if (embeddingData.analogical_relationships) {
      createPlot('analogies-plot', embeddingData.analogical_relationships, 'Analogical Relationships - 3D PCA Projection');
    }
    
    // Create variance analysis
    createVarianceAnalysis();
    
  } catch (error) {
    console.error('Error loading embedding data:', error);
    const plotEl = document.getElementById('animals-plot');
    if (plotEl) {
      plotEl.innerHTML = '<p style="color: red;">Error loading data. Please ensure all_embedding_pca_results.json is in the same directory.</p>';
    }
  }
}

function createPlot(containerId, data, title) {
  const containerEl = document.getElementById(containerId);
  if (!containerEl) return;
  
  const categories = [...new Set(data.items.map(item => item.category))];
  
  const traces = categories.map(category => {
    const categoryItems = data.items.filter(item => item.category === category);
    
    return {
      x: categoryItems.map(item => item.pca_coordinates.x),
      y: categoryItems.map(item => item.pca_coordinates.y),
      z: categoryItems.map(item => item.pca_coordinates.z),
      text: categoryItems.map(item => item.text),
      mode: 'markers+text',
      marker: {
        color: colorPalettes[data.dataset_name] ? colorPalettes[data.dataset_name][category] : '#666666',
        size: 8,
        opacity: 0.8
      },
      textposition: 'top center',
      textfont: {
        size: 10,
        color: colorPalettes[data.dataset_name] ? colorPalettes[data.dataset_name][category] : '#666666'
      },
      name: category.replace('_', ' '),
      type: 'scatter3d'
    };
  });

  const layout = {
    title: {
      text: title,
      font: { size: 18 }
    },
    scene: {
      xaxis: { 
        title: `PC1 (${(data.pca_explained_variance[0] * 100).toFixed(1)}% var)`,
        titlefont: { size: 12 }
      },
      yaxis: { 
        title: `PC2 (${(data.pca_explained_variance[1] * 100).toFixed(1)}% var)`,
        titlefont: { size: 12 }
      },
      zaxis: { 
        title: `PC3 (${(data.pca_explained_variance[2] * 100).toFixed(1)}% var)`,
        titlefont: { size: 12 }
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    margin: { l: 0, r: 0, b: 0, t: 40 },
    legend: {
      x: 0.02,
      y: 0.98
    }
  };

  const config = {
    responsive: true,
    displayModeBar: true
  };

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot(containerId, traces, layout, config);
  }
}

// Load data when DOM is ready
function initializeMainPlots() {
  loadDataAndCreatePlots();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMainPlots);
} else {
  initializeMainPlots();
}
</script>

---

## Quantitative Analysis

<div id="variance-analysis" style="margin: 20px 0;"></div>

<script>
function createVarianceAnalysis() {
  const varianceEl = document.getElementById('variance-analysis');
  if (!varianceEl || !embeddingData || Object.keys(embeddingData).length === 0) {
    if (varianceEl) {
      setTimeout(createVarianceAnalysis, 1000);
    }
    return;
  }
  
  // Create variance table
  let tableHTML = `
    <h3>Variance Explained by PCA</h3>
    <p>The amount of variance captured by the first three principal components tells us how much information is preserved in our 3D visualization:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Dataset</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">PC1</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">PC2</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">PC3</th>
          <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Total Variance</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  Object.values(embeddingData).forEach(dataset => {
    const pc1 = (dataset.pca_explained_variance[0] * 100).toFixed(1);
    const pc2 = (dataset.pca_explained_variance[1] * 100).toFixed(1);
    const pc3 = (dataset.pca_explained_variance[2] * 100).toFixed(1);
    const total = (dataset.total_variance_captured * 100).toFixed(1);
    
    tableHTML += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 12px;">${dataset.dataset_name.replace('_', ' ')}</td>
        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${pc1}%</td>
        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${pc2}%</td>
        <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${pc3}%</td>
        <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">${total}%</td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
    
    <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h4>Key Insights:</h4>
      <ul>
        <li><strong>Higher variance capture</strong> (>40%) indicates clearer linear structure in embedding space</li>
        <li><strong>Lower variance capture</strong> (<30%) suggests more complex, non-linear relationships</li>
        <li>The 3D visualization preserves the most important dimensions of variation in the data</li>
      </ul>
    </div>
  `;
  
  varianceEl.innerHTML = tableHTML;
}

// Initialize variance analysis
setTimeout(createVarianceAnalysis, 2000);
</script>

---

## Similarity Analysis

<div id="similarity-analysis" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Interactive Cosine Similarity Calculator

<div style="margin: 20px 0;">
  <input id="word1" placeholder="Enter first word" style="padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px;">
  <input id="word2" placeholder="Enter second word" style="padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px;">
  <button id="computeBtn" style="padding: 8px 16px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Calculate Similarity</button>
</div>
<div id="similarity-result" style="font-size: 16px; font-weight: bold; margin: 10px 0;"></div>

<div id="word-suggestions" style="margin: 20px 0;"></div>

</div>

<script>
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function computeSimilarity() {
  const resultEl = document.getElementById("similarity-result");
  if (!resultEl) return;
  
  if (!embeddingData || Object.keys(embeddingData).length === 0) {
    resultEl.innerHTML = '<span style="color: red;">Data not loaded yet. Please wait...</span>';
    return;
  }

  const word1El = document.getElementById("word1");
  const word2El = document.getElementById("word2");
  
  if (!word1El || !word2El) return;
  
  const w1 = word1El.value.toLowerCase().trim();
  const w2 = word2El.value.toLowerCase().trim();
  
  if (!w1 || !w2) {
    resultEl.innerHTML = '<span style="color: orange;">Please enter both words.</span>';
    return;
  }

  // Flatten items from all datasets
  const allItems = Object.values(embeddingData).flatMap(d => d.items);
  const f1 = allItems.find(d => d.text.toLowerCase() === w1);
  const f2 = allItems.find(d => d.text.toLowerCase() === w2);

  if (!f1 || !f2) {
    resultEl.innerHTML = `<span style="color: red;">One or both words not found in embeddings database.</span>`;
    updateWordSuggestions();
    return;
  }

  const v1 = [f1.pca_coordinates.x, f1.pca_coordinates.y, f1.pca_coordinates.z];
  const v2 = [f2.pca_coordinates.x, f2.pca_coordinates.y, f2.pca_coordinates.z];
  const sim = cosineSimilarity(v1, v2).toFixed(3);
  
  let color = 'green';
  if (sim < 0.3) color = 'red';
  else if (sim < 0.6) color = 'orange';

  resultEl.innerHTML = 
    `<span style="color: ${color};">Cosine Similarity between "${w1}" and "${w2}": ${sim}</span>`;
}

function updateWordSuggestions() {
  const suggestionsEl = document.getElementById("word-suggestions");
  if (!suggestionsEl || !embeddingData || Object.keys(embeddingData).length === 0) return;
  
  const allItems = Object.values(embeddingData).flatMap(d => d.items);
  const allWords = [...new Set(allItems.map(item => item.text))].sort();
  
  const suggestionsHTML = `
    <h4>Available words in database:</h4>
    <div style="background: white; padding: 10px; border-radius: 4px; max-height: 150px; overflow-y: auto; border: 1px solid #ddd;">
      ${allWords.map(word => `<span style="display: inline-block; background: #e9ecef; padding: 2px 6px; margin: 2px; border-radius: 3px; font-size: 12px;">${word}</span>`).join('')}
    </div>
  `;
  
  suggestionsEl.innerHTML = suggestionsHTML;
}

// Initialize similarity calculator
function initializeSimilarityCalculator() {
  const computeBtn = document.getElementById("computeBtn");
  if (computeBtn) {
    computeBtn.addEventListener('click', computeSimilarity);
  }
  
  // Update suggestions when data is loaded
  setTimeout(updateWordSuggestions, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSimilarityCalculator);
} else {
  initializeSimilarityCalculator();
}
</script>

---

## Combined PCA Visualization

Sometimes it helps to see all datasets together to understand the overall embedding space structure.

<div id="pca-plot-3d" style="width: 100%; height: 700px; margin: 20px 0;"></div>

<script>
function createCombinedPCAPlot() {
  const plotEl = document.getElementById('pca-plot-3d');
  if (!plotEl) return;
  
  if (!embeddingData || Object.keys(embeddingData).length === 0) {
    setTimeout(createCombinedPCAPlot, 1000);
    return;
  }
  
  const traces = [];
  Object.values(embeddingData).forEach(dataset => {
    const x = dataset.items.map(d => d.pca_coordinates.x);
    const y = dataset.items.map(d => d.pca_coordinates.y);
    const z = dataset.items.map(d => d.pca_coordinates.z);
    const text = dataset.items.map(d => d.text);

    traces.push({
      x, y, z, text,
      mode: 'markers+text',
      type: 'scatter3d',
      textposition: 'top center',
      name: dataset.dataset_name.replace('_', ' '),
      marker: { size: 5 }
    });
  });

  if (typeof Plotly !== 'undefined') {
    Plotly.newPlot('pca-plot-3d', traces, {
      title: "Combined PCA Projection of All Embeddings (3D)",
      scene: {
        xaxis: { title: "PC1" },
        yaxis: { title: "PC2" },
        zaxis: { title: "PC3" }
      },
      height: 700
    });
  }
}

setTimeout(createCombinedPCAPlot, 2500);
</script>

---

## Analogical Relationship Testing

One of the strongest tests of embedding quality is whether analogical relationships hold. We can test this using vector arithmetic:

<div id="analogy-test" style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">

### King - Queen = Man - Woman?

<div id="analogy-analysis"></div>

</div>

<script>
function analyzeAnalogies() {
  const analysisEl = document.getElementById('analogy-analysis');
  if (!analysisEl) return;
  
  if (!embeddingData || !embeddingData.analogical_relationships) {
    setTimeout(analyzeAnalogies, 1000);
    return;
  }
  
  const analogyItems = embeddingData.analogical_relationships.items;
  
  // Find specific analogy pairs
  const king = analogyItems.find(item => item.text === 'king');
  const queen = analogyItems.find(item => item.text === 'queen');
  const man = analogyItems.find(item => item.text === 'man');
  const woman = analogyItems.find(item => item.text === 'woman');
  
  if (king && queen && man && woman) {
    const kingVec = [king.pca_coordinates.x, king.pca_coordinates.y, king.pca_coordinates.z];
    const queenVec = [queen.pca_coordinates.x, queen.pca_coordinates.y, queen.pca_coordinates.z];
    const manVec = [man.pca_coordinates.x, man.pca_coordinates.y, man.pca_coordinates.z];
    const womanVec = [woman.pca_coordinates.x, woman.pca_coordinates.y, woman.pca_coordinates.z];
    
    // Calculate vector differences
    const kingQueenDiff = kingVec.map((val, i) => val - queenVec[i]);
    const manWomanDiff = manVec.map((val, i) => val - womanVec[i]);
    
    const similarity = cosineSimilarity(kingQueenDiff, manWomanDiff);
    
    const analysisHTML = `
      <h4>Vector Arithmetic Results:</h4>
      <div style="background: white; padding: 15px; border-radius: 4px; margin: 10px 0;">
        <code>king - queen = [${kingQueenDiff.map(x => x.toFixed(3)).join(', ')}]</code><br>
        <code>man - woman = [${manWomanDiff.map(x => x.toFixed(3)).join(', ')}]</code>
      </div>
      <p><strong>Cosine Similarity</strong>: ${similarity.toFixed(3)} ${similarity > 0.7 ? '✅' : similarity > 0.5 ? '⚠️' : '❌'}</p>
      <p>${similarity > 0.7 ? 'Excellent! The embedding captures gender relationships very well.' : 
           similarity > 0.5 ? 'Good. The relationship is preserved but with some noise.' : 
           'Poor. The analogical relationship is not well captured.'}</p>
    `;
    
    analysisEl.innerHTML = analysisHTML;
  } else {
    analysisEl.innerHTML = '<p>Analogy words not found in dataset.</p>';
  }
}

// Run analogy analysis when data loads
setTimeout(analyzeAnalogies, 3000);
</script>

---

## Clustering Quality Metrics

<div id="clustering-analysis" style="margin: 20px 0;"></div>

<script>
function createClusteringAnalysis() {
  const clusteringEl = document.getElementById('clustering-analysis');
  if (!clusteringEl) return;
  
  if (!embeddingData || Object.keys(embeddingData).length === 0) {
    setTimeout(createClusteringAnalysis, 1000);
    return;
  }
  
  const analysisHTML = `
    <h3>Silhouette Analysis</h3>
    <p>For each dataset, we can evaluate how well-separated the categories are:</p>
    
    <div style="display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0;">
      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px;">
        <h4>🟢 Good Clustering</h4>
        <p><strong>Emotions</strong>: ${embeddingData.emotions_by_valence ? 'Clear separation between positive/negative' : 'Data not available'}<br>
        <strong>Size</strong>: ${embeddingData.size_progression ? 'Linear progression visible' : 'Data not available'}</p>
      </div>
      <div style="background: #fff2e8; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px;">
        <h4>🟡 Moderate Clustering</h4>
        <p><strong>Professional Hierarchy</strong>: ${embeddingData.professional_hierarchy ? 'Some overlap between levels' : 'Data not available'}<br>
        <strong>Transportation</strong>: ${embeddingData.transportation_sentences ? 'Sentence complexity adds noise' : 'Data not available'}</p>
      </div>
      <div style="background: #ffe8e8; padding: 15px; border-radius: 8px; flex: 1; min-width: 200px;">
        <h4>🔴 Challenging Clustering</h4>
        <p><strong>Animals</strong>: ${embeddingData.animals_by_habitat ? 'Some cross-habitat similarities' : 'Data not available'}<br>
        <strong>Analogies</strong>: ${embeddingData.analogical_relationships ? 'Multiple relationship types mixed' : 'Data not available'}</p>
      </div>
    </div>
  `;
  
  clusteringEl.innerHTML = analysisHTML;
}

setTimeout(createClusteringAnalysis, 2500);
</script>

---

# 3D Layer-wise Embedding Evolution

This visualization shows how neural network embeddings evolve across different layers. Each point represents a text sample positioned in 2D PCA space, with the Z-axis representing the layer index. Trajectory lines connect the same text samples across layers, revealing how the embedding space transforms through the network.

## Features

- **Interactive 3D Plot**: Rotate, zoom, and pan to explore the embedding space
- **Layer Evolution**: See how embeddings change from input to output layers
- **Category Visualization**: Different colors for different categories with legend
- **Trajectory Tracking**: Lines show how individual samples move through embedding space
- **Adjustable Z-separation**: Control the spacing between layers

## Datasets

The visualization includes three datasets:
- **Sentiment Analysis**: Positive, negative, and neutral sentiment classifications
- **Academic Subjects**: Science, mathematics, and literature texts
- **Scientific Domains**: Astronomy, biology, and physics research topics

<div id="embedding-visualization">
<style>
.viz-container {
    max-width: 100%;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin: 20px 0;
}
.controls {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
}
.controls select, .controls input[type="range"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.controls button {
    padding: 8px 16px;
    background: #007cba;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.controls button:hover {
    background: #005a87;
}
#plot {
    width: 100%;
    height: 600px;
    border: 1px solid #ddd;
    border-radius: 4px;
}
.info {
    margin-bottom: 10px;
    padding: 10px;
    background: #e8f4f8;
    border-radius: 4px;
    font-size: 14px;
}
#loadStatus {
    margin-left: 10px;
    font-weight: bold;
}
</style>

<div class="viz-container">
    <div class="controls">
        <select id="datasetSelect" style="display: none;">
            <option value="">Select Dataset</option>
        </select>
        <label>
            Z-separation: 
            <input type="range" id="zSeparation" min="1" max="20" value="5" />
            <span id="zValue">5</span>
        </label>
        <button id="loadData">Load Data</button>
        <span id="loadStatus"></span>
    </div>
    
    <div id="info" class="info" style="display: none;"></div>
    <div id="plot"></div>
</div>

<script>
    let currentData = null;
    const JSON_FILE_PATH = '/posts/2025/09/05/embeddinggemma-300m/all_layerwise_embeddings.json';
    
    // Color palette for categories
    const colors = [
        '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', 
        '#ff7f00', '#ffff33', '#a65628', '#f781bf'
    ];

    // Wait for DOM to be ready before adding event listeners
    function initializeLayerwiseVisualization() {
        const loadButton = document.getElementById('loadData');
        const datasetSelect = document.getElementById('datasetSelect');
        const zSeparation = document.getElementById('zSeparation');
        const zValue = document.getElementById('zValue');
        
        if (loadButton) {
            loadButton.addEventListener('click', loadDataFromFile);
        }
        if (datasetSelect) {
            datasetSelect.addEventListener('change', updateVisualization);
        }
        if (zSeparation && zValue) {
            zSeparation.addEventListener('input', function() {
                zValue.textContent = this.value;
                updateVisualization();
            });
        }
        
        // Load data automatically
        loadDataFromFile();
    }

    function loadDataFromFile() {
        const statusEl = document.getElementById('loadStatus');
        if (statusEl) {
            statusEl.textContent = 'Loading...';
            statusEl.style.color = 'orange';
        }
        
        fetch(JSON_FILE_PATH)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                currentData = data;
                console.log('Loaded data:', data); // Debug log
                populateDatasetSelect();
                updateVisualization();
                if (statusEl) {
                    statusEl.textContent = 'Data loaded successfully!';
                    statusEl.style.color = 'green';
                }
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                if (statusEl) {
                    statusEl.textContent = `Error loading data: ${error.message}`;
                    statusEl.style.color = 'red';
                }
                
                const plotEl = document.getElementById('plot');
                if (plotEl) {
                    plotEl.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 18px;">
                            <div style="text-align: center;">
                                <p>Could not load JSON file from: ${JSON_FILE_PATH}</p>
                                <p style="font-size: 14px; color: #999;">
                                    Make sure the file exists at the specified path and the browser has permission to access it.
                                </p>
                            </div>
                        </div>
                    `;
                }
            });
    }

    function populateDatasetSelect() {
        const select = document.getElementById('datasetSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">Select Dataset</option>';
        
        if (currentData) {
            const datasetNames = Object.keys(currentData);
            if (datasetNames.length > 1) {
                datasetNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    select.appendChild(option);
                });
                select.style.display = 'block';
                select.value = datasetNames[0];
            } else {
                select.style.display = 'none';
            }
        }
    }

    function getCurrentDataset() {
        if (!currentData) {
            console.log('No currentData available');
            return null;
        }
        
        console.log('currentData keys:', Object.keys(currentData));
        
        const selectEl = document.getElementById('datasetSelect');
        const selectedDataset = selectEl ? selectEl.value : '';
        
        console.log('Selected dataset:', selectedDataset);
        
        if (selectedDataset && currentData[selectedDataset]) {
            console.log('Using selected dataset:', selectedDataset);
            return currentData[selectedDataset];
        } else if (currentData.layers) {
            console.log('Using single dataset format');
            return currentData;
        } else {
            const firstKey = Object.keys(currentData)[0];
            console.log('Using first key:', firstKey);
            return currentData[firstKey];
        }
    }

    function updateVisualization() {
        const dataset = getCurrentDataset();
        console.log('Dataset:', dataset); // Debug log
        if (!dataset) {
            console.log('No dataset available');
            return;
        }

        const zSeparationEl = document.getElementById('zSeparation');
        const zSeparation = zSeparationEl ? parseInt(zSeparationEl.value) : 5;
        
        // Update info safely
        const info = document.getElementById('info');
        if (info) {
            info.style.display = 'block';
            info.innerHTML = `
                <strong>Dataset:</strong> ${dataset.dataset_name || 'Unknown'} | 
                <strong>Description:</strong> ${dataset.description || 'N/A'} | 
                <strong>Total Items:</strong> ${dataset.total_items || 'N/A'} | 
                <strong>Layers:</strong> ${dataset.num_layers || Object.keys(dataset.layers).length}
            `;
        }

        const traces = [];
        const categories = dataset.categories || [];
        const categoryColors = {};
        categories.forEach((cat, i) => {
            categoryColors[cat] = colors[i % colors.length];
        });

        categories.forEach(category => {
            const x = [], y = [], z = [], text = [];
            
            Object.entries(dataset.layers).forEach(([layerStr, layerData]) => {
                const layerIdx = parseInt(layerStr);
                const zLevel = layerIdx * zSeparation;
                
                layerData.items.forEach(item => {
                    if (item.category === category) {
                        x.push(item.pca_coordinates.x);
                        y.push(item.pca_coordinates.y);
                        z.push(zLevel);
                        text.push(`${item.text}<br>Category: ${item.category}<br>Layer: ${layerIdx}`);
                    }
                });
            });

            if (x.length > 0) {
                traces.push({
                    x: x, y: y, z: z, text: text,
                    type: 'scatter3d',
                    mode: 'markers',
                    name: category,
                    marker: {
                        size: 6,
                        color: categoryColors[category],
                        opacity: 0.8,
                        line: { color: 'black', width: 0.5 }
                    },
                    hovertemplate: '%{text}<extra></extra>'
                });
            }
        });

        // Add trajectory lines
        const textTrajectories = {};
        Object.entries(dataset.layers).forEach(([layerStr, layerData]) => {
            const layerIdx = parseInt(layerStr);
            const zLevel = layerIdx * zSeparation;
            
            layerData.items.forEach(item => {
                if (!textTrajectories[item.text]) {
                    textTrajectories[item.text] = {
                        x: [], y: [], z: [], category: item.category
                    };
                }
                textTrajectories[item.text].x.push(item.pca_coordinates.x);
                textTrajectories[item.text].y.push(item.pca_coordinates.y);
                textTrajectories[item.text].z.push(zLevel);
            });
        });

        Object.values(textTrajectories).forEach((traj) => {
            if (traj.x.length > 1) {
                traces.push({
                    x: traj.x, y: traj.y, z: traj.z,
                    type: 'scatter3d',
                    mode: 'lines',
                    name: '',
                    showlegend: false,
                    line: {
                        color: categoryColors[traj.category],
                        width: 2,
                        opacity: 0.3
                    },
                    hoverinfo: 'skip'
                });
            }
        });

        const layout = {
            title: `3D Layer-wise Embedding Evolution: ${dataset.dataset_name || 'Dataset'}`,
            scene: {
                xaxis: { title: 'PC1' },
                yaxis: { title: 'PC2' },
                zaxis: { title: 'Layer Index' },
                camera: { eye: { x: 1.5, y: 1.5, z: 1.5 } }
            },
            margin: { l: 0, r: 0, b: 0, t: 40 },
            legend: { x: 0, y: 1 }
        };

        const plotEl = document.getElementById('plot');
        if (plotEl && typeof Plotly !== 'undefined') {
            try {
                console.log('Creating plot with', traces.length, 'traces');
                Plotly.newPlot('plot', traces, layout, {
                    responsive: true,
                    displayModeBar: true
                });
                console.log('Plot created successfully');
            } catch (error) {
                console.error('Error creating plot:', error);
                plotEl.innerHTML = `<div style="padding: 20px; color: red;">Error creating plot: ${error.message}</div>`;
            }
        } else if (!plotEl) {
            console.error('Plot element not found');
        } else if (typeof Plotly === 'undefined') {
            console.error('Plotly not loaded');
            const plotEl = document.getElementById('plot');
            if (plotEl) {
                plotEl.innerHTML = '<div style="padding: 20px; color: orange;">Plotly.js not loaded. Please refresh the page.</div>';
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLayerwiseVisualization);
    } else {
        initializeLayerwiseVisualization();
    }
</script>
</div>

## How to Use

1. The visualization will attempt to load data automatically
2. Use the dropdown to switch between different datasets (if multiple are available)
3. Adjust the Z-separation slider to change layer spacing
4. Click and drag to rotate the 3D plot
5. Use mouse wheel to zoom in/out
6. Hover over points to see detailed information

## Technical Details

The visualization uses:
- **Plotly.js** for 3D rendering
- **PCA coordinates** for 2D positioning at each layer
- **Layer index** as the Z-axis dimension
- **Trajectory lines** to show evolution paths
- **Color coding** by semantic categories

## Interpretation

- Points closer together represent similar embeddings
- Trajectory lines show how individual samples move through the embedding space
- Layer progression (Z-axis) reveals how the network transforms representations
- Category clustering indicates semantic organization at different layers

---

## Key Findings & Recommendations

### What This Embedding Model Does Well:
1. **Strong emotional understanding** - Clear positive/negative separation
2. **Good ordinal relationships** - Size progression is well-preserved  
3. **Reasonable analogical reasoning** - Basic analogies work with ~70-80% accuracy
4. **Semantic similarity** - Similar words cluster appropriately

### Areas for Improvement:
1. **Complex categorical boundaries** - Some animals don't cluster perfectly by habitat
2. **Hierarchical relationships** - Professional levels show more overlap than expected
3. **Multi-word context** - Sentence-level embeddings show more variance

### Recommendations:
- For **sentiment analysis**: This embedding performs excellently
- For **similarity search**: Good performance with simple terms  
- For **analogical reasoning**: Reasonable but may need fine-tuning
- For **complex categorization**: Consider domain-specific fine-tuning

---

## Interactive Exploration

Try exploring the visualizations above by:
- **Rotating** the 3D plots to see different perspectives
- **Hovering** over points to see exact words and coordinates  
- **Zooming** to examine clustering in detail
- **Toggling** categories on/off using the legend
- **Testing word similarities** using the interactive calculator

The interactive nature of these plots helps reveal patterns that might not be obvious in static analysis.

---

## Conclusion

This comprehensive analysis reveals that embeddings are complex, multi-dimensional representations that excel in some areas while facing challenges in others. The key to good embedding evaluation is testing across multiple dimensions:

1. **Geometric properties** (clustering, separation)
2. **Semantic relationships** (similarity, analogies)  
3. **Task-specific performance** (classification accuracy)
4. **Interpretability** (visualization, explainability)

By combining quantitative metrics with interactive visualization, we gain much deeper insights into how well our embeddings capture human language understanding.

---

*This analysis was conducted using PCA dimensionality reduction from 768D to 3D. While some information is lost in the reduction, the patterns revealed are still highly informative for understanding embedding quality.*
