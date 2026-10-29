import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Building2, Globe, Mail, MapPin } from 'lucide-react';
import { AvatarUpload } from '../../components/ui/AvatarUpload';

export const BusinessProfilePage = () => {
  const { currentBusiness, businesses, updateBusinessProfile, addToast } = useApp();
  const business = currentBusiness || businesses[0];

  const [name, setName] = useState(business?.name || business?.companyName || '');
  const [logo, setLogo] = useState(business?.logo || '');
  const [businessType, setBusinessType] = useState(business?.businessType || 'Retail & D2C');
  const [description, setDescription] = useState(business?.description || '');
  const [location, setLocation] = useState(business?.location || 'India');
  const [contactPerson, setContactPerson] = useState(business?.contactPerson || '');
  const [contactEmail, setContactEmail] = useState(business?.contactEmail || '');
  const [websiteUrl, setWebsiteUrl] = useState(business?.websiteUrl || '');

  useEffect(() => {
    if (business) {
      setName(business.name || business.companyName || '');
      setLogo(business.logo || '');
      setBusinessType(business.businessType || 'Retail & D2C');
      setDescription(business.description || '');
      setLocation(business.location || 'India');
      setContactPerson(business.contactPerson || '');
      setContactEmail(business.contactEmail || '');
      setWebsiteUrl(business.websiteUrl || '');
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessProfile({
      name,
      companyName: name,
      logo,
      avatar: logo,
      businessType,
      description,
      location,
      contactPerson,
      contactEmail,
      websiteUrl,
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Company & Brand Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide accurate details and upload your organization's brand identity so student applicants know who they are building for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Company Logo Upload */}
        <AvatarUpload
          currentAvatar={logo}
          name={name || 'Company'}
          onAvatarChange={(newUrl) => setLogo(newUrl)}
          label="Company Brand Logo"
          helperText="Upload your official company logo or emblem. JPG, PNG, WEBP, or GIF up to 5MB."
          role="business"
        />

        {/* Company Details */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company Information</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Company / Business Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Bangalore TechRetail Solutions"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Business Domain</label>
              <select
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="Retail & D2C">Retail & D2C</option>
                <option value="Tech Startup">Tech Startup</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Education">Education</option>
                <option value="Agency & Creative">Agency & Creative</option>
                <option value="Logistics">Logistics</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Headquarters Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">About Your Company</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your company's mission and products..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contact & Verification</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Contact Person</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={e => setContactPerson(e.target.value)}
                placeholder="e.g. Priya Sharma (Product Lead)"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Contact Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="contact@company.in"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Official Website URL (Optional)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              placeholder="https://company.in"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Changes will automatically reflect on all your posted briefs and applicant dashboards.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
