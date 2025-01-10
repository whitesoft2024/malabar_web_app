import React, { useState } from 'react';
import axios from 'axios';
import '../style/Loandocs.css';
import Nav from '../Others/Nav';
import DownloadFiles from './DownloadFiles';

function Loandocs() {
    const [loanNo, setLoanNo] = useState('');
    const [files, setFiles] = useState([null, null, null]);
    const [fileTypes, setFileTypes] = useState(['', '', '']);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        const newFiles = [...files];
        newFiles[index] = file;
        setFiles(newFiles);
    };

    const handleFileTypeChange = (e, index) => {
        const newFileTypes = [...fileTypes];
        newFileTypes[index] = e.target.value;
        setFileTypes(newFileTypes);
    };

    const handleUpload = async () => {
        if (!loanNo.trim() || files.every(file => !file)) {
            setUploadError('Please enter a loan number and select at least one file.');
            return;
        }
    
        setUploading(true);
        setUploadError('');
    
        try {
            const formData = new FormData();
            formData.append('loanNo', loanNo); // Append loan number to formData
    
            // Append file data and file types for each file
            files.forEach((file, index) => {
                if (file) {
                    formData.append(`files`, file); // Append file
                    formData.append(`fileTypes`, fileTypes[index]); // Append file type
                }
            });
    
            // Send formData to the server
            await sendFormData(formData);
        } catch (error) {
            console.error('Error preparing form data:', error);
            setUploadError('Error preparing form data. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const sendFormData = async (formData) => {
        try {
            await axios.post('https://api.malabarbank.in/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
                
             
            });
            console.log('Files uploaded successfully');
            // Clear inputs after successful upload
            setLoanNo('');
            setFiles([null, null, null]);
            setFileTypes(['', '', '']);
        } catch (error) {
            console.log(formData)

            console.error('Error uploading files:', error);
            setUploadError('Error uploading files. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Nav />
            <div className="loandocs-container">
                <h1 className="heading">Security Documents</h1>
                <div className="upload-container">
                    <div className="upload-item">
                        <h2>Loan Number</h2>
                        <input
                            type="text"
                            placeholder="Enter Loan Number"
                            value={loanNo}
                            onChange={(e) => setLoanNo(e.target.value)}
                        />
                    </div>
                    {[1, 2, 3].map(index => (
                        <div key={index} className="upload-item">
                            <h2>Upload File {index}</h2>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index - 1)} />
                            <input
                                type="text"
                                placeholder={`Type of File ${index}`}
                                value={fileTypes[index - 1]}
                                onChange={(e) => handleFileTypeChange(e, index - 1)}
                            />
                        </div>
                    ))}
                    <button onClick={handleUpload} disabled={uploading}>Upload</button>
                    {uploadError && <p className="error-message">{uploadError}</p>}
                </div>

             {/* <DownloadFiles  loanNo={loanNo} /> */}
              </div>
        </>
    );
}

export default Loandocs;


// import React, { useState } from 'react';
// import axios from 'axios';
// import DownloadFiles from './DownloadFiles';
// import '../style/Loandocs.css';
// import Nav from '../Others/Nav';

// function Loandocs() {
//     const [loanNo, setLoanNo] = useState('');
//     const [files, setFiles] = useState([null, null, null]);
//     const [fileTypes, setFileTypes] = useState(['', '', '']);
//     const [uploading, setUploading] = useState(false);
//     const [uploadError, setUploadError] = useState('');

//     const handleFileChange = (e, index) => {
//         const file = e.target.files[0];
//         const newFiles = [...files];
//         newFiles[index] = file;
//         setFiles(newFiles);
//     };

//     const handleFileTypeChange = (e, index) => {
//         const newFileTypes = [...fileTypes];
//         newFileTypes[index] = e.target.value;
//         setFileTypes(newFileTypes);
//     };

//     const handleUpload = async () => {
//         if (!loanNo.trim() || files.every(file => !file)) {
//             setUploadError('Please enter a loan number and select at least one file.');
//             return;
//         }
    
//         setUploading(true);
//         setUploadError('');
    
//         const formData = new FormData();
//         files.forEach((file, index) => {
//             if (file) {
//                 formData.append(`files`, file);
//                 formData.append(`fileTypes`, fileTypes[index]);
//             }
//         });

//         try {
//             await axios.post('https://api.malabarbank.in/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             console.log('Files uploaded successfully');
//             setLoanNo('');
//             setFiles([null, null, null]);
//             setFileTypes(['', '', '']);
//         } catch (error) {
//             console.error('Error uploading files:', error);
//             setUploadError('Error uploading files. Please try again.');
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <>
//             <Nav />
//             <div className="loandocs-container">
//                 <h1 className="heading">Security Documents</h1>
//                 <div className="upload-container">
//                     <div className="upload-item">
//                         <h2>Loan Number</h2>
//                         <input
//                             type="text"
//                             placeholder="Enter Loan Number"
//                             value={loanNo}
//                             onChange={(e) => setLoanNo(e.target.value)}
//                         />
//                     </div>
//                     {[1, 2, 3].map(index => (
//                         <div key={index} className="upload-item">
//                             <h2>Upload File {index}</h2>
//                             <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index - 1)} />
//                             <input
//                                 type="text"
//                                 placeholder={`Type of File ${index}`}
//                                 value={fileTypes[index - 1]}
//                                 onChange={(e) => handleFileTypeChange(e, index - 1)}
//                             />
//                         </div>
//                     ))}
//                     <button onClick={handleUpload} disabled={uploading}>Upload</button>
//                     {uploadError && <p className="error-message">{uploadError}</p>}
//                 </div>
//                 <DownloadFiles loanNo={loanNo} /> {/* Render the component for downloading files */}
//             </div>
//         </>
//     );
// }

// export default Loandocs;
