import React, { useState, useRef } from 'react';
import { Avatar } from './Avatar';
import {
  Camera,
  Upload,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  Check,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Curated avatar presets for students and businesses
const AVATAR_PRESETS = [
  {
    category: 'Student & Creators',
    items: [
      { id: 'p1', label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
      { id: 'p2', label: 'Software Dev', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80' },
      { id: 'p3', label: 'UI Designer', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
      { id: 'p4', label: 'Full Stack', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
      { id: 'p5', label: 'Data Science', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80' },
      { id: 'p6', label: 'Mobile Engineer', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
    ],
  },
  {
    category: 'Company & Business',
    items: [
      { id: 'b1', label: 'Retail Brand', url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80' },
      { id: 'b2', label: 'Tech Studio', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80' },
      { id: 'b3', label: 'Design Agency', url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&auto=format&fit=crop&q=80' },
      { id: 'b4', label: 'Modern Enterprise', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&auto=format&fit=crop&q=80' },
    ],
  },
];

export const AvatarUpload = ({
  currentAvatar = '',
  name = 'User',
  onAvatarChange,
  label = 'Profile Picture',
  helperText = 'JPG, PNG, WEBP, or GIF. Maximum 5MB.',
  role = 'student',
}) => {
  const { uploadAvatar, addToast } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileProcess = async (file) => {
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      addToast('Invalid file format', 'Please select an image file (PNG, JPG, WEBP, GIF).', 'error');
      return;
    }

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('File too large', 'Please choose an image under 5MB.', 'error');
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadAvatar(file);
      if (url && onAvatarChange) {
        onAvatarChange(url);
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemove = () => {
    if (onAvatarChange) {
      onAvatarChange('');
    }
    addToast('Picture Removed', 'Reverted to default monogram avatar.', 'info');
  };

  const handleApplyPreset = (url) => {
    if (onAvatarChange) {
      onAvatarChange(url);
    }
    setShowPresets(false);
    addToast('Preset Applied', 'Profile picture updated from presets.');
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    if (onAvatarChange) {
      onAvatarChange(customUrl.trim());
    }
    setShowUrlInput(false);
    setCustomUrl('');
    addToast('Image Linked', 'Profile picture updated from URL.');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            {label}
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-200/90 bg-slate-50/40 hover:bg-slate-50/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar Preview with Camera badge */}
          <div className="relative group shrink-0">
            <Avatar
              src={currentAvatar}
              name={name}
              size="2xl"
              rounded="rounded-2xl"
              className="ring-4 ring-white shadow-md"
            />

            {/* Hover overlay trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label="Change photo"
              className="absolute inset-0 rounded-2xl bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-bold">Change</span>
            </button>

            {isUploading && (
              <div className="absolute inset-0 rounded-2xl bg-indigo-900/60 text-white flex items-center justify-center backdrop-blur-xs">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* Action buttons & controls */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Choose Preset</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Link URL</span>
              </button>

              {currentAvatar && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500">
              Drag and drop your image directly here, or click <strong className="text-slate-700 font-semibold">Upload Photo</strong> to browse your files.
            </p>

            {/* Custom URL Input Accordion */}
            {showUrlInput && (
              <form onSubmit={handleApplyCustomUrl} className="flex gap-2 pt-1 animate-in fade-in duration-150">
                <input
                  type="url"
                  placeholder="Paste direct image URL (https://...)"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Preset Gallery Picker */}
        {showPresets && (
          <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Select an Avatar Preset:</span>
              <button
                type="button"
                onClick={() => setShowPresets(false)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {AVATAR_PRESETS.flatMap((cat) => cat.items).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.url)}
                  className={`group relative p-1 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    currentAvatar === preset.url
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center">
                    {preset.label}
                  </span>
                  {currentAvatar === preset.url && (
                    <span className="absolute top-1 right-1 bg-indigo-600 text-white p-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

