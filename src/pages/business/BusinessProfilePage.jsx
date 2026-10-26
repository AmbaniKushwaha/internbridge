import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save } from 'lucide-react';

export const BusinessProfilePage = () => {
  const { currentBusiness, businesses, updateBusinessProfile, addToast } = useApp();
  const business = currentBusiness || businesses[0];

  const [name, setName] = useState(business.name || business.companyName);
  const [businessType, setBusinessType] = useState(business.businessType);
  const [description, setDescription] = useState(business.description);
  const [location, setLocation] = useState(business.location);
  const [contactPerson, setContactPerson] = useState(business.contactPerson);
  const [contactEmail, setContactEmail] = useState(business.contactEmail);
  const [websiteUrl, setWebsiteUrl] = useState(business.websiteUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessProfile({
      name,
      companyName: name,
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
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Business Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide accurate details about your business so student applicants know who they are building for.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <img
            src={business.logo}
            alt={business.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <div className="text-base font-bold text-slate-900">{business.name}</div>
            <div className="text-xs text-slate-500">{business.businessType} · {business.location}</div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">Company / Business Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Business Domain</label>
            <select
              value={businessType}
              onChange={e => setBusinessType(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
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
            <label className="block text-xs font-semibold text-slate-800 mb-1">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">About Your Company</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Contact Person</label>
            <input
              type="text"
              required
              value={contactPerson}
              onChange={e => setContactPerson(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">Website URL (Optional)</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={e => setWebsiteUrl(e.target.value)}
            placeholder="https://company.in"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
