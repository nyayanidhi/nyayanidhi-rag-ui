"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { useState } from "react";

interface PlanDetails {
    user_email: string;
    plan: number;
    subscription_start_date: string;
    subscription_end_date: string;
  }

export default function Plans() {
  const [planDetails, setPlanDetails] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await fetch('/api/userPlan');
        const data = await response.json();
        if (data.success) {
          setPlanDetails(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch plan details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, []);

  const simplePlan = 'Basic Plan'
  const premiumPlan = 'Premium Plan'

  const getPlanMessage = () => {
    if (!planDetails) return '';
    
    switch (planDetails.plan) {
      case 0:
        return '';
      case 1:
        return `You are on the ${simplePlan} which expires on ${planDetails.subscription_end_date}`;
      case 2:
        return `You are on the ${premiumPlan} which expires on ${planDetails.subscription_end_date}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">Select the perfect plan for your needs</p>
          {!loading && (
            <p className="mt-4 text-lg font-medium text-blue-600">
              {getPlanMessage()}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="relative hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">{simplePlan}</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹5,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Up to 100 documents per month
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Basic document analysis
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Email support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="relative hover:shadow-xl transition-shadow border-blue-500 border-2">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm">
              Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{premiumPlan}</CardTitle>
              <CardDescription>For professional users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹7,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Unlimited documents
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Advanced document analysis
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Priority support
                </li>
                <li className="flex items-center">
                  <CheckIcon className="mr-2" /> Custom features
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-500 hover:bg-blue-600" size="lg">
                Get Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      className={`w-5 h-5 text-green-500 ${className}`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}