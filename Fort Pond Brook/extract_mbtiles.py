import mbutil

def extract_tiles(input_file, output_dir):
    print(f"Extracting {input_file} to {output_dir}")
    mbutil.mbtiles_to_disk(input_file, output_dir)
    print("Extraction complete")

if __name__ == "__main__":
    extract_tiles('DEM.mbtiles', 'extracted_tiles')