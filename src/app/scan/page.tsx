'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, Upload, Edit2, Check, AlertCircle, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
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
  } | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [customMaterialName, setCustomMaterialName] = useState('');
  const [manualPickerOpen, setManualPickerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Check if preset passed via query param
  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset) {
      handleScanMaterial(null, preset);
    }
  }, [searchParams]);

  // Client-side image resize helper (max 1024px longest side)
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

      if (!res.ok) {
        throw new Error('Scan service returned an error. Please try again.');
      }

      const data = await res.json();
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
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full">
          <Camera className="w-3.5 h-3.5" />
          <span>Module 2: Scan & Identify Material</span>
        </div>
        <h1 className="text-3xl font-extrabold text-forest-950">Photograph or Choose Waste Material</h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto">
          Snap a photo with your phone camera, upload an image, or pick from our Malaysian hero waste catalogue.
        </p>
      </div>

      {/* Upload & Camera Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-forest-100 shadow-md space-y-6">
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

        {/* Action Buttons / Preview Area */}
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative aspect-video max-h-72 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              <img src={previewUrl} alt="Uploaded waste" className="w-full h-full object-contain" />
              {isScanning && (
                <div className="absolute inset-0 bg-forest-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-300" />
                  <span className="text-sm font-semibold">Analyzing waste with AI Vision...</span>
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl min-h-[44px] transition"
              >
                Change photo
              </button>
              <button
                onClick={() => setManualPickerOpen(true)}
                className="px-4 py-2 bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-semibold rounded-xl min-h-[44px] transition"
              >
                Pick from list instead
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-forest-300 hover:border-forest-500 hover:bg-forest-50/50 rounded-2xl flex flex-col items-center justify-center space-y-3 transition group min-h-[160px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-forest-100 group-hover:bg-forest-200 text-forest-700 flex items-center justify-center transition">
                <Camera className="w-7 h-7" />
              </div>
              <div className="text-center">
                <span className="font-bold text-sm text-forest-900 block">Take Photo with Camera</span>
                <span className="text-xs text-stone-500">Live capture from smartphone</span>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-forest-300 hover:border-forest-500 hover:bg-forest-50/50 rounded-2xl flex flex-col items-center justify-center space-y-3 transition group min-h-[160px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-forest-100 group-hover:bg-forest-200 text-forest-700 flex items-center justify-center transition">
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-center">
                <span className="font-bold text-sm text-forest-900 block">Upload Existing Photo</span>
                <span className="text-xs text-stone-500">JPG, PNG, WEBP (Max 10MB)</span>
              </div>
            </button>
          </div>
        )}

        {/* Fallback picker toggle */}
        {!previewUrl && (
          <div className="text-center pt-2">
            <button
              onClick={() => setManualPickerOpen(!manualPickerOpen)}
              className="text-xs font-semibold text-forest-700 hover:underline min-h-[44px] inline-flex items-center"
            >
              Or pick a material from the Malaysian hero catalogue &rarr;
            </button>
          </div>
        )}

        {/* Searchable Fallback Modal / Panel */}
        {manualPickerOpen && (
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">Select Waste Material</span>
              <button
                onClick={() => setManualPickerOpen(false)}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Close
              </button>
            </div>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter materials (e.g. coconut, coffee, oil)..."
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pt-1">
              {filteredMaterials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectFallback(m.name)}
                  className="p-2.5 text-left rounded-xl bg-white border border-stone-200 hover:border-forest-500 hover:bg-forest-50/60 transition min-h-[44px] flex flex-col justify-center"
                >
                  <span className="font-bold text-xs text-stone-900">{m.name}</span>
                  <span className="text-[10px] text-stone-500 capitalize">{m.category} category &bull; RM {m.typicalCostRangeRm}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scan Result Display */}
        {scanResult && (
          <div className="p-5 bg-gradient-to-br from-emerald-50 to-forest-50 border border-emerald-200 rounded-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Identified Material</span>
                {isEditingName ? (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={customMaterialName}
                      onChange={(e) => setCustomMaterialName(e.target.value)}
                      className="px-3 py-1.5 text-sm font-bold border border-forest-400 rounded-lg focus:outline-none bg-white min-h-[44px]"
                    />
                    <button
                      onClick={handleConfirmEdit}
                      className="p-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-black text-forest-950">{scanResult.material_name}</h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 text-stone-400 hover:text-forest-700 hover:bg-white rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Edit material name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="inline-flex items-center space-x-1 text-xs font-bold bg-white px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-800 shadow-xs">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{Math.round(scanResult.confidence * 100)}% Confidence</span>
                </span>
                <span className="block text-[10px] uppercase font-bold text-stone-500 mt-1">
                  Category: {scanResult.category}
                </span>
              </div>
            </div>

            {scanResult.confidence < 0.5 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Confidence is low. Please confirm or choose from the list.</span>
              </div>
            )}

            {scanResult.notes && (
              <p className="text-xs text-stone-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-emerald-100">
                {scanResult.notes}
              </p>
            )}

            <div className="pt-2">
              <button
                onClick={handleContinueToIdeas}
                className="w-full py-3.5 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2 min-h-[48px]"
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
