import json

def reformat_json(input_file_path, output_file_path):
    def reformat_data(data):

        # Reformat the 'info' section
        data['info']['genre'] = list(data['info']['genre'].values())
        data['info']['relatedartist'] = [artist for artist in data['info']['relatedartist'].values() if artist]
        data['info']['mood'] = [mood for mood in data['info']['mood'].values() if mood]

        # Reformat the 'arrangement' section
        data['arrangement'] = [{'time': data['arrangement'][str(i)].get(f'time{i}', ''),
                                'section': data['arrangement'][str(i)].get(f'section{i}', '')}
                            for i in range(1, len(data['arrangement']) + 1)]

        # Reformat the 'instruments' section
        data['instruments'] = list(data['instruments'].values())

        # Reformat the 'creator' section
        data['creator'] = list(data['creator'].values())

        return data

   # Read the JSON data from the input file
    with open(input_file_path, 'r') as file:
        json_data = json.load(file)

    # Apply the reformatting to each object in the JSON data
    reformatted_data = [reformat_data(obj) for obj in json_data]

    # Write the reformatted data to the output file
    with open(output_file_path, 'w') as file:
        json.dump(reformatted_data, file, indent=2)

# Example usage:
input_file = 'tracks.json'
output_file = 'formatted_tracks2.json'
reformat_json(input_file, output_file)