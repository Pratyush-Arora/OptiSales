# app.py

from flask import Flask, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_optimized_route')
def get_optimized_route():
    # Load logistics data
    logistics_data = pd.read_csv(r'Logistics_and_Transportation_Data (4).csv')

    # Extract coordinates for TSP
    locations = logistics_data[['Shipping Times (hours)', 'Transportation Costs ($)']].values

    # Create a complete graph with distances as edge weights
    G = nx.complete_graph(len(locations))
    for i in range(len(locations)):
        for j in range(i + 1, len(locations)):
            distance = np.linalg.norm(locations[i] - locations[j])
            G[i][j]['weight'] = distance
            G[j][i]['weight'] = distance

    # Solve TSP using NetworkX
    tsp_solution = nx.approximation.traveling_salesman_problem(G, cycle=True)

    # Visualize the optimized route
    optimized_route_coordinates = locations[tsp_solution]

    # Plot the graph and save it to a BytesIO object
    plt.figure(figsize=(8, 6))
    plt.plot(locations[:, 0], locations[:, 1], 'o', label='Original Locations')
    plt.plot(optimized_route_coordinates[:, 0], optimized_route_coordinates[:, 1], 'r-', label='Optimized Route')
    plt.xlabel('Shipping times')
    plt.ylabel('Transportation costs')
    plt.title('Optimized Transportation Route (Using NetworkX)')
    plt.legend()

    # Save the plot to a BytesIO object
    img_stream = io.BytesIO()
    plt.savefig(img_stream, format='png')
    img_stream.seek(0)
    img_data = base64.b64encode(img_stream.read()).decode('utf-8')

    return jsonify({'image': img_data})

if __name__ == '__main__':
    app.run(debug=True)
