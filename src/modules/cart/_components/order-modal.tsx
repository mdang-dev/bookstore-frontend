import React, { useEffect, useState } from 'react';
import {
  Package,
  User,
  MapPin,
  CheckCircle,
  CreditCard,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/hooks/use-user';
import { CartItem } from '@/stores/cart.store';

export interface OrderData {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function OrderModal({
  isOpen,
  onClose,
  onConfirm,
  cartItems,
  total,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderData: OrderData) => void;
  cartItems: CartItem[];
  total: number;
}) {
  const { user } = useUser();
  const [orderData, setOrderData] = useState<OrderData>({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnamese',
  });

  useEffect(() => {
    if (user) {
      setOrderData({
        ...orderData,
        name: `${user.firstName} ${user.lastName}`,
        email: `${user.email}`,
      });
    }
  }, [user]);

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onConfirm(orderData);
    setIsProcessing(false);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return orderData.name && orderData.email && orderData.phone;
      case 2:
        return (
          orderData.addressLine1 &&
          orderData.city &&
          orderData.state &&
          orderData.zipCode
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const progressValue = (step / 3) * 100;
  const stepTitles = [
    'Customer Information',
    'Delivery Address',
    'Order Review',
  ];

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4`}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border dark:border-gray-700">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              Complete Your Order
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span>Step {step} of 3</span>
              <span className="text-white/90">{stepTitles[step - 1]}</span>
            </div>

            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressValue}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center mt-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= stepNum
                        ? 'bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 shadow-lg scale-105'
                        : 'bg-white/20 text-white/70'
                    }`}
                  >
                    {step > stepNum ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`h-1 w-20 mx-3 rounded transition-all duration-300 ${
                        step > stepNum ? 'bg-white' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(90vh-300px)]">
          <div className="p-6   bg-white dark:bg-gray-900">
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100 dark:border-blue-800">
                    <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Customer Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please provide your contact details
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={orderData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Address */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-50 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-100 dark:border-green-800">
                    <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Where should we deliver your order?
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={orderData.addressLine1}
                      onChange={(e) =>
                        handleInputChange('addressLine1', e.target.value)
                      }
                      className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={orderData.addressLine2}
                      onChange={(e) =>
                        handleInputChange('addressLine2', e.target.value)
                      }
                      className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={orderData.city}
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                        className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                        placeholder="City"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={orderData.state}
                        onChange={(e) =>
                          handleInputChange('state', e.target.value)
                        }
                        className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={orderData.zipCode}
                        onChange={(e) =>
                          handleInputChange('zipCode', e.target.value)
                        }
                        className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                        placeholder="ZIP Code"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={orderData.country}
                        onChange={(e) =>
                          handleInputChange('country', e.target.value)
                        }
                        className="w-full h-11 px-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="Vietnamese">Vietnamese</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-100 dark:border-emerald-800">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Review Your Order
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please review your order details before confirming
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Customer Info Review */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Customer Information
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Name:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {orderData.name}
                        </span>
                      </div>
                      <div className="flex justify-between encodeURIComponentitems-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Email:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {orderData.email}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                          Phone:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {orderData.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address Review */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/50 dark:to-emerald-900/50 rounded-xl p-4 border border-green-100 dark:border-green-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                      Delivery Address
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p className="font-medium">{orderData.addressLine1}</p>
                      {orderData.addressLine2 && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {orderData.addressLine2}
                        </p>
                      )}
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.city}, {orderData.state} {orderData.zipCode}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {orderData.country}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        Order Items
                      </h4>
                      <span className="bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                        {cartItems.length}{' '}
                        {cartItems.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item, index) => (
                        <div key={item.product.code}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                ${item.product.price} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                $
                                {(
                                  Number(item.product.price) * item.quantity
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {index < cartItems.length - 1 && (
                            <div className="border-t border-purple-200 dark:border-purple-800 mt-3" />
                          )}
                        </div>
                      ))}

                      <div className="border-t-2 border-purple-200 dark:border-purple-800 pt-3 mt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-gray-900 dark:text-gray-100">
                            Total Amount
                          </span>
                          <span className="text-purple-600 dark:text-purple-400 text-xl">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <button
            onClick={step === 1 ? onClose : handlePrevStep}
            className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex gap-3">
            {step < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Confirm Order
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
