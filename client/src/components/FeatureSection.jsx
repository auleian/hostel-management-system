import React from 'react'
import { Shield, Clock, Star } from "lucide-react"
import useInView from '@/hooks/useInView'

function FeatureSection() {
  const ref = useInView() 

  return (
    <div ref={ref} className="md:my-20 my-10 relative">
      <div className='gradient-edge'/>
      <div className='gradient-edge'/>

      <div className='marquee h-52'>
        <div className='marquee-box md:gap-12 gap-5'>
          {/*Duplicate for showing infinite display #Copy1*/}
              <section className="py-16 bg-muted/30">
                  <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">Verified Hostels</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          All hostels are verified and inspected to ensure quality and safety standards.
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">Instant Booking</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          Book your room instantly with our streamlined booking process. No waiting, no hassle.
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">Best Prices</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          Compare prices across multiple hostels and find the best deal for your budget.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
          {/*Duplicate for showing infinite display #Copy2*/}
                        <section className="py-16 bg-muted/30">
                  <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">Verified Hostels</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          All hostels are verified and inspected to ensure quality and safety standards.
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">Instant Booking</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          Book your room instantly with our streamlined booking process. No waiting, no hassle.
                        </p>
                      </div>
                      <div className="text-center space-y-3">
                        <div className="flex justify-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Star className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <h3 className="font-bold text-lg">Best Prices</h3>
                        <p className="text-sm text-muted-foreground text-pretty">
                          Compare prices across multiple hostels and find the best deal for your budget.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
        </div>
      </div>
     <div className='gradient-edge'/>
    </div>
  )
}

export default FeatureSection
