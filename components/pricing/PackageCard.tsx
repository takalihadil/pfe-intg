'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PackageCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended: boolean;
  delay?: number;
}

const PackageCard = ({
  name,
  price,
  description,
  features,
  recommended,
  delay = 0,
}: PackageCardProps) => {
  return (
    <Card
      className={`
        overflow-hidden transition-all duration-300
        border-2 hover:shadow-xl
        ${recommended ? 'border-indigo-500 shadow-lg' : 'border-transparent'} 
        animate-fade-in
      `}
      style={{ animationDelay: `${delay}s` }}
    >
      {recommended && (
        <div className="bg-indigo-500 text-white text-center py-2 font-bold">
          MOST POPULAR
        </div>
      )}

      <CardHeader className={`pb-8 ${recommended ? 'bg-indigo-50' : ''}`}>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && (
            <span className="text-gray-500 ml-1">/month</span>
          )}
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-8">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 text-indigo-500 rounded-full bg-indigo-100 p-1 mt-0.5">
                <Check size={12} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pb-8 flex justify-center">
        <Link href="/signup" passHref>
          <Button className={recommended ? 'bg-indigo-500 hover:bg-indigo-600' : ''}>
            Get Started
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
