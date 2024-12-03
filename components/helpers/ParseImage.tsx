export const parseImage: any = (photo: { uri: any; width: any; height: any; }) => {
    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = photo?.uri;
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    return {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        name: filename,
        type
    };

};