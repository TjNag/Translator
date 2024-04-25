import React, { useState } from 'react';
import { MdSwapHoriz, MdClear, MdSync } from 'react-icons/md';  // Import necessary icons
import languageList from './Language.json';  // Ensure this path is correct and the JSON file is properly formatted

export default function Translator() {
    const [inputFormat, setInputFormat] = useState('en');
    const [outputFormat, setOutputFormat] = useState('hi');
    const [translatedText, setTranslatedText] = useState('Translation');
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReverseLanguage = () => {
        setInputFormat(outputFormat);
        setOutputFormat(inputFormat);
        setInputText('');
        setTranslatedText('Translation');
    };

    const handleRemoveInputText = () => {
        setInputText('');
        setTranslatedText('Translation');
    };

    const handleTranslate = async () => {
        if (!inputText || !inputFormat || !outputFormat) return;
        setLoading(true);

        const url = `https://microsoft-translator-text.p.rapidapi.com/translate?to%5B0%5D=${outputFormat}&api-version=3.0&profanityAction=NoAction&textType=plain`;
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '6dd27cce59msh33af8088a1f3076p1c2f82jsne2560188b5e3',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            body: JSON.stringify([{ Text: inputText }])
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            setTranslatedText(data[0].translations[0].text);
        } catch (error) {
            console.error(error);
            alert("Translation failed, please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <select className="flex-grow p-2 border border-gray-300 rounded text-gray-700" value={inputFormat} onChange={(e) => setInputFormat(e.target.value)}>
                    {Object.keys(languageList).map(key => (
                        <option key={key} value={key}>{languageList[key].name}</option>
                    ))}
                </select>
                <MdSwapHoriz className='text-3xl cursor-pointer hover:text-blue-500 transition-colors duration-200' onClick={handleReverseLanguage} />
                <select className="flex-grow p-2 border border-gray-300 rounded text-gray-700" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
                    {Object.keys(languageList).map(key => (
                        <option key={key} value={key}>{languageList[key].name}</option>
                    ))}
                </select>
            </div>
            <div className="relative my-4">
                <textarea className="w-full p-2 border border-gray-300 rounded text-gray-700" value={inputText} placeholder='Enter Text' onChange={(e) => setInputText(e.target.value)} />
                {inputText && <MdClear className='absolute top-2 right-2 text-3xl text-gray-700 cursor-pointer hover:text-red-500 transition-colors duration-200' onClick={handleRemoveInputText} />}
            </div>
            <div className="p-2 mt-2 border border-gray-300 rounded bg-gray-100 text-gray-700">{translatedText}</div>
            <button className={`mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleTranslate} disabled={loading}>
                {loading ? <MdSync className="animate-spin inline mr-2" /> : 'Translate'}
            </button>
        </div>
    );
}
