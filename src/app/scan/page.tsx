'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, Upload, Edit2, Check, AlertCircle, Sparkles, RefreshCw, ArrowRight, ScanLine } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { HERO_MATERIALS } from '@/lib/seed';

function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    scan_id: string;
    material_name: string;
    category: string;
    confidence: number;
    notes?: string;
    source?: 'ai' | 'demo';
  } | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [customMaterialName, setCustomMaterialName] = useState('');
  const [manualPickerOpen, setManualPickerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset) {
      handleScanMaterial(null, preset);
    }
  }, [searchParams]);

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/jpeg',
            0.88
          );
        };
        img.onerror = () => reject(new Error('Failed to load image for resize'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setScanResult(null);

    await handleScanMaterial(file);
  };

  const handleScanMaterial = async (file: File | null, presetName?: string) => {
    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file) {
        const resizedBlob = await resizeImage(file);
        formData.append('file', resizedBlob, file.name);
      }
      if (presetName) {
        formData.append('preset', presetName);
      }
      formData.append('user_id', user?.id || 'usr-demo-maker');

      const res = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Scan service returned an error. Please try again.');
      }

      setScanResult(data);
      setCustomMaterialName(data.material_name);
    } catch (err: any) {
      setError(err?.message || 'Failed to identify material.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmEdit = () => {
    if (!customMaterialName.trim() || !scanResult) return;
    setScanResult({
      ...scanResult,
      material_name: customMaterialName.trim(),
    });
    setIsEditingName(false);
  };

  const handleSelectFallback = (matName: string) => {
    setManualPickerOpen(false);
    handleScanMaterial(null, matName);
  };

  const handleContinueToIdeas = () => {
    if (!scanResult) return;
    router.push(`/ideas?scan_id=${scanResult.scan_id}&material=${encodeURIComponent(scanResult.material_name)}`);
  };

  const filteredMaterials = HERO_MATERIALS.filter((m) =>
    m.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-14">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full shadow-xs">
          <ScanLine className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>Module 2: AI Material Identification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-forest-950 tracking-tight">
          Photograph or Choose Waste Material
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto">
          Snap a photo with your device camera, upload an image file, or select from our verified Malaysian hero materials.
        </p>
      </div>

      {/* Main Upload Box with Uiverse Glass Card */}
      <div className="uiverse-card rounded-[2.5rem] p-6 sm:p-9 space-y-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Preview Area or Action Buttons */}
        {previewUrl ? (
          <div className="space-y-4">
            <div className={`relative aspect-video max-h-72 w-full rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 shadow-inner flex items-center justify-center ${isScanning ? 'uiverse-scanner-frame' : ''}`}>
              <img src={previewUrl} alt="Uploaded waste" className="w-full h-full object-contain" />
              {isScanning && (
                <div className="absolute inset-0 bg-forest-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
                  <div className="relative">
                    <RefreshCw className="w-9 h-9 animate-spin text-emerald-300" />
                    <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-ping" />
                  </div>
                  <span className="text-xs font-extrabold tracking-wider uppercase text-emerald-200">
                    Scanning Waste Morphology with AI Vision...
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-3 pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="uiverse-btn-glass px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Change Photo
              </button>
              <button
                onClick={() => setManualPickerOpen(true)}
                className="uiverse-btn-glass px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Pick from Hero List
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera Capture Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-emerald-300/80 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-3xl flex flex-col items-center justify-center space-y-3 transition-all group min-h-[170px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-forest-100 group-hover:scale-110 text-emerald-800 flex items-center justify-center transition-all shadow-sm">
                <Camera className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="font-extrabold text-sm text-forest-950 block">Live Camera Capture</span>
                <span className="text-xs text-stone-500">Auto-resizes to &le;1024px</span>
              </div>
            </button>

            {/* File Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-emerald-300/80 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-3xl flex flex-col items-center justify-center space-y-3 transition-all group min-h-[170px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-forest-100 group-hover:scale-110 text-emerald-800 flex items-center justify-center transition-all shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <div className="text-center">
                <span className="font-extrabold text-sm text-forest-950 block">Upload Image File</span>
                <span className="text-xs text-stone-500">JPG, PNG, WEBP (Max 10MB)</span>
              </div>
            </button>
          </div>
        )}

        {/* Fallback Selector Button */}
        {!previewUrl && (
          <div className="text-center pt-1">
            <button
              onClick={() => setManualPickerOpen(!manualPickerOpen)}
              className="text-xs font-bold text-forest-700 hover:text-emerald-700 hover:underline min-h-[44px] inline-flex items-center space-x-1"
            >
              <span>Or choose from our Malaysian hero waste catalogue</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        )}

        {/* Searchable Fallback Modal */}
        {manualPickerOpen && (
          <div className="p-5 bg-gradient-to-b from-stone-50 to-emerald-50/40 border border-emerald-200/80 rounded-3xl space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-forest-950 uppercase tracking-wider">Select Waste Material</span>
              <button
                onClick={() => setManualPickerOpen(false)}
                className="text-xs text-stone-400 hover:text-stone-800 font-bold"
              >
                Close
              </button>
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search (e.g. coconut, coffee, palm, oil, fabric)..."
              className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pt-1">
              {filteredMaterials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectFallback(m.name)}
                  className="p-3 text-left rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-center"
                >
                  <span className="font-extrabold text-xs text-forest-950">{m.name}</span>
                  <span className="text-[10px] text-stone-500 capitalize">{m.category} &bull; RM {m.typicalCostRangeRm}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scan Result Display with Uiverse Glow Frame */}
        {scanResult && (
          <div className="p-6 bg-gradient-to-br from-emerald-50 via-forest-50/50 to-lime-50/30 border border-emerald-300/80 rounded-3xl space-y-4 shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                  Identified Waste Material
                </span>
                {isEditingName ? (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={customMaterialName}
                      onChange={(e) => setCustomMaterialName(e.target.value)}
                      className="px-3.5 py-2 text-sm font-bold border border-emerald-400 rounded-xl focus:outline-none bg-white min-h-[44px]"
                    />
                    <button
                      onClick={handleConfirmEdit}
                      className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-black text-forest-950 tracking-tight">{scanResult.material_name}</h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-2 text-stone-400 hover:text-emerald-700 hover:bg-white rounded-xl transition min-h-[40px] min-w-[40px] flex items-center justify-center"
                      title="Edit material name"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="inline-flex items-center space-x-1.5 text-xs font-black bg-white px-3 py-1 rounded-full border border-emerald-200 text-emerald-900 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{Math.round(scanResult.confidence * 100)}% Confidence</span>
                </span>
                <span className="block text-[10px] uppercase font-extrabold text-stone-400 mt-1">
                  Category: {scanResult.category}
                </span>
                <span className={`block text-[10px] uppercase font-black mt-1 ${scanResult.source === 'ai' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {scanResult.source === 'ai' ? 'AI vision result' : 'Demo catalogue result'}
                </span>
              </div>
            </div>

            {scanResult.confidence < 0.5 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Confidence is low. Please confirm or choose from the list.</span>
              </div>
            )}

            {scanResult.notes && (
              <p className="text-xs text-stone-600 leading-relaxed bg-white/80 p-3.5 rounded-2xl border border-emerald-100">
                {scanResult.notes}
              </p>
            )}

            <div className="pt-2">
              <button
                onClick={handleContinueToIdeas}
                className="uiverse-btn-emerald w-full py-3.5 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <span>Confirm Material & Spin Ideas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading scan interface...</div>}>
      <ScanContent />
    </Suspense>
  );
}
