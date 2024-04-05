from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
import io
import base64
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import plotly.express as px
from statsmodels.tsa.seasonal import STL
from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from statsmodels.tsa.seasonal import STL
import matplotlib.pyplot as plt
import io
import base64
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

sustainability_df = pd.read_csv('sustainability_metrics_data_simplified.csv')

# Load the CSV file for logistics
csv_filename = 'Logistics_and_Transportation_Data (4).csv'
logistics_df = pd.read_csv(csv_filename)

# Separate endpoint for sustainability pie chart
@app.route('/api/sustainability_pie_chart')
def get_sustainability_pie_chart():
    labels_sustainability = ['Carbon Footprint (Transportation)', 'Energy Consumption', 'Packaging Materials Weight']
    sizes_sustainability = [sustainability_df['Carbon_Footprint_Transportation'].sum(),
                            sustainability_df['Energy_Consumption'].sum(),
                            sustainability_df['Packaging_Materials_Weight'].sum()]

    plt.clf()
    plt.pie(sizes_sustainability, labels=labels_sustainability, autopct='%1.1f%%', startangle=140)
    plt.axis('equal')
    plt.title('Environmental Impact Assessment (Sustainability)')

    individual_plot_path = 'sustainability_pie_chart.png'
    plt.savefig(individual_plot_path)

    return send_file(individual_plot_path, mimetype='image/png')


# Separate endpoint for logistics histogram
@app.route('/api/logistics_histogram')
def get_logistics_histogram():
    plt.clf()
    sns.set(style="whitegrid")
    plt.hist(logistics_df['Shipping Times (hours)'], bins=20, color='blue', edgecolor='black')
    plt.title('Distribution of Shipping Times (Logistics)')
    plt.xlabel('Shipping Times (hours)')
    plt.ylabel('Frequency')

    individual_plot_path = 'logistics_histogram.png'
    plt.savefig(individual_plot_path)

    return send_file(individual_plot_path, mimetype='image/png')

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


#supply_chain_data = pd.read_csv(r'C:\Users\phadk\Desktop\anapred\supply_chain_data.csv')


# Load supply chain data (replace 'your_data.csv' with the actual file name)
supply_chain_data = pd.read_csv('supply_chain_data.csv')

# Route to get sales over time plot
@app.route('/api/sales_over_time')
def get_sales_over_time():
    # Visualize the sales over time
    plt.figure(figsize=(12, 6))
    plt.plot(supply_chain_data['date'], supply_chain_data['sales'], label='Sales')
    plt.title('Historical Sales Data')
    plt.xlabel('Date')
    plt.ylabel('Sales')
    plt.legend()

    # Save the plot to a BytesIO object
    img_stream = io.BytesIO()
    plt.savefig(img_stream, format='png')
    img_stream.seek(0)
    img_data = base64.b64encode(img_stream.read()).decode('utf-8')

    return jsonify({'image': img_data})




csv_file_path = 'market_trends_data.csv'
df = pd.read_csv(csv_file_path)

# Route to get market demand trends plot
@app.route('/api/market_demand_trends')
def get_market_demand_trends():
    # Set the style for the plot
    sns.set(style="whitegrid")

    # Create a bar plot for Market_Demand_Trends
    plt.figure(figsize=(10, 6))
    sns.countplot(x='Market_Demand_Trends', data=df, palette='viridis')

    # Set axis labels
    plt.xlabel('Market Demand Trends')
    plt.ylabel('Count')

    # Set plot title
    plt.title('Distribution of Market Demand Trends')

    # Save the plot to a BytesIO object
    img_stream = io.BytesIO()
    plt.savefig(img_stream, format='png')
    img_stream.seek(0)
    img_data = base64.b64encode(img_stream.read()).decode('utf-8')

    return jsonify({'image': img_data})


# Load the generated data
supplier_data = pd.read_csv('supplier_data.csv')

# Combine relevant features into a single text representation
supplier_data['SupplierFeatures'] = supplier_data.apply(
    lambda row: f"{row['LeadTime']} {row['PerformanceScore']}",
    axis=1
)

