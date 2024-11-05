const baseApiPath = process.env.REACT_APP_API_URL;
import React, { useState } from 'react';
import { Verb } from '../../../modules/verbs/verbs.type';
import { ConjugationTable } from '../../Table/Table';

type DashboardP = {
    verbList: Verb[];
};

export const Dashboard: React.FC<DashboardP> = (
    props: DashboardP
): JSX.Element => {
    const [responseMessage, setResponseMessage] = useState<string>();

    async function uploadImageUrl() {
        const fileInput = document.getElementById(
            'imageInput2'
        ) as HTMLInputElement;
        const wordInput = document.getElementById('word') as HTMLInputElement;

        const files = fileInput?.files;
        if (!files) {
            return;
        }

        const formData = new FormData();

        formData.append('imageUrl', files[0]);

        try {
            const response = await fetch(
                `${baseApiPath}update-verb-image-url?word=${wordInput?.value}`,
                {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000'
                    },
                    body: formData
                }
            );
            const responseMsg = await response.json();
            setResponseMessage(responseMsg.message as string);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

    return (
        <div className="dashboard-container">
            <div
                className="upload-image"
                style={{ display: 'flex', flexDirection: 'column' }}
            >
                <h1>Upload Verb Image</h1>
                <label htmlFor="word">
                    word:
                    <input type="text" id="word" />
                </label>
                <label htmlFor="imageInput2">
                    resim sec
                    <input type="file" id="imageInput2" />
                </label>
                <button
                    className="primaryBtn"
                    style={{ width: '50%' }}
                    onClick={uploadImageUrl}
                >
                    Upload
                </button>
                {responseMessage && <span>{responseMessage}</span>}
            </div>

            <div className="verb-update-conatiner">
                {props.verbList.map((verb) => {
                    const { pastTense, perfect, presens } = verb.conjugation;
                    return (
                        <div
                            className="conjugation-tables"
                            key={verb.word}
                            style={{ display: 'flex' }}
                        >
                            <h3>{verb.word}</h3>
                            <ConjugationTable
                                tense="Präsens"
                                conjugations={presens}
                                isSeparable={
                                    verb?.isSeparable || verb.isReflexiv
                                }
                            />

                            <ConjugationTable
                                tense="Präteritum"
                                conjugations={pastTense}
                                isSeparable={
                                    verb.isSeparable || verb.isReflexiv
                                }
                            />

                            <ConjugationTable
                                tense="Perfekt"
                                conjugations={
                                    verb?.conjugation?.perfect ||
                                    verb.isReflexiv
                                }
                                isSeparable={true}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
