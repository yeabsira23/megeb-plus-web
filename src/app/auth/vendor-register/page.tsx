'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight,Loader2,
  Upload, X, Plus, Trash2, FileText, CheckCircle2, UserRound, Store, IdCard, Package, ClipboardCheck,
  ShieldCheck, } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';

type VendorProductInput = {
  name: string;
  description: string;
  price: number;
  category: string;
};

type Step = 'business' | 'license' | 'products' | 'review';

const STEPS: { key: Step; number: string; label: string; icon: typeof UserRound }[] = [
  { key: 'business', number: '01', label: 'Business', icon: UserRound },
  { key: 'license', number: '02', label: 'License', icon: IdCard },
  { key: 'products', number: '03', label: 'Products', icon: Package },
  { key: 'review', number: '04', label: 'Review', icon: ClipboardCheck },
];

const BUSINESS_TYPES = [
  { label: 'Select a type', value: '' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Catering Service', value: 'catering' },
  { label: 'Food Manufacturer', value: 'food_manufacturer' },
  { label: 'Grocery / Food Store', value: 'grocery' },
  { label: 'Bakery', value: 'bakery' },
  { label: 'Other', value: 'other' },
];

const emptyProduct: VendorProductInput = {
  name: '',
  description: '',
  price: 0,
  category: '',
};

export default function VendorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('business');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessType, setBusinessType] = useState('');

  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [foodSafetyCertFile, setFoodSafetyCertFile] = useState<File | null>(null);
  const [ownerIdFile, setOwnerIdFile] = useState<File | null>(null);

  const [products, setProducts] = useState<VendorProductInput[]>([{ ...emptyProduct }]);
  const [productPhotos, setProductPhotos] = useState<(File | null)[]>([null]);
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const validateBusiness = () => {
    const errs: Record<string, string> = {};
    if (!ownerName) errs.ownerName = 'Owner name is required';
    if (!email) errs.email = 'Email is required';
    if (!phone) errs.phone = 'Phone is required';
    if (!password) errs.password = 'Password is required';
    if (!businessName) errs.businessName = 'Business name is required';
    if (!businessAddress) errs.businessAddress = 'Business address is required';
    if (!businessType) errs.businessType = 'Business type is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLicense = () => {
    const errs: Record<string, string> = {};
    if (!licenseNumber) errs.licenseNumber = 'License number is required';
    if (!licenseFile) errs.licenseFile = 'Please upload your business license';
    if (!foodSafetyCertFile) errs.foodSafetyCertFile = 'Please upload your food safety certificate';
    if (!ownerIdFile) errs.ownerIdFile = 'Please upload a valid ID';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateProducts = () => {
    const errs: Record<string, string> = {};
    const validProducts = products.filter((p) => p.name.trim());
    if (validProducts.length === 0) {
      errs.products = 'Add at least one product with a name';
    }
    validProducts.forEach((p, i) => {
      if (!p.price || p.price <= 0) errs[`price_${i}`] = 'Price must be greater than 0';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 'business' && !validateBusiness()) return;
    if (step === 'license' && !validateLicense()) return;
    if (step === 'products' && !validateProducts()) return;
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1].key);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1].key);
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addProduct = () => {
    setProducts([...products, { ...emptyProduct }]);
    setProductPhotos([...productPhotos, null]);
    setPhotoPreviews([...photoPreviews, null]);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) return;
    setProducts(products.filter((_, i) => i !== index));
    setProductPhotos(productPhotos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof VendorProductInput, value: string | number) => {
    setProducts(products.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const handlePhotoSelect = (index: number, file: File | null) => {
    const photos = [...productPhotos];
    photos[index] = file;
    setProductPhotos(photos);

    const previews = [...photoPreviews];
    previews[index] = file ? URL.createObjectURL(file) : null;
    setPhotoPreviews(previews);
  };

  const handleSubmit = async () => {
  setSubmitting(true);
  setSubmitError(null);
  try {
    const validProducts = products
      .map((p, i) => ({ ...p, photo: productPhotos[i] ?? undefined }))
      .filter((p) => p.name.trim());

    // Backend API will be connected here later.
    // Likely needs FormData (not JSON) since this submits files:
    // const formData = new FormData();
    // formData.append('owner_name', ownerName);
    // formData.append('email', email);
    // formData.append('phone', phone);
    // formData.append('password', password);
    // formData.append('business_name', businessName);
    // formData.append('business_address', businessAddress);
    // formData.append('business_type', businessType);
    // formData.append('license_number', licenseNumber);
    // if (licenseFile) formData.append('license_document', licenseFile);
    // if (foodSafetyCertFile) formData.append('food_safety_certificate', foodSafetyCertFile);
    // if (ownerIdFile) formData.append('owner_id_document', ownerIdFile);
    // formData.append('products', JSON.stringify(validProducts));
    // await apiFetch('/vendors/register', { method: 'POST', data: formData, headers: { 'Content-Type': 'multipart/form-data' } });

    setSubmitted(true);
  } catch (err) {
    console.error('Vendor registration failed:', err);
    setSubmitError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

  if (submitted) {
    return <VendorApplicationSubmitted />;
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* HEADER */}
      <header className="border-b border-[#2D312E]/[0.07] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center">
            <span className="font-display text-[28px] font-bold tracking-tight text-[#DCC48E]">Megeb</span>
            <span className="ml-1 font-display text-[34px] font-black leading-none text-[#DCC48E]">+</span>
          </div>
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="font-body inline-flex items-center gap-2 text-[13px] font-semibold text-[#2D312E]/65 transition hover:text-[#4E876E]"
          >
            <ArrowLeft size={16} />
            Back to Sign In
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(220,196,142,0.25) 0%, rgba(220,196,142,0) 70%)', filter: 'blur(15px)' }}
          />
          <div className="absolute -right-28 top-10 h-[330px] w-[330px] rounded-full border border-[#DCC48E]/15" />
          <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full border border-[#CCD6C4]/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-11 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Store size={15} className="text-[#DCC48E]" />
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-[#CCD6C4]">
                Vendor Verification
              </span>
            </div>
            <h1 className="font-display text-[34px] leading-[1.12] text-white sm:text-[42px]">
              Register Your Food Business
            </h1>
            <p className="font-body mt-4 max-w-2xl text-[14px] leading-6 text-white/60 sm:text-[15px]">
              List your products on Megeb+. Submit your business and license
              details and our team will review your application before your
              vendor account goes live.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="border-b border-[#2D312E]/[0.07] bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5 lg:px-8">
          <div className="flex items-center justify-center">
            {STEPS.map((s, index) => {
              const completed = stepIndex > index;
              const active = stepIndex === index;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                        completed
                          ? 'border-[#3D5A4C] bg-[#3D5A4C] text-white'
                          : active
                            ? 'border-[#3D5A4C] bg-[#E9F0EC] text-[#3D5A4C]'
                            : 'border-[#CCD6C4] bg-white text-[#2D312E]/35'
                      }`}
                    >
                      {completed ? <Check size={18} strokeWidth={2.5} /> : <Icon size={17} />}
                    </div>
                    <div className="mt-2 hidden text-center sm:block">
                      <p
                        className={`font-body text-[10px] font-bold uppercase tracking-[0.12em] ${
                          completed || active ? 'text-[#4E876E]' : 'text-[#2D312E]/35'
                        }`}
                      >
                        Step {s.number}
                      </p>
                      <p
                        className={`font-body mt-0.5 text-[12px] font-semibold ${
                          completed || active ? 'text-[#2D312E]' : 'text-[#2D312E]/35'
                        }`}
                      >
                        {s.label}
                      </p>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="mx-2 h-[2px] w-8 sm:mx-4 sm:w-16">
                      <div className={`h-full transition-all duration-500 ${stepIndex > index ? 'bg-[#3D5A4C]' : 'bg-[#CCD6C4]/50'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="font-body mt-3 text-center text-[11px] font-semibold text-[#2D312E]/45 sm:hidden">
            Step {stepIndex + 1} of {STEPS.length} · {STEPS[stepIndex].label}
          </p>
        </div>
      </section>

      {/* FORM */}
      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8 lg:py-12">
        {step === 'business' && (
          <FormSection number="01" icon={<UserRound size={20} />} title="Business Information" description="Tell us about yourself and your business.">
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Owner Full Name" value={ownerName} onChange={setOwnerName} placeholder="John Doe" error={errors.ownerName} required />
              <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="business@example.com" error={errors.email} required />
              <Input label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="+251911223344" error={errors.phone} required />
              <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a password" error={errors.password} required />
              <div className="md:col-span-2">
                <Input label="Business Name" value={businessName} onChange={setBusinessName} placeholder="Fresh Bowl Co." error={errors.businessName} required />
              </div>
              <div className="md:col-span-2">
                <Input label="Business Address" value={businessAddress} onChange={setBusinessAddress} placeholder="Bole, Addis Ababa" error={errors.businessAddress} required />
              </div>
              <div className="md:col-span-2">
                <SelectInput label="Business Type" value={businessType} onChange={setBusinessType} options={BUSINESS_TYPES} error={errors.businessType} required />
              </div>
            </div>
          </FormSection>
        )}

        {step === 'license' && (
          <FormSection number="02" icon={<IdCard size={20} />} title="License Verification" description="Provide your business license and required documents for verification by our admin team.">
            <div className="space-y-5">
              <Input label="License Number" value={licenseNumber} onChange={setLicenseNumber} placeholder="LIC-2024-00123" error={errors.licenseNumber} required />

              <FileUploadField
                label="Business License"
                helperText="PDF, PNG, or JPG up to 5MB"
                file={licenseFile}
                onSelect={setLicenseFile}
                error={errors.licenseFile}
              />

              <FileUploadField
                label="Food Safety Certificate"
                helperText="PDF, PNG, or JPG up to 5MB"
                file={foodSafetyCertFile}
                onSelect={setFoodSafetyCertFile}
                error={errors.foodSafetyCertFile}
              />

              <FileUploadField
                label="Owner ID"
                helperText="National ID, passport, or driver's license — PDF, PNG, or JPG"
                file={ownerIdFile}
                onSelect={setOwnerIdFile}
                error={errors.ownerIdFile}
              />
            </div>
          </FormSection>
        )}

        {step === 'products' && (
          <FormSection
            number="03"
            icon={<Package size={20} />}
            title="Your Products"
            description="Add the food items you sell with photos and prices."
            headerAction={
              <button
                type="button"
                onClick={addProduct}
                className="font-body inline-flex items-center gap-1.5 rounded-xl border border-[#3D5A4C]/20 px-3.5 py-2 text-[12px] font-semibold text-[#3D5A4C] transition hover:bg-[#E9F0EC]"
              >
                <Plus size={15} />
                Add Product
              </button>
            }
          >
            {errors.products && <p className="mb-4 text-[12px] font-medium text-red-600">{errors.products}</p>}

            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={index} className="rounded-xl border border-[#2D312E]/[0.08] bg-[#FAF9F6]/50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-body text-[12px] font-bold text-[#2D312E]/70">Product {index + 1}</span>
                    {products.length > 1 && (
                      <button type="button" onClick={() => removeProduct(index)} className="text-[#2D312E]/40 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Product Name" value={product.name} onChange={(v) => updateProduct(index, 'name', v)} placeholder="Injera" />
                    <Input label="Category" value={product.category} onChange={(v) => updateProduct(index, 'category', v)} placeholder="Grains" />
                    <div>
                      <Input
                        label="Price (ETB)"
                        type="number"
                        value={product.price ? String(product.price) : ''}
                        onChange={(v) => updateProduct(index, 'price', Number(v))}
                        placeholder="50"
                      />
                      {errors[`price_${index}`] && <p className="mt-1.5 text-[11px] font-medium text-red-600">{errors[`price_${index}`]}</p>}
                    </div>
                    <div>
                      <label className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75">Product Photo</label>
                      <div className="flex items-center gap-3">
                        {photoPreviews[index] ? (
                          <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={photoPreviews[index]!} alt="Product preview" className="h-16 w-16 rounded-lg object-cover" />
                            <button
                              type="button"
                              onClick={() => handlePhotoSelect(index, null)}
                              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-[#2D312E]/15 text-[#2D312E]/35 hover:border-[#4E876E] hover:bg-[#E9F0EC]/40 hover:text-[#4E876E]"
                          >
                            <Upload size={18} />
                          </button>
                        )}
                        <input
                          ref={(el) => { fileInputRefs.current[index] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoSelect(index, file);
                          }}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75">Product Description</label>
                      <textarea
                        rows={2}
                        value={product.description}
                        onChange={(e) => updateProduct(index, 'description', e.target.value)}
                        placeholder="Traditional Ethiopian flatbread made from teff flour."
                        className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-white px-4 py-3 text-[13.5px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 hover:border-[#2D312E]/20 focus:border-[#3D5A4C] focus:ring-4 focus:ring-[#3D5A4C]/10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FormSection>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.25)]">
              <div className="border-b border-[#2D312E]/[0.06] bg-[#E9F0EC]/50 px-6 py-6 sm:px-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#3D5A4C] text-white">
                    <ClipboardCheck size={20} />
                  </div>
                  <div>
                    <h2 className="font-display text-[23px] text-[#2D312E]">Review & Submit</h2>
                    <p className="font-body mt-1 text-[13px] leading-5 text-[#2D312E]/55">
                      Review your details before submitting your vendor application.
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-[#2D312E]/[0.06]">
                <ReviewRow
                  icon={<UserRound size={17} />}
                  title="Business Information"
                  values={[ownerName || 'Not provided', email || 'Not provided', phone || 'Not provided', `${businessName} · ${businessAddress}`]}
                />
                <ReviewRow
                  icon={<IdCard size={17} />}
                  title="License & Documents"
                  values={[
                    licenseNumber || 'Not provided',
                    licenseFile ? `Business License: ${licenseFile.name}` : 'Business License not uploaded',
                    foodSafetyCertFile ? `Food Safety Cert: ${foodSafetyCertFile.name}` : 'Food Safety Cert not uploaded',
                    ownerIdFile ? `Owner ID: ${ownerIdFile.name}` : 'Owner ID not uploaded',
                  ]}
                />
                <ReviewRow
                  icon={<Package size={17} />}
                  title={`Products (${products.filter((p) => p.name.trim()).length})`}
                  values={products.filter((p) => p.name.trim()).map((p) => `${p.name} · ${p.category || 'Uncategorized'} · ETB ${p.price}`)}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-[#DCC48E]/30 bg-[#DCC48E]/10 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 flex-shrink-0 text-[#4E876E]" />
                <div>
                  <h3 className="font-body text-[13px] font-bold text-[#2D312E]">What happens after you apply?</h3>
                  <p className="font-body mt-1 text-[12.5px] leading-5 text-[#2D312E]/60">
                    Your application will be reviewed by the Megeb+ team. Once your
                    license is verified, you will receive an email and your vendor
                    account will go live.
                  </p>
                </div>
              </div>
            </section>

            {submitError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[12.5px] font-medium text-red-600">{submitError}</p>
            )}
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-7 flex items-center justify-between gap-4">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="font-body inline-flex items-center gap-2 rounded-xl border border-[#2D312E]/15 bg-white px-5 py-3 text-[13px] font-semibold text-[#2D312E]/70 transition hover:border-[#3D5A4C]/30 hover:text-[#3D5A4C] disabled:opacity-50"
            >
              <ChevronLeft size={17} />
              Back
            </button>
          ) : (
            <div />
          )}

          {stepIndex < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="font-body group inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4E876E] hover:shadow-md"
            >
              Continue
              <ChevronRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="font-body group inline-flex items-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#4E876E] hover:shadow-md disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

/* FORM SECTION */

function FormSection({
  number,
  icon,
  title,
  description,
  headerAction,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#2D312E]/[0.07] bg-white shadow-[0_15px_35px_-18px_rgba(45,49,46,0.25)]">
      <div className="border-b border-[#2D312E]/[0.06] px-6 py-6 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E9F0EC] text-[#3D5A4C]">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-body text-[10px] font-bold tracking-[0.15em] text-[#DCC48E]">STEP {number}</span>
                <span className="h-1 w-1 rounded-full bg-[#CCD6C4]" />
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4E876E]">Required</span>
              </div>
              <h2 className="font-display mt-1 text-[23px] text-[#2D312E]">{title}</h2>
              <p className="font-body mt-1 text-[13px] leading-5 text-[#2D312E]/50">{description}</p>
            </div>
          </div>
          {headerAction}
        </div>
      </div>
      <div className="p-6 sm:p-7">{children}</div>
    </section>
  );
}

/* INPUT */

function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
        {label}
        {required && <span className="ml-1 text-[#4E876E]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13.5px] text-[#2D312E] outline-none transition placeholder:text-[#2D312E]/30 hover:border-[#2D312E]/20 focus:border-[#3D5A4C] focus:bg-white focus:ring-4 focus:ring-[#3D5A4C]/10"
      />
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}

/* SELECT */

function SelectInput({
  label,
  value,
  onChange,
  options,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
        {label}
        {required && <span className="ml-1 text-[#4E876E]">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-body w-full rounded-xl border border-[#2D312E]/12 bg-[#FAF9F6]/60 px-4 py-3 text-[13.5px] text-[#2D312E] outline-none transition hover:border-[#2D312E]/20 focus:border-[#3D5A4C] focus:bg-white focus:ring-4 focus:ring-[#3D5A4C]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}

/* FILE UPLOAD FIELD */

function FileUploadField({
  label,
  helperText,
  file,
  onSelect,
  error,
}: {
  label: string;
  helperText: string;
  file: File | null;
  onSelect: (file: File | null) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="font-body mb-2 block text-[12px] font-semibold text-[#2D312E]/75">
        {label}
        <span className="ml-1 text-[#4E876E]">*</span>
      </label>
      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-[#2D312E]/12 bg-[#E9F0EC]/40 px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-[#4E876E]" />
            <span className="font-body text-[13px] font-semibold text-[#2D312E]">{file.name}</span>
          </div>
          <button type="button" onClick={() => onSelect(null)} className="text-[#2D312E]/40 hover:text-red-500">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="group flex min-h-[90px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#2D312E]/20 bg-[#FAF9F6]/60 px-4 py-5 text-center transition hover:border-[#4E876E] hover:bg-[#E9F0EC]/40">
          <Upload size={20} className="text-[#4E876E] transition-transform group-hover:-translate-y-0.5" />
          <p className="font-body text-[12px] font-semibold text-[#2D312E]/75">Click to upload {label.toLowerCase()}</p>
          <p className="font-body text-[10px] text-[#2D312E]/40">{helperText}</p>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) onSelect(selected);
            }}
          />
        </label>
      )}
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}

/* REVIEW ROW */

function ReviewRow({ icon, title, values }: { icon: React.ReactNode; title: string; values: string[] }) {
  return (
    <div className="flex gap-4 px-6 py-5 sm:px-7">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#E9F0EC] text-[#4E876E]">{icon}</div>
      <div className="min-w-0">
        <h3 className="font-body text-[12px] font-bold text-[#2D312E]">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {values.map((value, index) => (
            <p key={index} className="font-body text-[11.5px] text-[#2D312E]/55">{value}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* SUCCESS SCREEN */

function VendorApplicationSubmitted() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push('/auth/login');
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-5 py-10">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#2D312E]/[0.07] bg-white shadow-[0_25px_60px_-20px_rgba(45,49,46,0.25)]">
        <div
          className="relative overflow-hidden px-6 py-10 text-center"
          style={{ background: 'linear-gradient(135deg, #2D312E 0%, #3D5A4C 55%, #4D6B5C 100%)' }}
        >
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#DCC48E]/15" />
          <div className="relative">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DCC48E]">
              <CheckCircle2 size={42} strokeWidth={1.8} className="text-[#3D5A4C]" />
            </div>
            <h1 className="font-display mt-5 text-[28px] text-white">Application Submitted</h1>
            <p className="font-body mt-3 text-[13px] leading-6 text-white/60">
              Thank you for registering your business with Megeb+.
            </p>
          </div>
        </div>

        <div className="p-7 text-center sm:p-9">
          <div className="rounded-2xl border border-[#CCD6C4] bg-[#E9F0EC] p-5">
            <p className="font-body text-[9px] font-bold uppercase tracking-[0.16em] text-[#4E876E]">Application Status</p>
            <p className="font-display mt-2 text-[18px] text-[#2D312E]">Pending Review</p>
            <p className="font-body mt-2 text-[12px] leading-5 text-[#2D312E]/55">
              Our team will verify your license and contact you once a decision has been made.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="font-body mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D5A4C] px-6 py-3.5 text-[13px] font-semibold text-white transition hover:bg-[#4E876E]"
          >
            Back to Sign In
            <ArrowRight size={16} />
          </button>

          <p className="font-body mt-4 text-[11px] text-[#2D312E]/40">
            Redirecting to sign in in {secondsLeft}s…
          </p>
        </div>
      </div>
    </main>
  );
}