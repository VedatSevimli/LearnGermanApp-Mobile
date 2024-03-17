import React from 'react';
import './Listening.scss';

export const Listening: React.FC = (): JSX.Element => {
    async function uploadImage() {
        const fileInput = document.getElementById('imageInput');
        const files = fileInput?.files;
        if (!files) {
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            const response = await fetch('http://localhost:5000/uploadImages', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                },
                body: formData
            });

            if (response.ok) {
                console.log('Image uploaded successfully');
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    return (
        <div className="listening">
            Listening page
            <div className="upload-image">
                <h1>Upload Image</h1>
                <input type="file" id="imageInput" multiple />
                <button onClick={uploadImage}>Upload</button>
            </div>
        </div>
    );
};
