"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { ExternalLink, ArrowUpRight } from "lucide-react"
import Image from "next/image"

interface StoreItem {
  id: number
  title: string
  description: string
  headerImage: string
  productImage: string
}

const storeItems: StoreItem[] = [
  {
    id: 1,
    title: "KITS",
    description: "Get your favourite kit for the 25/26 season here.",
    headerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    productImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop",
  },
  {
    id: 2,
    title: "TRAINING",
    description: "Get the new training collection and dress like your favorite players.",
    headerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    productImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop",
  },
  {
    id: 3,
    title: "MEMORABILIA",
    description: "Buy unique and exclusive pieces that tell the stories of Paro FC.",
    headerImage: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800&h=400&fit=crop",
    productImage: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=400&h=500&fit=crop",
  },
]

export function StoreSection() {
  return (
    <section className="py-16 px-4 relative">
      <div className="container mx-auto">
        {/* Header Text */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-gray-900">
            Paro FC Official Worldwide Store
          </h3>
        </div>

        {/* Button Below Text */}
        <div className="flex justify-end mb-12">
          <Button
            variant="default"
            className="bg-barca-gold hover:bg-barca-gold/90 text-dark-charcoal"
          >
            Paro FC Official Worldwide Store
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Three Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {storeItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-md overflow-hidden shadow-lg flex flex-col h-[500px]"
            >
              {/* Top Half - Header Image */}
              <div className="relative h-[200px] overflow-hidden flex-shrink-0 rounded-t-md">
                <Image
                  src={item.headerImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Bottom Half - Two Columns */}
              <div className="flex flex-1">
                {/* First Column - Product Image */}
                <div className="w-1/2 bg-gray-50 flex items-center justify-center p-4 h-[250px]">
                  <div className="relative w-full h-full rounded-md overflow-hidden">
                    <Image
                      src={item.productImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Second Column - Title, Description, Button */}
                <div className="w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 uppercase mb-3">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Shop Now Button at Bottom */}
                  <button className="flex items-center gap-2 text-barca-gold font-bold uppercase text-sm mt-4 hover:opacity-80 transition-opacity">
                    SHOP NOW
                    <div className="w-6 h-6 rounded-full bg-barca-gold flex items-center justify-center">
                      <ArrowUpRight className="w-3 h-3 text-dark-charcoal" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