# Use TF-IDF to convert text features into numerical vectors
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(supplier_data['SupplierFeatures'])

# Compute the cosine similarity between supplier vectors
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Function to get supplier recommendations based on similarity
def get_supplier_recommendations(supplier_id, cosine_sim=cosine_sim):
    supplier_index = supplier_data[supplier_data['SupplierID'] == supplier_id].index[0]
    sim_scores = list(enumerate(cosine_sim[supplier_index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  # Exclude the supplier itself (index 0) and take top 10
    supplier_indices = [score[0] for score in sim_scores]
    return supplier_data['SupplierID'].iloc[supplier_indices].tolist()

# Flask route to get supplier recommendations
@app.route('/api/supplier_recommendations/<supplier_id>')
def supplier_recommendations(supplier_id):
    recommendations = get_supplier_recommendations(supplier_id)
    return jsonify({'recommendations': recommendations})





# Function to generate synthetic data for external factors
def generate_external_factors(start_date, end_date):
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    geopolitical_events = np.random.uniform(0, 1, len(date_range))
    weather_conditions = np.random.uniform(0, 1, len(date_range))
    global_economic_factors = np.random.uniform(0, 1, len(date_range))

    data = {'date': date_range, 'geopoliticalevents': geopolitical_events,
            'weatherconditions': weather_conditions, 'globaleconomicfactors': global_economic_factors}

    return pd.DataFrame(data)

# Function to generate synthetic data for supply chain
def generate_synthetic_data(start_date, end_date):
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    sales = np.random.randint(80, 120, len(date_range))  # Sales between 80 and 120
    order_lead_time = np.random.randint(2, 8, len(date_range))  # Order lead time between 2 and 8 days
    inventory_level = np.random.randint(300, 500, len(date_range))  # Inventory level between 300 and 500 units
    supplier_performance = np.random.uniform(0.6, 1, len(date_range))  # Supplier performance between 0.6 and 1

    data = {'date': date_range, 'sales': sales, 'orderleadtime': order_lead_time,
            'inventorylevel': inventory_level, 'supplierperformance': supplier_performance}

    return pd.DataFrame(data)

# Generate synthetic data for external factors
external_factors_start_date = '2022-01-01'
external_factors_end_date = '2022-12-31'
external_factors_data = generate_external_factors(external_factors_start_date, external_factors_end_date)

# Generate synthetic data for supply chain
historical_start_date = '2022-01-01'
historical_end_date = '2022-12-31'
supply_chain_data = generate_synthetic_data(historical_start_date, historical_end_date)

# Merge the datasets on the date column
merged_data = pd.merge(supply_chain_data, external_factors_data, on='date', how='inner')

# Create a synthetic risk factor based on external factors
merged_data['risk_factor'] = (0.4 * merged_data['geopoliticalevents'] +
                              0.3 * merged_data['weatherconditions'] +
                              0.3 * merged_data['globaleconomicfactors'] +
                              np.random.normal(0, 0.1, len(merged_data)))

# Define features (external factors + risk factor) and target (sales)
X = merged_data[['geopoliticalevents', 'weatherconditions', 'globaleconomicfactors', 'risk_factor']]
y = merged_data['sales']

# Initialize and train a Random Forest Regressor model
model = RandomForestRegressor(random_state=42)
model.fit(X, y)


@app.route('/api/future_sale_prediction', methods=['POST'])
def future_sale_prediction():
    # Print received data for debugging
    print(request.json)

    # Get the input for future date range from the request
    future_start_date = request.json.get('future_start_date', '')
    future_end_date = request.json.get('future_end_date', '')

    # Validate the inputs (add your own validation logic)
    if not future_start_date or not future_end_date:
        return jsonify({'error': 'Invalid input. Please provide both start and end dates.'}), 400

    # Generate synthetic data for the specified future date range
    future_external_factors_data = generate_external_factors(future_start_date, future_end_date)

    # Create a synthetic risk factor for the specified future date range
    future_external_factors_data['risk_factor'] = (0.4 * future_external_factors_data['geopoliticalevents'] +
                                                   0.3 * future_external_factors_data['weatherconditions'] +
                                                   0.3 * future_external_factors_data['globaleconomicfactors'] +
                                                   np.random.normal(0, 0.1, len(future_external_factors_data)))

    # Predict sales for the specified future date range
    future_X = future_external_factors_data[['geopoliticalevents', 'weatherconditions', 'globaleconomicfactors', 'risk_factor']]
    future_sales_pred = model.predict(future_X)

    # Convert the array to a list for JSON serialization
    future_sales_pred_list = future_sales_pred.tolist()

    return jsonify({'futureSales': future_sales_pred_list})




def generate_synthetic_data(start_date, end_date):
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    sales = np.random.randint(80, 120, len(date_range))  # Sales between 80 and 120
    order_lead_time = np.random.randint(2, 8, len(date_range))  # Order lead time between 2 and 8 days
    inventory_level = np.random.randint(300, 500, len(date_range))  # Inventory level between 300 and 500 units
    supplier_performance = np.random.uniform(0.6, 1, len(date_range))  # Supplier performance between 0.6 and 1

    data = {'date': date_range, 'sales': sales, 'orderleadtime': order_lead_time,
            'inventorylevel': inventory_level, 'supplierperformance': supplier_performance}

    return pd.DataFrame(data)

# Generate synthetic data for one year
start_date = '2022-01-01'
end_date = '2022-12-31'
supply_chain_data = generate_synthetic_data(start_date, end_date)



@app.route('/api/demand_data')
def get_demand_data():
    start_date = '2022-01-01'
    end_date = '2022-12-31'
    supply_chain_data = generate_synthetic_data(start_date, end_date)

    # Assuming you have a way to forecast sales for the next 60 days
    # Replace this with your actual forecasting logic
    forecast_steps = 60
    forecast_data = pd.DataFrame({
        'date': pd.date_range(start=supply_chain_data['date'].max() + pd.Timedelta(days=1), periods=forecast_steps, freq='D'),
        'sales': np.random.randint(80, 120, forecast_steps)
    })

    # Combine historical and forecast data
    combined_data = pd.concat([supply_chain_data, forecast_data], ignore_index=True)

    # Convert data to JSON format
    data_json = combined_data.to_dict(orient='records')

    return jsonify(data_json)







# Mock data, replace this with your actual data integration logic
supplier_data = pd.read_csv('supplier_data.csv')  # Your supplier data
manufacturer_data = pd.read_csv('historical_delivery_data.csv')  # Your manufacturer data

# Integration logic: Merge datasets on common keys (SupplierID and DeliveryID)
merged_data = pd.merge(manufacturer_data, supplier_data, on=['SupplierID', 'SupplierID'], how='inner')

# Your analysis logic goes here

# Example: Calculate average PerformanceScore for each supplier
average_performance = merged_data.groupby('SupplierID')['PerformanceScore_x'].mean().reset_index()

# Convert the result to a dictionary for easy JSON serialization
result_dict = average_performance.to_dict(orient='records')

# Mock user data
users = {
    'S001': {'password': 'password_s1'},
    'S002': {'password': 'password_s2'},
    # Add more users as needed
}

@app.route('/api/supply-linkage', methods=['GET'])
def get_supply_linkage():
    # Your data integration and analysis logic goes here
    # Example: Return average performance scores for each supplier
    return jsonify({'result': result_dict})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    supplier_id = data.get('supplier_id')
    password = data.get('password')

    if supplier_id in users and password == users[supplier_id]['password']:
        return jsonify({'success': True, 'message': 'Login successful'})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/api/supplier-linkage/<supplier_id>', methods=['GET'])
def get_supplier_linkage(supplier_id):
    # Your data integration and analysis logic for a specific supplier goes here
    # Example: Return linked data for the specific supplier
    supplier_data = merged_data[merged_data['SupplierID'] == supplier_id].to_dict(orient='records')
    return jsonify({'result': supplier_data})

if __name__ == '__main__':
    app.run(debug=True)
