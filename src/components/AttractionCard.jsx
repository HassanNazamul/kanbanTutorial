import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AttractionItem } from "./AttractionItem"

export const AttractionCard = () => {
    return (
        <Card className="overflow-hidden rounded-2xl shadow-lg py-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
            {/* Main Image */}
            <div className="h-36 w-full">
                <img
                    src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000&auto=format&fit=crop"
                    alt="Hotel"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <CardContent className="px-4 pb-2">
                {/* Header */}
                <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm">
                        Time to Cover Attraction
                    </h3>
                    <h3 className="font-semibold text-gray-700 text-sm">Timeline</h3>
                </div>

                {/* Items */}
                <div className="divide-y">
                    <AttractionItem
                        image="https://i.pinimg.com/736x/21/83/ab/2183ab07ff2e0e561e0e0738705d4343.jpg"
                        title="Historical Landmark"
                        duration="2 hours"
                        timeline="2 hours"
                        timeOfDay="Morning"
                        location="Old Town, Rome"
                        description="Explore one of Rome's most iconic landmarks, rich with ancient history and classical architecture dating back to the Roman Empire."
                    />
                    <AttractionItem
                        image="https://i.pinimg.com/1200x/56/5c/c5/565cc50ebc028fa37730636557d1270b.jpg"
                        title="Art Gallery Walk"
                        duration="3 hours"
                        timeline="3 hours"
                        timeOfDay="Afternoon"
                        location="Downtown Art District"
                        description="Stroll through a collection of contemporary art galleries featuring works by both established and emerging local artists."
                    />
                    <AttractionItem
                        image="https://i.pinimg.com/1200x/72/63/0a/72630aaef041e5ad63c194852e0641ec.jpg"
                        title="Botanical Gardens"
                        duration="2 hours"
                        timeline="1.5 hours"
                        timeOfDay="Evening"
                        location="Central Park Conservatory"
                        description="Relax among lush greenery and exotic flora while the sun sets over the peaceful garden pathways."
                    />
                </div>
            </CardContent>
        </Card>
    )
}



// Decrease image height
//decrease the height of the main picture to decrease the overal height
//when hovering the small images, more information should appear
//hover effect on card and item
//Additional information dialog box

