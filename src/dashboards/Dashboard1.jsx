import React from 'react';

import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import DragAndDrop from '@/DragAndDrop';
import TemplateBoardList from '@/newLIstBoardFeature/TemplateBoard';

export default function Dashboard1() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger className="-ml-1" />

                <div className="sticky bg-red-200 top-2 flex flex-col gap-4 p-4 min-h-0 overflow-y-auto thin-scrollbar">

                    <div className="grid auto-rows-min gap-2 px-10 md:grid-cols-1">
                        <div className="w-full bg-muted/50 aspect-[16/2] rounded-xl" >
                            <DragAndDrop />
                        </div>
                    </div>
                </div>
                <TemplateBoardList />
            </SidebarInset>
        </SidebarProvider>
    )
}

