import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';

export default function App() {
  const [image, setImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      runOCR(file);
    }
  };

  const runOCR = async (file) => {
    setIsLoading(true);
    const worker = await createWorker(['eng'], 1);
    const {
      data: { text },
    } = await worker.recognize(file);
    setOcrText(text);
    await worker.terminate();
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📖 영어 읽기 도우미</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div>
          <p>업로드한 이미지:</p>
          <img src={image} alt="Uploaded" style={{ width: '300px', marginBottom: '1rem' }} />
        </div>
      )}
      {isLoading ? (
        <p>🔍 인식 중입니다...</p>
      ) : (
        ocrText && (
          <div>
            <p>📄 인식된 문장:</p>
            <div style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '1rem' }}>
              {ocrText.trim()}
            </div>
          </div>
        )
      )}
    </div>
  );
}
