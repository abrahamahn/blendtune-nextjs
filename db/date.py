import json

# Read data from the input JSON file
with open('tracks.json', 'r') as input_file:
    data = json.load(input_file)

# Define a function to convert the date format
def convert_date_format(date_str):
    try:
        # Split the date string into components
        month, day, year = date_str.split('/')
        # Format the date in "yyyy-mm-dd" format
        new_date = f'{year}-{month.zfill(2)}-{day.zfill(2)}'
        return new_date
    except ValueError:
        # Handle invalid date strings gracefully
        return date_str

# Iterate through the data and update the date format in .metadata.release
for track in data:
    if 'metadata' in track and 'release' in track['metadata']:
        track['metadata']['release'] = convert_date_format(track['metadata']['release'])

# Save the updated data to the output JSON file
with open('tracks_date.json', 'w') as output_file:
    json.dump(data, output_file, indent=4)

print('Conversion complete. Data saved to tracks_date.json.')
