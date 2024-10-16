import csv
import matplotlib.pyplot as plt

# Read the CSV file
names = []
elevations = []

with open('elevation_data.csv', 'r') as file:
    csv_reader = csv.DictReader(file)
    for row in csv_reader:
        names.append(row['name'])
        elevations.append(round(float(row['Elevation1']), 1))

# Create the plot
plt.figure(figsize=(12, 6))
plt.plot(names, elevations, marker='o')

# Customize the plot
plt.title('Elevation by Scene', fontsize=16)
plt.xlabel('Scene', fontsize=12)
plt.ylabel('Elevation (m)', fontsize=12)
plt.grid(True, linestyle='--', alpha=0.7)

# Rotate x-axis labels for better readability
plt.xticks(rotation=45, ha='right')

# Adjust layout to prevent cutting off labels
plt.tight_layout()

# Save the plot as a PNG file
plt.savefig('elevation_plot.png', dpi=300, bbox_inches='tight')

print("Plot saved as elevation_plot.png")

# Optionally, display the plot (comment out if not needed)
# plt.show()