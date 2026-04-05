"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  TruckIcon,
  Shield01Icon,
  Tick02Icon,
  Loading03Icon,
  Upload01Icon,
  QrCodeIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { useCart } from "@/contexts/CartContext";

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;
}

const inputBase =
  "w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 text-sm text-dark-charcoal placeholder:text-gray-300 focus:border-dark-charcoal focus:ring-0 focus:outline-none transition-colors duration-200";
const inputError =
  "w-full px-0 py-3 bg-transparent border-0 border-b border-parofc-red text-sm text-dark-charcoal placeholder:text-gray-300 focus:border-dark-charcoal focus:ring-0 focus:outline-none transition-colors duration-200";

function CheckoutHero({
  title,
  description,
  step,
  back,
}: {
  title: string;
  description?: string;
  step?: string;
  back?: { href: string; label: string };
}) {
  return (
    <div className="relative bg-dark-charcoal overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
        }}
      />
      <div className="container mx-auto px-4 py-8 md:py-10 relative z-10">
        <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
          Official Merchandise
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none">
              {title}
            </h1>
            {description ? (
              <p className="text-sm text-white/70 mt-3 max-w-xl">{description}</p>
            ) : null}
            {step ? (
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-3">
                {step}
              </p>
            ) : null}
          </div>
          {back ? (
            <Link
              href={back.href}
              className="inline-flex items-center gap-2 text-xs font-bold text-white/70 hover:text-white uppercase tracking-wider transition-colors shrink-0"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              {back.label}
            </Link>
          ) : null}
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
    </div>
  );
}

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [paymentQrCodeUrl, setPaymentQrCodeUrl] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderCurrency, setOrderCurrency] = useState("BTN");
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summaryPaymentQrUrl, setSummaryPaymentQrUrl] = useState<string | null>(
    null,
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const [checkoutType, setCheckoutType] = useState<
    "domestic" | "international"
  >("domestic");
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    notes: "",
  });

  useEffect(() => {
    const productId = items[0]?._id;
    if (!productId) {
      setSummaryPaymentQrUrl(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/checkout/payment-qr?productId=${encodeURIComponent(productId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.paymentQrCodeUrl) {
          setSummaryPaymentQrUrl(data.paymentQrCodeUrl);
        } else if (!cancelled) {
          setSummaryPaymentQrUrl(null);
        }
      })
      .catch(() => {
        if (!cancelled) setSummaryPaymentQrUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const formatPrice = (price: number, currency: string) => {
    if (currency === "BTN") return `Nu. ${price.toLocaleString()}`;
    if (currency === "USD") return `$${price.toLocaleString()}`;
    if (currency === "EUR") return `€${price.toLocaleString()}`;
    return `${price.toLocaleString()} ${currency}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};
    if (!customerDetails.firstName.trim()) newErrors.firstName = "Required";
    if (!customerDetails.lastName.trim()) newErrors.lastName = "Required";
    if (!customerDetails.email.trim()) {
      newErrors.email = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = "Invalid email";
    }
    if (!customerDetails.phone.trim()) newErrors.phone = "Required";
    if (!customerDetails.address.trim()) newErrors.address = "Required";
    if (!customerDetails.city.trim()) newErrors.city = "Required";
    if (checkoutType === "international" && !customerDetails.zipCode.trim()) {
      newErrors.zipCode = "Required";
    }
    if (checkoutType === "international" && !customerDetails.country.trim()) {
      newErrors.country = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerDetails]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            ...customerDetails,
            zipCode: checkoutType === "domestic" ? "" : customerDetails.zipCode,
            country:
              checkoutType === "domestic" ? "Bhutan" : customerDetails.country,
          },
          items,
          subtotal: getSubtotal(),
          currency: items[0]?.currency || "BTN",
          checkoutType,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setOrderId(data.orderId);
        const subtotal = getSubtotal();
        setOrderTotal(subtotal + 150);
        setOrderCurrency(items[0]?.currency || "BTN");
        setPaymentQrCodeUrl(data.paymentQrCodeUrl ?? null);
        setShowPaymentStep(true);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadPayment = async () => {
    if (!selectedFile || !orderId) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("file", selectedFile);
      const res = await fetch("/api/checkout/upload-payment", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentProofUploaded(true);
        setUploadedImageUrl(data.imageUrl || null);
        setSelectedFile(null);
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompleteOrder = () => {
    setOrderComplete(true);
    clearCart();
  };

  // ─── Order Success ───
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <CheckoutHero
          title="Order Confirmed"
          description="Thank you for your purchase."
          step={`Order ${orderId}`}
        />
        <div className="max-w-lg mx-auto px-4 py-12 md:py-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-emerald-500 mx-auto mb-6 flex items-center justify-center"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                size={32}
                className="text-white"
              />
            </motion.div>

            <div className="border border-gray-100 p-5 mb-8 text-left">
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to{" "}
                <strong className="text-dark-charcoal">
                  {customerDetails.email}
                </strong>
                . Our team will contact you shortly to confirm your order and
                arrange delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="bg-dark-charcoal text-white px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-parofc-red transition-colors cursor-pointer text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="bg-gray-50 text-dark-charcoal px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer text-center"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Payment Step ───
  if (showPaymentStep && !orderComplete) {
    return (
      <div className="min-h-screen bg-white">
        <CheckoutHero
          title="Complete Payment"
          description={`Order ${orderId} — ${formatPrice(orderTotal, orderCurrency)}`}
          step="Step 2 of 2 — Payment"
          back={{ href: "/shop", label: "Back to shop" }}
        />

        <div className="max-w-lg mx-auto px-4 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >

            {/* QR Code */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Scan to Pay
              </p>
              {paymentQrCodeUrl ? (
                <div className="inline-block border border-gray-100 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={paymentQrCodeUrl}
                    alt="Scan to pay"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border border-gray-100">
                  <HugeiconsIcon
                    icon={QrCodeIcon}
                    size={24}
                    className="text-gray-300 flex-shrink-0"
                  />
                  <p className="text-xs text-gray-400">
                    Payment QR is not set for this product. Contact support or
                    complete the order after paying via another method.
                  </p>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Upload Payment Proof
              </p>
              <p className="text-xs text-gray-400 mb-4">
                After paying, upload a screenshot of your payment confirmation.
              </p>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    setSelectedFile(e.target.files?.[0] || null);
                    setUploadError(null);
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2.5 file:px-4 file:border-0 file:bg-dark-charcoal file:text-white file:font-bold file:text-xs file:uppercase file:tracking-wider file:cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleUploadPayment}
                  disabled={!selectedFile || isUploading}
                  className="inline-flex items-center gap-2 bg-dark-charcoal text-white px-5 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-parofc-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {isUploading ? (
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <HugeiconsIcon icon={Upload01Icon} size={14} />
                  )}
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {uploadError && (
                <p className="mt-2 text-xs font-semibold text-parofc-red">
                  {uploadError}
                </p>
              )}

              {paymentProofUploaded && (
                <div className="mt-4 p-4 border border-emerald-200 bg-emerald-50/50">
                  <p className="text-xs font-bold text-emerald-700 flex items-center gap-2 mb-2">
                    <HugeiconsIcon icon={Tick02Icon} size={14} /> Payment proof
                    uploaded
                  </p>
                  {uploadedImageUrl && (
                    <div className="flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={uploadedImageUrl}
                        alt="Your payment proof"
                        className="max-w-full max-h-40 object-contain border border-emerald-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleCompleteOrder}
              disabled={!paymentProofUploaded}
              className="w-full h-14 bg-dark-charcoal text-white font-bold text-sm uppercase tracking-wider hover:bg-parofc-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Complete Order
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Empty Cart ───
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <CheckoutHero
          title="Checkout"
          description="Your cart is empty. Add items from the shop to continue."
          back={{ href: "/shop", label: "Browse shop" }}
        />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <HugeiconsIcon
              icon={ShoppingBag01Icon}
              size={40}
              className="text-gray-200 mx-auto mb-4"
            />
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-dark-charcoal text-white px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-parofc-red transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Browse shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Checkout Form ───
  const subtotal = getSubtotal();
  const shipping = 150;
  const total = subtotal + shipping;
  const currency = items[0]?.currency || "BTN";

  return (
    <div className="min-h-screen bg-white">
      <CheckoutHero
        title="Checkout"
        step="Step 1 of 2 — Details"
        back={{ href: "/shop", label: "Back to shop" }}
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-10"
            >
              {/* Delivery Type */}
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Delivery Type
                </h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutType("domestic")}
                    className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      checkoutType === "domestic"
                        ? "bg-dark-charcoal text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    Domestic
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutType("international")}
                    className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      checkoutType === "international"
                        ? "bg-dark-charcoal text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    International
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  {checkoutType === "domestic"
                    ? "Delivery within Bhutan. Postal code not required."
                    : "International shipping. Postal code required."}
                </p>
              </div>

              {/* Contact */}
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={customerDetails.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? inputError : inputBase}
                      placeholder="First name"
                    />
                    {errors.firstName && (
                      <p className="text-[10px] text-parofc-red font-semibold mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={customerDetails.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? inputError : inputBase}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="text-[10px] text-parofc-red font-semibold mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      className={errors.email ? inputError : inputBase}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-parofc-red font-semibold mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      WhatsApp No. *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? inputError : inputBase}
                      placeholder="+975 17XXXXXX"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-parofc-red font-semibold mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-1">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      className={errors.address ? inputError : inputBase}
                      placeholder="Street address"
                    />
                    {errors.address && (
                      <p className="text-[10px] text-parofc-red font-semibold mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={customerDetails.city}
                        onChange={handleInputChange}
                        className={errors.city ? inputError : inputBase}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-[10px] text-parofc-red font-semibold mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Dzongkhag / State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={customerDetails.state}
                        onChange={handleInputChange}
                        className={inputBase}
                        placeholder="Dzongkhag / State"
                      />
                    </div>
                  </div>
                  {checkoutType === "international" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Postal Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={customerDetails.zipCode}
                          onChange={handleInputChange}
                          className={errors.zipCode ? inputError : inputBase}
                          placeholder="Postal code"
                        />
                        {errors.zipCode && (
                          <p className="text-[10px] text-parofc-red font-semibold mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Country *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={customerDetails.country}
                          onChange={handleInputChange}
                          className={errors.country ? inputError : inputBase}
                          placeholder="Country"
                        />
                        {errors.country && (
                          <p className="text-[10px] text-parofc-red font-semibold mt-1">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Notes (Optional)
                </h2>
                <textarea
                  name="notes"
                  value={customerDetails.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-gray-200 text-sm text-dark-charcoal placeholder:text-gray-300 focus:border-dark-charcoal focus:ring-0 focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    size={14}
                    className="text-parofc-gold"
                  />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Secure Checkout
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={TruckIcon}
                    size={14}
                    className="text-parofc-gold"
                  />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Fast Delivery
                  </span>
                </div>
              </div>

              {/* Mobile Submit */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-dark-charcoal text-white font-bold text-sm uppercase tracking-wider hover:bg-parofc-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <HugeiconsIcon
                        icon={Loading03Icon}
                        size={16}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    `Place Order · ${formatPrice(total, currency)}`
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-3">
                    <div className="relative w-14 h-14 bg-gray-50 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                      <span className="absolute -top-0.5 -right-0.5 bg-dark-charcoal text-white text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-dark-charcoal truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        Size: {item.size}
                      </p>
                      <p className="text-xs font-bold text-dark-charcoal mt-0.5">
                        {formatPrice(
                          (item.salePrice || item.price) * item.quantity,
                          item.currency,
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-medium text-dark-charcoal tabular-nums">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium text-dark-charcoal tabular-nums">
                    {formatPrice(shipping, currency)}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-sm font-black text-dark-charcoal uppercase">
                    Total
                  </span>
                  <span className="text-sm font-black text-dark-charcoal tabular-nums">
                    {formatPrice(total, currency)}
                  </span>
                </div>
              </div>

              {/* Payment QR */}
              {summaryPaymentQrUrl && (
                <div className="mt-5 p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Scan to Pay
                  </p>
                  <div className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={summaryPaymentQrUrl}
                      alt="Scan to pay"
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* COD Note */}
              <div className="mt-4 p-3 bg-parofc-gold/5 border border-parofc-gold/10">
                <p className="text-[10px] text-gray-500">
                  <strong className="text-dark-charcoal">Payment:</strong> Cash
                  on Delivery (COD). You pay when your order arrives.
                </p>
              </div>

              {/* Desktop Submit */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="hidden lg:flex w-full h-14 mt-6 bg-dark-charcoal text-white font-bold text-sm uppercase tracking-wider hover:bg-parofc-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={16}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
