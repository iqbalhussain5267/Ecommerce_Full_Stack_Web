import { Headphones, Shield, Truck } from 'lucide-react';
import React from 'react';

const Feature = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          {/* Feature 1 */}
          <div className="flex items-center space-x-4 bg-background p-4 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">On Orders Over $50</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center space-x-4 bg-background p-4 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Secure Payment</h3>
              <p className="text-muted-foreground text-sm">100% Protected Guarantee</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center space-x-4 bg-background p-4 rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <Headphones className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Dedicated Customer Care</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
