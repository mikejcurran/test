import json

def create_geojson(input_file, output_file):
    # Read the input JSON file
    with open(input_file, 'r') as f:
        data = json.load(f)

    # Create the GeoJSON structure
    geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    # Iterate through each point in the input data
    for index, point in enumerate(data, start=1):
        # Create a feature for this point
        feature = {
            "type": "Feature",
            "properties": {
                "name": f"Scene {index}"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [point["GPSLongitude"], point["GPSLatitude"]]
            }
        }
        
        # Add this feature to the GeoJSON
        geojson["features"].append(feature)

    # Write the GeoJSON to the output file
    with open(output_file, 'w') as f:
        json.dump(geojson, f, indent=2)

    print(f"GeoJSON file created: {output_file}")

# Use the function
create_geojson('gps_data.json', 'gopro_scenes.geojson')