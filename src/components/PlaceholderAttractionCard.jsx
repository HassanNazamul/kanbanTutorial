import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

export const PlaceholderAttractionCard = ({ onAdd }) => {
    return (
        <Card
            className="w-[180px] h-full flex flex-col justify-center items-center gap-2 border-dashed border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50/20 cursor-pointer transition-all duration-200 rounded-2xl"
            onClick={onAdd}
        >
            <CardContent className="flex flex-col items-center justify-center p-4">
                <Plus className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-sm text-gray-600 font-medium">Add new day</span>
            </CardContent>
        </Card>
    )
}
