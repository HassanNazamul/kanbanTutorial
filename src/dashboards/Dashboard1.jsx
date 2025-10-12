import React from 'react';

import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import DragAndDrop from '@/DragAndDrop';
import HorizontalCalendar from '@/calendar/HorizontalCalender';
import TemplateBoardList from '@/newLIstBoardFeature/TemplateBoard';

export default function Dashboard1() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger className="-ml-1" />
                {/* <header className="top-0 z-30 flex h-16 shrink-0 bg-red-200  items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                </header> */}

                <div className="sticky bg-red-200 top-2 flex flex-col gap-4 p-4 min-h-0 overflow-y-auto thin-scrollbar">

                    <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                        <div className="w-full bg-muted/50 aspect-[16/2] rounded-xl" >
                            <DragAndDrop />
                        </div>
                    </div>
                </div>
                {/* <DragAndDrop /> */}
                <TemplateBoardList />
            </SidebarInset>
        </SidebarProvider>
    )
}

