---
title: layers-travel
date: 2025-09-16
category: "AI & ML"
categories: [machine-learning, visualization, neural-networks]
tags: [embeddings, pca, 3d-visualization, plotly]
description: "Interactive 3D visualization of how neural network embeddings evolve across layers"
---

# Interactive 3D visualization of how neural network embeddings evolve across layers [gemma-embedding]
![newplot(4).png](https://tatva.sumityadav.com.np/posts/2025/09/16/layers-travel/newplot(4).png)


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Layer-wise Embedding Evolution</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/plotly.js/2.26.0/plotly.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .controls {
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
        }
        select, input[type="file"] {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
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
    </style>
</head>
<body>
<div class="container">
<h1>3D Layer-wise Embedding Evolution Visualizer</h1>
        
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
    const JSON_FILE_PATH = 'https://tatva.sumityadav.com.np/posts/2025/09/16/layers-travel/all_layerwise_embeddings.json';
    
    // Color palette for categories
    const colors = [
        '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', 
        '#ff7f00', '#ffff33', '#a65628', '#f781bf'
    ];

    document.getElementById('loadData').addEventListener('click', loadDataFromFile);
    document.getElementById('datasetSelect').addEventListener('change', updateVisualization);
    document.getElementById('zSeparation').addEventListener('input', function() {
        document.getElementById('zValue').textContent = this.value;
        updateVisualization();
    });

    // Load data automatically on page load
    window.addEventListener('load', loadDataFromFile);

    function loadDataFromFile() {
        const statusEl = document.getElementById('loadStatus');
        statusEl.textContent = 'Loading...';
        statusEl.style.color = 'orange';
        
        fetch(JSON_FILE_PATH)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                currentData = data;
                populateDatasetSelect();
                updateVisualization();
                statusEl.textContent = 'Data loaded successfully!';
                statusEl.style.color = 'green';
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                statusEl.textContent = `Error loading data: ${error.message}`;
                statusEl.style.color = 'red';
                
                // Show fallback message
                document.getElementById('plot').innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 18px;">
                        <div style="text-align: center;">
                            <p>❌ Could not load JSON file from: ${JSON_FILE_PATH}</p>
                            <p style="font-size: 14px; color: #999;">
                                Make sure the file exists at the specified path and the browser has permission to access it.
                            </p>
                            <p style="font-size: 12px; color: #ccc;">
                                Note: For security reasons, browsers may block local file access. 
                                Consider running a local web server or hosting the file.
                            </p>
                        </div>
                    </div>
                `;
            });
    }

    function populateDatasetSelect() {
        const select = document.getElementById('datasetSelect');
        select.innerHTML = '<option value="">Select Dataset</option>';
        
        if (currentData) {
            // Check if data has multiple datasets
            const datasetNames = Object.keys(currentData);
            if (datasetNames.length > 1) {
                datasetNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                });
                select.style.display = 'block';
                select.value = datasetNames[0]; // Select first dataset
            } else {
                select.style.display = 'none';
            }
        }
    }

    function getCurrentDataset() {
        if (!currentData) return null;
        
        const selectedDataset = document.getElementById('datasetSelect').value;
        
        if (selectedDataset && currentData[selectedDataset]) {
            return currentData[selectedDataset];
        } else if (currentData.layers) {
            // Single dataset format
            return currentData;
        } else {
            // Multiple datasets, return first one
            const firstKey = Object.keys(currentData)[0];
            return currentData[firstKey];
        }
    }

    function updateVisualization() {
        const dataset = getCurrentDataset();
        if (!dataset) return;

        const zSeparation = parseInt(document.getElementById('zSeparation').value);
        
        // Update info
        const info = document.getElementById('info');
        info.style.display = 'block';
        info.innerHTML = `
            <strong>Dataset:</strong> ${dataset.dataset_name || 'Unknown'} | 
            <strong>Description:</strong> ${dataset.description || 'N/A'} | 
            <strong>Total Items:</strong> ${dataset.total_items || 'N/A'} | 
            <strong>Layers:</strong> ${dataset.num_layers || Object.keys(dataset.layers).length}
        `;

        // Prepare data for plotting
        const traces = [];
        const categories = dataset.categories || [];
        const categoryColors = {};
        categories.forEach((cat, i) => {
            categoryColors[cat] = colors[i % colors.length];
        });

        // Create traces for each category
        categories.forEach(category => {
            const x = [], y = [], z = [], text = [], layer_info = [];
            
            Object.entries(dataset.layers).forEach(([layerStr, layerData]) => {
                const layerIdx = parseInt(layerStr);
                const zLevel = layerIdx * zSeparation;
                
                layerData.items.forEach(item => {
                    if (item.category === category) {
                        x.push(item.pca_coordinates.x);
                        y.push(item.pca_coordinates.y);
                        z.push(zLevel);
                        text.push(`${item.text}<br>Category: ${item.category}<br>Layer: ${layerIdx}`);
                        layer_info.push(layerIdx);
                    }
                });
            });

            if (x.length > 0) {
                traces.push({
                    x: x,
                    y: y,
                    z: z,
                    text: text,
                    type: 'scatter3d',
                    mode: 'markers',
                    name: category,
                    marker: {
                        size: 6,
                        color: categoryColors[category],
                        opacity: 0.8,
                        line: {
                            color: 'black',
                            width: 0.5
                        }
                    },
                    hovertemplate: '%{text}<extra></extra>'
                });
            }
        });

        // Add trajectory lines for same text across layers
        const textTrajectories = {};
        Object.entries(dataset.layers).forEach(([layerStr, layerData]) => {
            const layerIdx = parseInt(layerStr);
            const zLevel = layerIdx * zSeparation;
            
            layerData.items.forEach(item => {
                if (!textTrajectories[item.text]) {
                    textTrajectories[item.text] = {
                        x: [], y: [], z: [], 
                        category: item.category
                    };
                }
                textTrajectories[item.text].x.push(item.pca_coordinates.x);
                textTrajectories[item.text].y.push(item.pca_coordinates.y);
                textTrajectories[item.text].z.push(zLevel);
            });
        });

        // Add trajectory lines
        Object.values(textTrajectories).forEach((traj, i) => {
            if (traj.x.length > 1) {
                traces.push({
                    x: traj.x,
                    y: traj.y,
                    z: traj.z,
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
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
            },
            margin: { l: 0, r: 0, b: 0, t: 40 },
            legend: {
                x: 0,
                y: 1
            }
        };

        Plotly.newPlot('plot', traces, layout, {
            responsive: true,
            displayModeBar: true
        });
    }

    // Instructions for user
    if (!currentData) {
        document.getElementById('plot').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 18px;">
                <div style="text-align: center;">
                    <p>Loading data from: ${JSON_FILE_PATH}</p>
                    <p style="font-size: 14px; color: #999;">
                        Click "Load Data" if the data doesn't load automatically
                    </p>
                </div>
            </div>
        `;
    }
</script>
</body>


##🧩 **Conclusion**

This 3D visualization reveals how a transformer model **energizes and organizes meaning** across its layers.
Initially, all sentence embeddings cluster tightly — representing **low semantic differentiation**. As the layers deepen, the embeddings **spread outward and form distinct clusters**, showing how the model gradually transforms raw token information into **semantically charged representations** (positive, negative, neutral).

The expanding, conical structure reflects a **flow of informational energy** — from a compressed input state to a more expressive, task-specific space.
In essence, this plot captures the **evolution of understanding inside the model**, where representational energy becomes more structured and sentiment meaning emerges layer by layer.
