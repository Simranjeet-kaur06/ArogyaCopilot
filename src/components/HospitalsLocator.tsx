import React, { useState, useEffect } from 'react';
import {
  MapPin,
  PhoneCall,
  Navigation,
  Ambulance,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter,
  Star,
  Activity,
  LocateFixed,
  Building,
  Calendar,
} from 'lucide-react';
import { Hospital, LanguageCode } from '../types/health';
import { NEARBY_HOSPITALS } from '../data/mockData';
import { t } from '../utils/translations';

interface HospitalsLocatorProps {
  currentLang: LanguageCode;
  onOpenVisitReminders?: () => void;
}

export const HospitalsLocator: React.FC<HospitalsLocatorProps> = ({ currentLang, onOpenVisitReminders }) => {
  const [hospitals, setHospitals] = useState<Hospital[]>(NEARBY_HOSPITALS);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Detect Location');

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation unsupported');
      return;
    }
    setLocationStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('GPS Active');
      },
      (err) => {
        console.warn(err);
        setLocationStatus('Permission Denied (Defaulting to New Delhi)');
        setUserLocation({ lat: 28.5672, lng: 77.21 });
      }
    );
  };

  const filteredHospitals = hospitals.filter((h) => {
    const matchesType = filterType === 'all' || h.type === filterType;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-linear-to-r from-red-950 via-rose-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              Emergency Radar • Google Maps Hospital Finder
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Nearby Hospitals & Emergency Centers
            </h1>
            <p className="text-sm text-rose-100 mt-2 leading-relaxed">
              Locate 24x7 emergency medical centers with real-time ICU bed availability, direct phone lines, and one-click Google Maps GPS navigation.
            </p>
          </div>

          {/* Quick Action: Search Nearby on Google Maps */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDetectLocation}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <LocateFixed className="w-4 h-4 text-emerald-400" />
              <span>{locationStatus}</span>
            </button>
            <a
              href="https://www.google.com/maps/search/hospitals+near+me"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Open Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Emergency National Speed Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a
          href="tel:102"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all flex items-center justify-between text-rose-950 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-rose-800">Free Ambulance</span>
              <p className="text-xl font-black text-rose-900 font-mono">102 / 108</p>
            </div>
          </div>
          <PhoneCall className="w-5 h-5 text-rose-600" />
        </a>

        <a
          href="tel:112"
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all flex items-center justify-between text-amber-950 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-amber-800">Unified Emergency</span>
              <p className="text-xl font-black text-amber-900 font-mono">112</p>
            </div>
          </div>
          <PhoneCall className="w-5 h-5 text-amber-600" />
        </a>

        <a
          href="tel:1075"
          className="p-4 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-all flex items-center justify-between text-teal-950 group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-600 text-white rounded-xl group-hover:scale-105 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-teal-800">National Health Helpline</span>
              <p className="text-xl font-black text-teal-900 font-mono">1075</p>
            </div>
          </div>
          <PhoneCall className="w-5 h-5 text-teal-600" />
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search hospitals by name, specialty, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2 bg-transparent focus:outline-hidden"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex flex-wrap gap-1">
            {['all', 'Multispecialty', 'Government', 'Cardiology', 'Pediatric'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'All Centers' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                      {hospital.type}
                    </span>
                    {hospital.has24x7Emergency && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-600" /> 24x7 Emergency
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    {hospital.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-rose-700">
                    {hospital.distanceKm} km
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold justify-end mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {hospital.rating}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{hospital.address}</span>
              </p>

              {/* ICU Bed status */}
              <div className="mt-3 p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">{t('icuBeds', currentLang)}:</span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {hospital.icuBedsAvailable} Beds Free
                </span>
              </div>
            </div>

            {/* Action Buttons: Call, Google Maps Navigation & Schedule Reminder */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${hospital.emergencyPhone.replace(/\s+/g, '')}`}
                  className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Emergency</span>
                </a>
                <a
                  href={hospital.openGoogleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t('openInGoogleMaps', currentLang)}</span>
                </a>
              </div>

              {onOpenVisitReminders && (
                <button
                  onClick={onOpenVisitReminders}
                  className="w-full p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Schedule Doctor Visit Reminder</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
