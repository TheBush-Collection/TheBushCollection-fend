import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { initAuthFromStorage } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Banknote, Percent, AlertCircle } from "lucide-react";

export default function PaymentForm({ bookingDetails, customerDetails, onPaymentSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const handlePayment = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const paymentAmount = getPaymentAmount();
            
            // Initialize PesaPal payment
            const response = await api.post('/api/payments/initiate', {
                amount: paymentAmount,
                currency: 'KES',
                description: `Booking for ${bookingDetails.propertyName}`,
                email: customerDetails.email,
                firstName: customerDetails.name.split(' ')[0],
                lastName: customerDetails.name.split(' ').slice(1).join(' '),
                phoneNumber: customerDetails.phone,
                bookingReference: generateBookingReference()
            });

            if (response.data.success) {
                // Redirect to PesaPal payment page
                window.location.href = response.data.redirectUrl;
            } else {
                throw new Error('Failed to initialize payment');
            }

        } catch (error) {
            console.error('💥 Payment error:', error);
            const errorMessage = error.response?.data?.error || 'Payment processing failed';
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const getPaymentAmount = () => {
        if (bookingDetails.paymentTerm === 'deposit' && bookingDetails.paymentSchedule) {
            return bookingDetails.paymentSchedule.depositAmount;
        }
        return bookingDetails.totalAmount;
    };

    const generateBookingReference = () => {
        return 'BK' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    };

    const paymentAmount = getPaymentAmount();
    const isDepositPayment = bookingDetails.paymentTerm === 'deposit';

    useEffect(() => {
        initAuthFromStorage();
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Banknote className="h-5 w-5 mr-2" />
                    Payment Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                    {/* Payment Summary */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-2">
                            {isDepositPayment ? (
                                <Percent className="h-4 w-4 text-blue-600 mr-2" />
                            ) : (
                                <Banknote className="h-4 w-4 text-green-600 mr-2" />
                            )}
                            <span className="font-semibold text-blue-900">
                                {isDepositPayment ? 'Deposit Payment' : 'Full Payment'}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-blue-800">Amount to Pay Now:</span>
                                <span className="font-bold text-blue-900">
                                    KES {paymentAmount.toFixed(2)}
                                </span>
                            </div>
                            {isDepositPayment && bookingDetails.paymentSchedule && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Balance Due Later:</span>
                                        <span className="text-blue-800">
                                            KES {bookingDetails.paymentSchedule.balanceAmount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        Balance due by: {new Date(bookingDetails.paymentSchedule.balanceDueDate).toLocaleDateString()}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isProcessing}
                        size="lg"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                            </>
                        ) : isDepositPayment ? (
                            `Pay KES ${paymentAmount.toFixed(2)} Deposit`
                        ) : (
                            `Pay KES ${paymentAmount.toFixed(2)}`
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}