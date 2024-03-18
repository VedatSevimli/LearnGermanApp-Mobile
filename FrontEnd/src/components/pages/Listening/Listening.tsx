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
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    async function uploadImageUrl() {
        const fileInput = document.getElementById('imageInput2');
        const wordInput = document.getElementById('word');

        const files = fileInput?.files;
        if (!files) {
            return;
        }

        const formData = new FormData();

        formData.append('imageUrl', files[0]);

        try {
            const response = await fetch(
                `http://localhost:5000/api/update-verb-image-url?word=${wordInput?.value}`,
                {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000'
                    },
                    body: formData
                }
            );
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    return (
        <div className="listening">
            Listening page
            {/* <div className="upload-image">
                <h1>Upload Image</h1>
                <input type="file" id="imageInput" multiple />
                <button onClick={uploadImage}>Upload</button>
            </div> */}
            <div className="upload-image">
                <h1>Upload Verb Image</h1>
                <input type="text" id="word" />
                <input type="file" id="imageInput2" />
                <button onClick={uploadImageUrl}>Upload</button>
            </div>
        </div>
    );
};
