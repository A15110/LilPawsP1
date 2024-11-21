import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Dalia Mays",
    rating: 5,
    text: "Kyla is a wonderful pet sitter who took great care of my dog Blue. I loved how she was able to give me updates by providing pictures for me and spending quality time with Blue while I was gone, I could tell my pet was in good hands. I will definitely be booking with Little Paws for the future!",
    date: "2024-11-21"
  },
  {
    id: 2,
    name: "Katie Houston",
    rating: 5,
    text: "I found Little Paws by recommendation from a colleague. My dog Ariella loves these two ladies.She was timid at first, but they took their time to make sure she was comfortable. And now she excitedly waits for their walks. It has been so helpful when we are in Jacksonville :) Wishing they did long distance house calls in California.",
    date: "2024-10-10"
  },
  {
    id: 3,
    name: "Josie Broussard",
    rating: 5,
    text: "I loved the special attention my pup received at Little Paws! The photos made my time away from my puppy so much easier!",
    date: "2024-11-02"
  }
];

export default function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">What Our Jacksonville Clients Say</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Trusted by pet parents across Jacksonville, from Riverside to the Beaches
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-primary-50 p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">{review.text}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-primary-800">{review.name}</span>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="https://g.page/r/CU_a3XOinFl8EBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors"
          >
            Leave a Review
          </a>
        </div>
      </div>
    </section>
  );
}