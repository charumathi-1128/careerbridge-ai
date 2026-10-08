import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import api from '../services/api';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Code2,
  GraduationCap
} from 'lucide-react';

export const ResumeUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [extractedResume, setExtractedResume] = useState(null);
  const navigate = useNavigate();

  // Load latest uploaded resume on mount if available
  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      const res = await api.get('/resume/current');
      if (res.data) {
        setExtractedResume(res.data);
      }
    } catch (err) {
      console.error('No existing resume found', err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['pdf', 'docx'].includes(ext)) {
        setError('Only PDF (.pdf) or Word (.docx) documents are supported.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExtractedResume(res.data);
      setSelectedFile(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload and parse resume. Please check file format.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Your Resume</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume in PDF or DOCX format. CareerBridge AI will extract your skills, technical proficiencies, education, and experiences.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <Card>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-8 text-center transition bg-slate-50/50">
            <UploadCloud className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">
              Drag & drop your resume file here, or{' '}
              <label className="text-indigo-600 hover:underline cursor-pointer font-bold">
                browse computer
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-xs text-slate-400 mt-2">Accepted formats: .pdf, .docx (Max 5MB)</p>

            {selectedFile && (
              <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-lg text-sm border border-indigo-200">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold">{selectedFile.name}</span>
                <span className="text-xs text-indigo-500">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm shadow-sm transition flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{uploading ? 'Extracting Resume Text...' : 'Upload & Parse Profile'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Card>

      {/* Current Extracted Profile Preview */}
      {extractedResume && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Current Profile Active ({extractedResume.file_name})</span>
            </div>

            <button
              onClick={() => navigate('/career/target')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5"
            >
              <span>Proceed to Select Target Career</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Identified Technical Skills" subtitle="Extracted from your resume">
              {extractedResume.parsed_data?.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {extractedResume.parsed_data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No matching technical skills detected yet.</p>
              )}
            </Card>

            <Card title="Extracted Profile Details" subtitle="Contact and credentials">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Contact Email:</span>
                  <p className="text-slate-800 font-medium">{extractedResume.parsed_data?.email || 'Not detected'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Phone:</span>
                  <p className="text-slate-800 font-medium">{extractedResume.parsed_data?.phone || 'Not detected'}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">File Type:</span>
                  <p className="text-slate-800 font-medium uppercase">{extractedResume.file_type}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
